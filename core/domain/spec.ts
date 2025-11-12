/**
 * Domain model for the complete specification: all axes and metadata.
 */

import type { Axis, AxisId, Level } from "./axis.ts";
import { ExplicitCast } from "../common/explicit_cast.ts";

export interface Spec {
  readonly descriptionFr: string;
  readonly descriptionEn: string;
  readonly promptFragmentFr: string;
  readonly promptFragmentEn: string;
  readonly axes: readonly Axis[];
}

/**
 * Resolve an axis identifier from various inputs (id, initials, names FR/EN).
 */
export function resolveAxis(
  spec: Spec,
  input: string,
): Axis | undefined {
  const normalized = input.toLowerCase().trim();

  const byId = spec.axes.find((a) => a.id === normalized);
  if (byId) return byId;

  for (const axis of spec.axes) {
    if (axis.initials.some((init) => init.toLowerCase() === normalized)) {
      return axis;
    }
  }

  const byNameFr = spec.axes.find(
    (a) => a.nameFr.toLowerCase() === normalized,
  );
  if (byNameFr) return byNameFr;

  const byNameEn = spec.axes.find(
    (a) => a.nameEn.toLowerCase() === normalized,
  );
  if (byNameEn) return byNameEn;

  return undefined;
}

/**
 * Resolve a level from various inputs (number, level name FR/EN).
 */
export function resolveLevel(
  axis: Axis,
  input: string | number,
): Level | undefined {
  if (typeof input === "number") {
    if (Number.isInteger(input) && input >= 0 && input <= 10) {
      return ExplicitCast.from<number>(input).cast<Level>();
    }
    return undefined;
  }

  const normalized = input.toLowerCase().trim();

  const num = Number.parseInt(normalized, 10);
  if (!Number.isNaN(num) && num >= 0 && num <= 10) {
    return ExplicitCast.from<number>(num).cast<Level>();
  }

  const byNameFr = axis.levels.find(
    (l) => l.nameFr.toLowerCase() === normalized,
  );
  if (byNameFr) return byNameFr.level;

  const byNameEn = axis.levels.find(
    (l) => l.nameEn.toLowerCase() === normalized,
  );
  if (byNameEn) return byNameEn.level;

  return undefined;
}

/**
 * Get an axis by its ID.
 */
export function getAxisById(spec: Spec, id: AxisId): Axis | undefined {
  return spec.axes.find((a) => a.id === id);
}

/**
 * Get all axis IDs in priority order.
 */
export function getAxisIds(): readonly AxisId[] {
  return ["telisme", "confrontation", "density", "energy", "register"] as const;
}
