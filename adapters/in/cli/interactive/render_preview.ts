/**
 * Preview rendering for profile and prompt.
 */

import type { Profile } from "~/core/domain/profile.ts";
import type { Spec } from "~/core/domain/spec.ts";
import { getAxisById, getAxisIds } from "~/core/domain/spec.ts";
import * as ui from "../ui.ts";

/**
 * Render a preview of the profile.
 */
export function renderProfilePreview(
  spec: Spec,
  profile: Profile,
  lang: "fr" | "en",
): void {
  ui.title("\n=== Profil sélectionné ===");

  const axisIds = getAxisIds();
  const parts: string[] = [];

  for (const axisId of axisIds) {
    const axis = getAxisById(spec, axisId);
    if (!axis) continue;

    const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
    const level = profile[axisId];
    parts.push(`${axisName}=${level}`);
  }

  ui.info(`Profil: ${parts.join(" ")}`);
}

/**
 * Render a preview of the generated prompt.
 */
export function renderPromptPreview(prompt: string): void {
  ui.title("\n=== Prompt généré ===");
  ui.info(prompt);
}
