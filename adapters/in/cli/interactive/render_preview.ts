/**
 * Preview rendering for profile and prompt.
 */

import type { Profile } from "~/core/domain/profile.ts";
import type { Spec } from "~/core/domain/spec.ts";
import { getAxisById, getAxisIds } from "~/core/domain/spec.ts";
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

  const axisIds = getAxisIds();
  const parts: string[] = [];

  for (const axisId of axisIds) {
    const axis = getAxisById(spec, axisId);
    if (!axis) continue;

    const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
    const level = profile[axisId];
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
