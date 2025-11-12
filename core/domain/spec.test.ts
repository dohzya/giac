/**
 * Tests for spec domain functions.
 */

import { assertEquals, assertExists } from "@std/assert";
import {
  getAxisById,
  getAxisIds,
  resolveAxis,
  resolveLevel,
  type Spec,
} from "./spec.ts";
import type { Axis, AxisId } from "./axis.ts";

// Test fixtures
function createTestAxis(id: AxisId): Axis {
  return {
    id,
    initials: [id[0]!.toUpperCase()],
    nameFr: `Axe ${id}`,
    nameEn: `Axis ${id}`,
    descriptionFr: `Description FR ${id}`,
    descriptionEn: `Description EN ${id}`,
    promptFragmentFr: `Fragment FR ${id}`,
    promptFragmentEn: `Fragment EN ${id}`,
    levels: [
      {
        level: 0,
        nameFr: "Niveau 0",
        nameEn: "Level 0",
        promptFragmentFr: "Fragment 0 FR",
        promptFragmentEn: "Fragment 0 EN",
      },
      {
        level: 5,
        nameFr: "Niveau 5",
        nameEn: "Level 5",
        promptFragmentFr: "Fragment 5 FR",
        promptFragmentEn: "Fragment 5 EN",
      },
      {
        level: 10,
        nameFr: "Niveau 10",
        nameEn: "Level 10",
        promptFragmentFr: "Fragment 10 FR",
        promptFragmentEn: "Fragment 10 EN",
      },
    ],
  };
}

function createTestSpec(): Spec {
  return {
    descriptionFr: "Description FR",
    descriptionEn: "Description EN",
    promptFragmentFr: "Fragment FR",
    promptFragmentEn: "Fragment EN",
    axes: [
      createTestAxis("telisme"),
      createTestAxis("confrontation"),
      createTestAxis("density"),
    ],
  };
}

Deno.test("resolveAxis - by id", () => {
  const spec = createTestSpec();
  const axis = resolveAxis(spec, "telisme");
  assertExists(axis);
  assertEquals(axis.id, "telisme");
});

Deno.test("resolveAxis - by id (case insensitive)", () => {
  const spec = createTestSpec();
  const axis = resolveAxis(spec, "TELISME");
  assertExists(axis);
  assertEquals(axis.id, "telisme");
});

Deno.test("resolveAxis - by initials", () => {
  const spec = createTestSpec();
  const axis = resolveAxis(spec, "T");
  assertExists(axis);
  assertEquals(axis.id, "telisme");
});

Deno.test("resolveAxis - by French name", () => {
  const spec = createTestSpec();
  const axis = resolveAxis(spec, "Axe telisme");
  assertExists(axis);
  assertEquals(axis.id, "telisme");
});

Deno.test("resolveAxis - by English name", () => {
  const spec = createTestSpec();
  const axis = resolveAxis(spec, "Axis density");
  assertExists(axis);
  assertEquals(axis.id, "density");
});

Deno.test("resolveAxis - not found", () => {
  const spec = createTestSpec();
  const axis = resolveAxis(spec, "nonexistent");
  assertEquals(axis, undefined);
});

Deno.test("resolveLevel - by number", () => {
  const axis = createTestAxis("telisme");
  const level = resolveLevel(axis, 5);
  assertEquals(level, 5);
});

Deno.test("resolveLevel - by number string", () => {
  const axis = createTestAxis("telisme");
  const level = resolveLevel(axis, "5");
  assertEquals(level, 5);
});

Deno.test("resolveLevel - by French name", () => {
  const axis = createTestAxis("telisme");
  const level = resolveLevel(axis, "Niveau 5");
  assertEquals(level, 5);
});

Deno.test("resolveLevel - by English name", () => {
  const axis = createTestAxis("telisme");
  const level = resolveLevel(axis, "Level 10");
  assertEquals(level, 10);
});

Deno.test("resolveLevel - invalid number (too high)", () => {
  const axis = createTestAxis("telisme");
  const level = resolveLevel(axis, 11);
  assertEquals(level, undefined);
});

Deno.test("resolveLevel - invalid number (negative)", () => {
  const axis = createTestAxis("telisme");
  const level = resolveLevel(axis, -1);
  assertEquals(level, undefined);
});

Deno.test("resolveLevel - not found", () => {
  const axis = createTestAxis("telisme");
  const level = resolveLevel(axis, "nonexistent");
  assertEquals(level, undefined);
});

Deno.test("getAxisById - found", () => {
  const spec = createTestSpec();
  const axis = getAxisById(spec, "telisme");
  assertExists(axis);
  assertEquals(axis.id, "telisme");
});

Deno.test("getAxisById - not found", () => {
  const spec = createTestSpec();
  const axis = getAxisById(spec, "nonexistent" as AxisId);
  assertEquals(axis, undefined);
});

Deno.test("getAxisIds - returns all axis IDs", () => {
  const ids = getAxisIds();
  assertEquals(ids.length, 5);
  assertEquals(ids[0], "telisme");
  assertEquals(ids[1], "confrontation");
  assertEquals(ids[2], "density");
  assertEquals(ids[3], "energy");
  assertEquals(ids[4], "register");
});
