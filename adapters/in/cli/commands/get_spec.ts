/**
 * Command: show the specification.
 */

import type { GetSpecUseCase } from "~/core/application/ports/in/get_spec.ts";
import type { Language } from "~/core/application/ports/in/build_prompt.ts";
import { parseArgs, parseArgsSimple } from "../args.ts";
import { resolveAxis } from "~/core/domain/spec.ts";
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
        const errorMsg = lang === "fr"
          ? `Axe introuvable: ${axisInput}`
          : `Axis not found: ${axisInput}`;
        const helpMsg = lang === "fr"
          ? "Utilisez un ID, une initiale, ou un nom d'axe (FR ou EN)"
          : "Use an ID, an initial, or an axis name (FR or EN)";
        ui.error(errorMsg);
        ui.info(helpMsg);
        Deno.exit(1);
      }

      const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
      ui.title(`=== ${axisName} ===`);

      const initialsLabel = lang === "fr" ? "Initiales:" : "Initials:";
      ui.dim(`${initialsLabel} ${axis.initials.join(", ")}`);

      const descriptionLabel = lang === "fr" ? "Description:" : "Description:";
      const description = lang === "fr"
        ? axis.descriptionFr
        : axis.descriptionEn;
      ui.dim(`${descriptionLabel} ${description}`);

      const levelsLabel = lang === "fr" ? "Niveaux:" : "Levels:";
      ui.title(`\n${levelsLabel}`);

      for (const levelDef of axis.levels) {
        const levelName = lang === "fr" ? levelDef.nameFr : levelDef.nameEn;
        ui.info(`  ${levelDef.level}: ${levelName}`);
        const fragment = lang === "fr"
          ? levelDef.promptFragmentFr
          : levelDef.promptFragmentEn;
        ui.dim(`    ${fragment}`);
      }
    } else {
      const title = lang === "fr" ? "Spécification GIAC" : "GIAC Specification";
      ui.title(`=== ${title} ===`);
      ui.info(`\n${lang === "fr" ? spec.descriptionFr : spec.descriptionEn}`);

      for (const axis of spec.axes) {
        const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
        ui.title(`\n${axisName}`);

        const initialsLabel = lang === "fr" ? "Initiales:" : "Initials:";
        ui.dim(`${initialsLabel} ${axis.initials.join(", ")}`);

        const descriptionLabel = lang === "fr"
          ? "Description:"
          : "Description:";
        const description = lang === "fr"
          ? axis.descriptionFr
          : axis.descriptionEn;
        ui.dim(`${descriptionLabel} ${description}`);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const errorMsg = lang === "fr"
      ? `Erreur lors de la récupération de la spec: ${message}`
      : `Error retrieving spec: ${message}`;
    ui.error(errorMsg);
    Deno.exit(1);
  }
}
