/**
 * Command: build a prompt from a spec and profile.
 */

import type { BuildPromptUseCase } from "~/core/application/ports/in/build_prompt.ts";
import type { GetSpecUseCase } from "~/core/application/ports/in/get_spec.ts";
import type { PartialProfile, Profile } from "~/core/domain/profile.ts";
import { getMissingAxes } from "~/core/domain/profile.ts";
import { ExplicitCast } from "~/core/common/explicit_cast.ts";
import { buildProfileInteractively } from "../interactive/profile_flow.ts";
import { parseArgs } from "../args.ts";
import * as ui from "../ui.ts";

export async function executeBuildPrompt(
  getSpec: GetSpecUseCase,
  buildPrompt: BuildPromptUseCase,
  args: string[],
): Promise<void> {
  try {
    const spec = await getSpec.execute();

    const parsed = parseArgs(spec, args);
    let profile: Profile = ExplicitCast.from<PartialProfile>(parsed.profile)
      .cast<Profile>();

    const missing = getMissingAxes(parsed.profile);
    if (missing.length > 0) {
      ui.info("Certains axes ne sont pas spécifiés. Mode interactif activé.");
      profile = await buildProfileInteractively(
        spec,
        parsed.profile,
        parsed.lang,
      );
    }

    const prompt = buildPrompt.execute(spec, profile, parsed.lang);

    ui.info(prompt);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    ui.error(`Erreur lors de la génération du prompt: ${message}`);
    Deno.exit(1);
  }
}
