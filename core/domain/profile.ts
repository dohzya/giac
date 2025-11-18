/**
 * Domain model for a profile: mapping of axes to their selected levels.
 */

import type { AxisId } from "./axis.ts";

export type Profile = Record<AxisId, number>;
export type PartialProfile = Record<AxisId, number | undefined>;

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
  defaults: Profile = {},
): Profile {
  const result: Profile = {};
  for (const [axisId, value] of Object.entries(partial)) {
    if (value !== undefined) {
      result[axisId as AxisId] = value;
    }
  }
  for (const [axisId, value] of Object.entries(defaults)) {
    if (result[axisId as AxisId] === undefined) {
      result[axisId as AxisId] = value;
    }
  }
  return result;
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
export function isComplete(
  profile: PartialProfile,
  axisIds: readonly AxisId[],
): profile is Profile {
  return axisIds.every((id) => profile[id] !== undefined);
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
export function getMissingAxes(
  profile: PartialProfile,
  axisIds: readonly AxisId[],
): AxisId[] {
  return axisIds.filter((id) => profile[id] === undefined);
}
