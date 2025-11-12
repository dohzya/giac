/**
 * Service implementing BuildPromptUseCase.
 * Pure core logic: no I/O, only computation.
 */

import type { BuildPromptUseCase, Language } from "../ports/in/build_prompt.ts";
import type { Profile } from "~/core/domain/profile.ts";
import type { Prompt } from "~/core/domain/prompt.ts";
import type { Spec } from "~/core/domain/spec.ts";
import { getAxisById, getAxisIds } from "~/core/domain/spec.ts";
import { getLevel } from "~/core/domain/axis.ts";

export class BuildPromptService implements BuildPromptUseCase {
  execute(spec: Spec, profile: Profile, lang: Language): Prompt {
    const lines: string[] = [];

    const header = lang === "fr"
      ? spec.promptFragmentFr
      : spec.promptFragmentEn;
    lines.push(header);
    lines.push("");

    const axisIds = getAxisIds();
    const profileParts: string[] = [];
    for (const axisId of axisIds) {
      const axis = getAxisById(spec, axisId);
      if (!axis) continue;

      const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
      const level = profile[axisId];
      profileParts.push(`${axisName}=${level}`);
    }
    lines.push(`Profil: ${profileParts.join(" ")}`);
    lines.push("");

    for (const axisId of axisIds) {
      const axis = getAxisById(spec, axisId);
      if (!axis) continue;

      const level = profile[axisId];
      const levelDef = getLevel(axis, level);
      if (!levelDef) continue;

      const fragment = lang === "fr"
        ? levelDef.promptFragmentFr
        : levelDef.promptFragmentEn;
      lines.push(fragment);
    }

    return lines.join("\n");
  }
}
