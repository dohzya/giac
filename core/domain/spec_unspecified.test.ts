/**
 * Tests for UnspecifiedLevel handling in resolveLevel.
 */

import { assertEquals } from "@std/assert";
import { resolveLevel } from "./spec.ts";
import { axisId, UnspecifiedLevel } from "./axis.ts";
import type { Axis } from "./axis.ts";

function createTestAxisWithUnspecified(): Axis {
  return {
    id: axisId("test"),
    priority: 1,
    initials: ["T"],
    nameFr: "Test",
    nameEn: "Test",
    descriptionFr: "Desc FR",
    descriptionEn: "Desc EN",
    levels: [
      {
        level: UnspecifiedLevel,
        nameFr: "Non spécifié",
        nameEn: "Unspecified",
        descriptionFr: "Fais comme tu sens",
        descriptionEn: "Use your judgement",
        promptFr: "fais comme tu sens",
        promptEn: "use your judgement",
      },
      {
        level: 0,
        nameFr: "Zéro",
        nameEn: "Zero",
        descriptionFr: "Desc",
        descriptionEn: "Desc",
        promptFr: "Prompt 0",
        promptEn: "Prompt 0",
      },
      {
        level: 5,
        nameFr: "Cinq",
        nameEn: "Five",
        descriptionFr: "Desc",
        descriptionEn: "Desc",
        promptFr: "Prompt 5",
        promptEn: "Prompt 5",
      },
    ],
  };
}

Deno.test("resolveLevel - recognizes UnspecifiedLevel sentinel", () => {
  const axis = createTestAxisWithUnspecified();
  const result = resolveLevel(axis, "-");
  assertEquals(result, UnspecifiedLevel);
});

Deno.test("resolveLevel - resolves UnspecifiedLevel by French name", () => {
  const axis = createTestAxisWithUnspecified();
  const result = resolveLevel(axis, "Non spécifié");
  assertEquals(result, UnspecifiedLevel);
});

Deno.test("resolveLevel - resolves UnspecifiedLevel by English name", () => {
  const axis = createTestAxisWithUnspecified();
  const result = resolveLevel(axis, "Unspecified");
  assertEquals(result, UnspecifiedLevel);
});

Deno.test("resolveLevel - case insensitive for UnspecifiedLevel", () => {
  const axis = createTestAxisWithUnspecified();
  const result1 = resolveLevel(axis, "UNSPECIFIED");
  const result2 = resolveLevel(axis, "non spécifié");
  assertEquals(result1, UnspecifiedLevel);
  assertEquals(result2, UnspecifiedLevel);
});

Deno.test("resolveLevel - returns undefined when UnspecifiedLevel not in axis", () => {
  const axisWithoutUnspecified: Axis = {
    id: axisId("test"),
    priority: 1,
    initials: ["T"],
    nameFr: "Test",
    nameEn: "Test",
    descriptionFr: "Desc",
    descriptionEn: "Desc",
    levels: [
      {
        level: 0,
        nameFr: "Zéro",
        nameEn: "Zero",
        descriptionFr: "Desc",
        descriptionEn: "Desc",
        promptFr: "Prompt 0",
        promptEn: "Prompt 0",
      },
    ],
  };
  const result = resolveLevel(axisWithoutUnspecified, "-");
  assertEquals(result, undefined);
});
