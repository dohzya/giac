/**
 * Validators and normalizers for user input.
 */

import type { Axis, Level } from "~/core/domain/axis.ts";
import { resolveLevel } from "~/core/domain/spec.ts";

/**
 * Validate and normalize a level input from the user.
 */
export function validateLevelInput(
  axis: Axis,
  input: string,
): Level | undefined {
  const trimmed = input.trim();
  if (trimmed === "") return undefined;

  return resolveLevel(axis, trimmed);
}

/**
 * Format a level for display (showing number and names).
 */
export function formatLevel(axis: Axis, level: number): string {
  const levelDef = axis.levels.find((l) => l.level === level);
  if (!levelDef) return `${level}`;

  return `${level} (${levelDef.nameFr} / ${levelDef.nameEn})`;
}

/**
 * Format all available levels for display.
 */
export function formatAvailableLevels(axis: Axis, lang: "fr" | "en"): string {
  const lines: string[] = [];
  for (const levelDef of axis.levels) {
    const name = lang === "fr" ? levelDef.nameFr : levelDef.nameEn;
    const description = lang === "fr"
      ? levelDef.descriptionFr
      : levelDef.descriptionEn;
    lines.push(`  ${levelDef.level}: ${name}`);
    if (description && description.trim() !== "") {
      // Indent the description and add it below the level name
      const indentedDesc = description.split("\n")
        .map((line) => `      ${line}`)
        .join("\n");
      lines.push(indentedDesc);
    }
  }
  return lines.join("\n");
}
