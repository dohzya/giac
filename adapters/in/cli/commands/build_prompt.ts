/**
 * Command: build a prompt from a spec and profile.
 */

import type { BuildPromptUseCase } from "~/core/application/ports/in/build_prompt.ts";
import type { GetSpecUseCase } from "~/core/application/ports/in/get_spec.ts";
import type { PartialProfile, Profile } from "~/core/domain/profile.ts";
import { getMissingAxes } from "~/core/domain/profile.ts";
import { getAxesInPriority } from "~/core/domain/spec.ts";
import { ExplicitCast } from "~/core/common/explicit_cast.ts";
import { buildProfileInteractively as defaultBuildProfileInteractively } from "../interactive/profile_flow.ts";
import { parseArgs } from "../args.ts";
import { getMessages } from "../messages.ts";
import * as ui from "../ui.ts";

export async function executeBuildPrompt(
  getSpec: GetSpecUseCase,
  buildPrompt: BuildPromptUseCase,
  args: string[],
  buildProfileInteractivelyFn: typeof defaultBuildProfileInteractively =
    defaultBuildProfileInteractively,
): Promise<void> {
  try {
    const spec = await getSpec.execute();

    const parsed = parseArgs(spec, args);
    let profile: Profile = ExplicitCast.from<PartialProfile>(parsed.profile)
      .cast<Profile>();

    const missing = getMissingAxes(
      parsed.profile,
      getAxesInPriority(spec).map((a) => a.id),
    );
    if (missing.length > 0) {
      const msg = getMessages(parsed.lang);
      ui.info(msg.infoInteractiveModeActivated);
      profile = await buildProfileInteractivelyFn(
        spec,
        parsed.profile,
        parsed.lang,
      );
    }

    const prompt = buildPrompt.execute(spec, profile, parsed.lang);

    ui.info(prompt);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const msg = getMessages("fr");
    ui.error(`${msg.errorGeneratingPrompt}: ${message}`);
    Deno.exit(1);
  }
}
