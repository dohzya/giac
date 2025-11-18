/**
 * Command: show the specification.
 */

import type { GetSpecUseCase } from "~/core/application/ports/in/get_spec.ts";
import type { Language } from "~/core/application/ports/in/build_prompt.ts";
import { parseArgs, parseArgsSimple } from "../args.ts";
import { resolveAxis } from "~/core/domain/spec.ts";
import { getMessages } from "../messages.ts";
import * as ui from "../ui.ts";

export async function executeGetSpec(
  getSpec: GetSpecUseCase,
  args: string[],
): Promise<void> {
  let lang: Language = "fr";
  try {
    const spec = await getSpec.execute();

    const parsed = parseArgs(spec, args);
    lang = parsed.lang;

    const flags = parseArgsSimple(args);
    const axisInput = flags.axis as string | undefined ||
      args.find((arg) =>
        !arg.startsWith("-") && arg !== "spec" && arg !== "show"
      );

    if (axisInput) {
      const axis = resolveAxis(spec, axisInput);
      if (!axis) {
        const msg = getMessages(lang);
        ui.error(`${msg.errorAxisNotFound}: ${axisInput}`);
        ui.info(msg.helpAxisIdentifier);
        Deno.exit(1);
      }

      const msg = getMessages(lang);
      const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
      ui.title(`=== ${axisName} ===`);

      ui.dim(`${msg.labelInitials} ${axis.initials.join(", ")}`);

      const description = lang === "fr"
        ? axis.descriptionFr
        : axis.descriptionEn;
      ui.dim(`${msg.labelDescription} ${description}`);

      ui.title(`\n${msg.labelLevels}`);

      for (const levelDef of axis.levels) {
        const levelName = lang === "fr" ? levelDef.nameFr : levelDef.nameEn;
        ui.info(`  ${levelDef.level}: ${levelName}`);
        const fragment = lang === "fr"
          ? levelDef.promptFragmentFr
          : levelDef.promptFragmentEn;
        ui.dim(`    ${fragment}`);
      }
    } else {
      const msg = getMessages(lang);
      ui.title(`=== ${msg.titleSpecification} ===`);
      ui.info(`\n${lang === "fr" ? spec.descriptionFr : spec.descriptionEn}`);

      for (const axis of Object.values(spec.axes)) {
        const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
        ui.title(`\n${axisName}`);

        ui.dim(`${msg.labelInitials} ${axis.initials.join(", ")}`);

        const description = lang === "fr"
          ? axis.descriptionFr
          : axis.descriptionEn;
        ui.dim(`${msg.labelDescription} ${description}`);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const msg = getMessages(lang);
    ui.error(`${msg.errorRetrievingSpec}: ${message}`);
    Deno.exit(1);
  }
}
