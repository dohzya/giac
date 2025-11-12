/**
 * Domain model for an axis (Télisme, Confrontation, Densité, Énergie, Registre).
 */

export type AxisId =
  | "telisme"
  | "confrontation"
  | "density"
  | "energy"
  | "register";

export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface LevelDefinition {
  readonly level: Level;
  readonly nameFr: string;
  readonly nameEn: string;
  readonly promptFragmentFr: string;
  readonly promptFragmentEn: string;
}

export interface Axis {
  readonly id: AxisId;
  readonly initials: readonly string[];
  readonly nameFr: string;
  readonly nameEn: string;
  readonly descriptionFr: string;
  readonly descriptionEn: string;
  readonly promptFragmentFr: string;
  readonly promptFragmentEn: string;
  readonly levels: readonly LevelDefinition[];
}

/**
 * Get a level definition for a given axis and level.
 */
export function getLevel(
  axis: Axis,
  level: Level,
): LevelDefinition | undefined {
  return axis.levels.find((l) => l.level === level);
}

/**
 * Check if a value is a valid level (0-10).
 */
export function isValidLevel(value: number): value is Level {
  return Number.isInteger(value) && value >= 0 && value <= 10;
}
