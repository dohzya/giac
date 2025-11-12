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
 * Create a profile from a partial profile, filling missing values with defaults.
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
 * Check if a profile is complete (all axes have values).
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
 * Get the missing axes from a partial profile.
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
