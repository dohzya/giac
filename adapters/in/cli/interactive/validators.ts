/**
 * Validators and normalizers for user input.
 */

import type { Axis } from "~/core/domain/axis.ts";
import { resolveLevel } from "~/core/domain/spec.ts";

/**
 * Validate and normalize a level input from the user.
 */
export function validateLevelInput(
  axis: Axis,
  input: string,
): number | undefined {
  const trimmed = input.trim();
  if (trimmed === "") return undefined;

  return resolveLevel(axis, trimmed);
}

/**
 * Format a level for display (showing number and names).
 */
export function formatLevel(axis: Axis, level: number): string {
  const levelDef = axis.levels.find((l: { level: number }) =>
    l.level === level
  );
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
    lines.push(`  ${levelDef.level}: ${name}`);
  }
  return lines.join("\n");
}
