/**
 * Tests for axis domain functions.
 */

import { assertEquals, assertExists } from "@std/assert";
import { type Axis, getLevel, isValidLevel } from "./axis.ts";

function createTestAxis(): Axis {
  return {
    id: "telisme",
    initials: ["T"],
    nameFr: "Télisme",
    nameEn: "Telism",
    descriptionFr: "Description FR",
    descriptionEn: "Description EN",
    promptFragmentFr: "Fragment FR",
    promptFragmentEn: "Fragment EN",
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

Deno.test("isValidLevel - valid levels", () => {
  for (let i = 0; i <= 10; i++) {
    assertEquals(isValidLevel(i), true);
  }
});

Deno.test("isValidLevel - invalid levels (too high)", () => {
  assertEquals(isValidLevel(11), false);
  assertEquals(isValidLevel(100), false);
});

Deno.test("isValidLevel - invalid levels (negative)", () => {
  assertEquals(isValidLevel(-1), false);
  assertEquals(isValidLevel(-10), false);
});

Deno.test("isValidLevel - invalid levels (non-integer)", () => {
  assertEquals(isValidLevel(5.5), false);
  assertEquals(isValidLevel(3.14), false);
});
