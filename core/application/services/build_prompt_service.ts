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
import { getMessages } from "~/adapters/in/cli/messages.ts";

export class BuildPromptService implements BuildPromptUseCase {
  execute(spec: Spec, profile: Profile, lang: Language): Prompt {
    const lines: string[] = [];
    const header = lang === "fr"
      ? spec.promptFragmentFr
      : spec.promptFragmentEn;
    lines.push(header);

    const messages = getMessages(lang);
    lines.push(messages.promptBehaviorIntro);

    const axes = getAxesInPriority(spec);
    for (const axis of axes) {
      const level = profile[axis.id];
      if (level === undefined) continue;
      const levelDef = getLevel(axis, level);
      if (!levelDef) continue;

      const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
      const prompt = lang === "fr" ? levelDef.promptFr : levelDef.promptEn;
      lines.push(
        `  - ${axisName} ${level}/10: ${prompt.replaceAll("\n", " ")}`,
      );
    }

    return lines.join("\n");
  }
}
