/**
 * Domain model for a profile: mapping of axes to their selected levels.
 */

import type { AxisId, Level } from "./axis.ts";

export interface Profile {
  readonly telisme: Level;
  readonly confrontation: Level;
  readonly density: Level;
  readonly energy: Level;
  readonly register: Level;
}

export interface PartialProfile {
  readonly telisme?: Level;
  readonly confrontation?: Level;
  readonly density?: Level;
  readonly energy?: Level;
  readonly register?: Level;
}

/**
 * Create a complete profile from a partial profile, filling missing values with defaults.
 *
 * This function ensures that all five axes (télisme, confrontation, densité, énergie, registre)
 * have defined values by using the provided defaults for any missing axes.
 *
 * @param partial - Partial profile with some or all axes defined
 * @param defaults - Default values for missing axes (defaults to 5 for all axes)
 * @returns Complete profile with all axes defined
 *
 * @example
 * ```typescript
 * const profile = createProfile({ telisme: 8 });
 * // Returns: { telisme: 8, confrontation: 5, density: 5, energy: 5, register: 5 }
 * ```
 */
export function createProfile(
  partial: PartialProfile,
  defaults: Profile = {
    telisme: 5,
    confrontation: 5,
    density: 5,
    energy: 5,
    register: 5,
  },
): Profile {
  return {
    telisme: partial.telisme ?? defaults.telisme,
    confrontation: partial.confrontation ?? defaults.confrontation,
    density: partial.density ?? defaults.density,
    energy: partial.energy ?? defaults.energy,
    register: partial.register ?? defaults.register,
  };
}

/**
 * Check if a profile is complete (all axes have defined values).
 *
 * This is a type guard function that narrows a PartialProfile to a complete Profile
 * when all five axes have non-undefined values.
 *
 * @param profile - Partial profile to check for completeness
 * @returns True if all axes are defined, false otherwise (also acts as type guard)
 *
 * @example
 * ```typescript
 * const partial = { telisme: 5, confrontation: 3 };
 * if (isComplete(partial)) {
 *   // TypeScript knows partial is now Profile
 *   const level: Level = partial.density; // No error
 * }
 * ```
 */
export function isComplete(profile: PartialProfile): profile is Profile {
  return (
    profile.telisme !== undefined &&
    profile.confrontation !== undefined &&
    profile.density !== undefined &&
    profile.energy !== undefined &&
    profile.register !== undefined
  );
}

/**
 * Get the list of axis IDs that are missing (undefined) from a partial profile.
 *
 * Returns an array of AxisId values for axes that have undefined values.
 * The order follows the priority order: télisme, confrontation, densité, énergie, registre.
 *
 * @param profile - Partial profile to check for missing axes
 * @returns Array of AxisId values for missing axes (empty if profile is complete)
 *
 * @example
 * ```typescript
 * const partial = { telisme: 5, confrontation: 3 };
 * const missing = getMissingAxes(partial);
 * // Returns: ["density", "energy", "register"]
 * ```
 */
export function getMissingAxes(profile: PartialProfile): AxisId[] {
  const missing: AxisId[] = [];
  if (profile.telisme === undefined) missing.push("telisme");
  if (profile.confrontation === undefined) missing.push("confrontation");
  if (profile.density === undefined) missing.push("density");
  if (profile.energy === undefined) missing.push("energy");
  if (profile.register === undefined) missing.push("register");
  return missing;
}
