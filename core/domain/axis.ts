/**
 * Domain model for an axis.
 * Axis identifiers are spec-driven: any non-empty string key in the YAML mapping.
 * Branded string prevents mixing with other string identifiers.
 */

export type AxisId = string & { readonly __axisId: unique symbol };

export function axisId(value: string): AxisId {
  return value as AxisId; // Branded cast (spec-driven; validated at load time)
}

// Levels are numeric and spec-driven (no fixed upper bound).

export interface LevelDefinition {
  readonly level: number;
  readonly nameFr: string;
  readonly nameEn: string;
  readonly descriptionFr: string;
  readonly descriptionEn: string;
  readonly promptFr: string;
  readonly promptEn: string;
}

export interface Axis {
  readonly id: AxisId;
  readonly priority: number; // Explicit priority (gaps allowed, duplicates forbidden)
  readonly initials: readonly string[];
  readonly nameFr: string;
  readonly nameEn: string;
  readonly descriptionFr: string;
  readonly descriptionEn: string;
  readonly levels: readonly LevelDefinition[];
}

/**
 * Get a level definition for a given axis and level.
 */
export function getLevel(
  axis: Axis,
  level: number,
): LevelDefinition | undefined {
  return axis.levels.find((l) => l.level === level);
}

/**
 * Check if a value is a valid level (0-10).
 */
export function isValidLevel(axis: Axis, value: number): boolean {
  return axis.levels.some((l) => l.level === value);
}
