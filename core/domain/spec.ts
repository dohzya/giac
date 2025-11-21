/**
 * Domain model for the complete specification: all axes and metadata.
 * Axes are stored in a record keyed by AxisId (spec-driven).
 */

import type { Axis, AxisId, Level } from "./axis.ts";
import { UnspecifiedLevel } from "./axis.ts";

export interface Spec {
  readonly descriptionFr: string;
  readonly descriptionEn: string;
  readonly promptFragmentFr: string;
  readonly promptFragmentEn: string;
  readonly axes: Record<AxisId, Axis>; // dynamic set
}

/**
 * Resolve an axis identifier from various inputs (id, initials, names FR/EN).
 */
export function resolveAxis(spec: Spec, input: string): Axis | undefined {
  const normalized = input.toLowerCase().trim();
  const values = Object.values(spec.axes);

  const byId = values.find((a) => a.id === normalized);
  if (byId) return byId;

  for (const axis of values) {
    if (axis.initials.some((init) => init.toLowerCase() === normalized)) {
      return axis;
    }
  }

  const byNameFr = values.find((a) => a.nameFr.toLowerCase() === normalized);
  if (byNameFr) return byNameFr;

  const byNameEn = values.find((a) => a.nameEn.toLowerCase() === normalized);
  if (byNameEn) return byNameEn;

  return undefined;
}

/**
 * Resolve a level from various inputs (number, level name FR/EN, or UnspecifiedLevel).
 */
export function resolveLevel(
  axis: Axis,
  input: string | number,
): Level | undefined {
  if (typeof input === "number") {
    if (Number.isInteger(input) && axis.levels.some((l) => l.level === input)) {
      return input;
    }
    return undefined;
  }

  const normalized = input.toLowerCase().trim();

  // Check for UnspecifiedLevel sentinel
  if (normalized === UnspecifiedLevel) {
    if (axis.levels.some((l) => l.level === UnspecifiedLevel)) {
      return UnspecifiedLevel;
    }
    return undefined;
  }

  const num = Number.parseInt(normalized, 10);
  if (
    !Number.isNaN(num) &&
    Number.isInteger(num) &&
    axis.levels.some((l) => l.level === num)
  ) {
    return num;
  }

  const byNameFr = axis.levels.find((l) =>
    l.nameFr.toLowerCase() === normalized
  );
  if (byNameFr && typeof byNameFr.level === "number") return byNameFr.level;
  if (byNameFr && byNameFr.level === UnspecifiedLevel) return UnspecifiedLevel;

  const byNameEn = axis.levels.find((l) =>
    l.nameEn.toLowerCase() === normalized
  );
  if (byNameEn && typeof byNameEn.level === "number") return byNameEn.level;
  if (byNameEn && byNameEn.level === UnspecifiedLevel) return UnspecifiedLevel;
  return undefined;
}

/**
 * Get an axis by its ID.
 */
export function getAxisById(spec: Spec, id: AxisId): Axis | undefined {
  return spec.axes[id];
}

/**
 * Get all axis IDs in priority order.
 */
export function getAxisIds(spec: Spec): readonly AxisId[] {
  return Object.keys(spec.axes).map((k) => k as AxisId);
}

export function getAxesInPriority(spec: Spec): readonly Axis[] {
  return Object.values(spec.axes).sort((a, b) => a.priority - b.priority);
}
