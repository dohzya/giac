/**
 * Service implementing BuildPromptUseCase.
 * Pure core logic: no I/O, only computation.
 */

import type { BuildPromptUseCase, Language } from "../ports/in/build_prompt.ts";
import type { Profile } from "~/core/domain/profile.ts";
import type { Prompt } from "~/core/domain/prompt.ts";
import type { Spec } from "~/core/domain/spec.ts";
import { getAxesInPriority } from "~/core/domain/spec.ts";
import { getLevel } from "~/core/domain/axis.ts";

export class BuildPromptService implements BuildPromptUseCase {
  execute(spec: Spec, profile: Profile, lang: Language): Prompt {
    const lines: string[] = [];
    const header = lang === "fr"
      ? spec.promptFragmentFr
      : spec.promptFragmentEn;
    lines.push(header, "");

    const axes = getAxesInPriority(spec);
    const profileParts: string[] = [];
    for (const axis of axes) {
      const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
      const level = profile[axis.id];
      profileParts.push(`${axisName}=${level}`);
    }
    lines.push(`Profil: ${profileParts.join(" ")}`, "");

    for (const axis of axes) {
      const level = profile[axis.id];
      if (level === undefined) continue;
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
