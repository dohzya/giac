/**
 * Service implementing BuildPromptUseCase.
 * Pure core logic: no I/O, only computation.
 */

import type { BuildPromptUseCase, Language } from "../ports/in/build_prompt.ts";
import type { Profile } from "~/core/domain/profile.ts";
import type { Prompt } from "~/core/domain/prompt.ts";
import type { Spec } from "~/core/domain/spec.ts";
import { getAxesInPriority } from "~/core/domain/spec.ts";
import { getLevel, UnspecifiedLevel } from "~/core/domain/axis.ts";
import type { Axis } from "~/core/domain/axis.ts";
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
      const line = this.buildAxisLine(axis, profile, lang);
      if (line) lines.push(line);
    }

    return lines.join("\n");
  }

  private buildAxisLine(
    axis: Axis,
    profile: Profile,
    lang: Language,
  ): string | undefined {
    const rawLevel = profile[axis.id];
    const levelDef = rawLevel === undefined
      ? getLevel(axis, UnspecifiedLevel)
      : getLevel(axis, rawLevel);
    if (!levelDef) return undefined;
    const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
    const prompt = lang === "fr" ? levelDef.promptFr : levelDef.promptEn;
    const normalizedPrompt = prompt.replaceAll("\n", " ");
    if (rawLevel === undefined || levelDef.level === UnspecifiedLevel) {
      return `  - ${axisName} ${UnspecifiedLevel}: ${normalizedPrompt}`;
    }
    return `  - ${axisName} ${rawLevel}/10: ${normalizedPrompt}`;
  }
}
