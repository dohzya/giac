/**
 * Tests for axis domain functions.
 */

import { assertEquals, assertExists } from "@std/assert";
import { type Axis, axisId, getLevel, isValidLevel } from "./axis.ts";

function createTestAxis(): Axis {
  return {
    id: axisId("telisme"),
    priority: 1,
    initials: ["T"],
    nameFr: "Télisme",
    nameEn: "Telism",
    descriptionFr: "Description FR",
    descriptionEn: "Description EN",
    levels: [
      {
        level: 0,
        nameFr: "Niveau 0",
        nameEn: "Level 0",
        descriptionFr: "Description niveau 0",
        descriptionEn: "Level 0 description",
        promptFr: "Prompt niveau 0",
        promptEn: "Level 0 prompt",
      },
      {
        level: 5,
        nameFr: "Niveau 5",
        nameEn: "Level 5",
        descriptionFr: "Description niveau 5",
        descriptionEn: "Level 5 description",
        promptFr: "Prompt niveau 5",
        promptEn: "Level 5 prompt",
      },
      {
        level: 10,
        nameFr: "Niveau 10",
        nameEn: "Level 10",
        descriptionFr: "Description niveau 10",
        descriptionEn: "Level 10 description",
        promptFr: "Prompt niveau 10",
        promptEn: "Level 10 prompt",
      },
    ],
  };
}

Deno.test("getLevel - found", () => {
  const axis = createTestAxis();
  const levelDef = getLevel(axis, 5);
  assertExists(levelDef);
  assertEquals(levelDef.level, 5);
  assertEquals(levelDef.nameFr, "Niveau 5");
});

Deno.test("getLevel - not found", () => {
  const axis = createTestAxis();
  const levelDef = getLevel(axis, 3);
  assertEquals(levelDef, undefined);
});

Deno.test("isValidLevel - valid defined levels", () => {
  const axis = createTestAxis();
  for (const def of axis.levels) {
    assertEquals(isValidLevel(axis, def.level), true);
  }
});

Deno.test("isValidLevel - invalid levels (too high)", () => {
  const axis = createTestAxis();
  assertEquals(isValidLevel(axis, 11), false);
  assertEquals(isValidLevel(axis, 100), false);
});

Deno.test("isValidLevel - invalid levels (negative)", () => {
  const axis = createTestAxis();
  assertEquals(isValidLevel(axis, -1), false);
  assertEquals(isValidLevel(axis, -10), false);
});

Deno.test("isValidLevel - invalid levels (non-integer)", () => {
  const axis = createTestAxis();
  assertEquals(isValidLevel(axis, 5.5), false);
  assertEquals(isValidLevel(axis, 3.14), false);
});
