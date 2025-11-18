/**
 * Preview rendering for profile and prompt.
 */

import type { Profile } from "~/core/domain/profile.ts";
import type { Spec } from "~/core/domain/spec.ts";
import { getAxesInPriority } from "~/core/domain/spec.ts";
import { getMessages } from "../messages.ts";
import * as ui from "../ui.ts";

/**
 * Render a preview of the profile.
 */
export function renderProfilePreview(
  spec: Spec,
  profile: Profile,
  lang: "fr" | "en",
): void {
  const msg = getMessages(lang);
  ui.title(msg.titleSelectedProfile);

  const axes = getAxesInPriority(spec);
  const parts: string[] = [];
  for (const axis of axes) {
    const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
    const level = profile[axis.id];
    parts.push(`${axisName}=${level}`);
  }

  ui.info(`${msg.labelProfile} ${parts.join(" ")}`);
}

/**
 * Render a preview of the generated prompt.
 */
export function renderPromptPreview(prompt: string, lang: "fr" | "en"): void {
  const msg = getMessages(lang);
  ui.title(msg.titleGeneratedPrompt);
  ui.info(prompt);
}
