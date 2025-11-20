/**
 * Tests for input validators.
 */

import { assertEquals } from "@std/assert";
import {
  formatAvailableLevels,
  formatLevel,
  validateLevelInput,
} from "./validators.ts";
import { type Axis, axisId } from "~/core/domain/axis.ts";

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
        nameFr: "Écouter",
        nameEn: "Listen",
        descriptionFr: "Description écouter",
        descriptionEn: "Listen description",
        promptFr: "Prompt écouter",
        promptEn: "Listen prompt",
      },
      {
        level: 5,
        nameFr: "Expliquer",
        nameEn: "Explain",
        descriptionFr: "Description expliquer",
        descriptionEn: "Explain description",
        promptFr: "Prompt expliquer",
        promptEn: "Explain prompt",
      },
      {
        level: 10,
        nameFr: "Décider",
        nameEn: "Decide",
        descriptionFr: "Description décider",
        descriptionEn: "Decide description",
        promptFr: "Prompt décider",
        promptEn: "Decide prompt",
      },
    ],
  };
}

Deno.test("validateLevelInput - number string", () => {
  const axis = createTestAxis();
  const result = validateLevelInput(axis, "5");
  assertEquals(result, 5);
});

Deno.test("validateLevelInput - number", () => {
  const axis = createTestAxis();
  const result = validateLevelInput(axis, "10");
  assertEquals(result, 10);
});

Deno.test("validateLevelInput - French name", () => {
  const axis = createTestAxis();
  const result = validateLevelInput(axis, "Écouter");
  assertEquals(result, 0);
});

Deno.test("validateLevelInput - English name", () => {
  const axis = createTestAxis();
  const result = validateLevelInput(axis, "Decide");
  assertEquals(result, 10);
});

Deno.test("validateLevelInput - case insensitive", () => {
  const axis = createTestAxis();
  const result = validateLevelInput(axis, "expliquer");
  assertEquals(result, 5);
});

Deno.test("validateLevelInput - invalid input", () => {
  const axis = createTestAxis();
  const result = validateLevelInput(axis, "nonexistent");
  assertEquals(result, undefined);
});

Deno.test("validateLevelInput - empty string", () => {
  const axis = createTestAxis();
  const result = validateLevelInput(axis, "");
  assertEquals(result, undefined);
});

Deno.test("validateLevelInput - whitespace only", () => {
  const axis = createTestAxis();
  const result = validateLevelInput(axis, "   ");
  assertEquals(result, undefined);
});

Deno.test("formatLevel - displays level and names", () => {
  const axis = createTestAxis();
  const formatted = formatLevel(axis, 5);
  assertEquals(formatted.includes("5"), true);
  assertEquals(formatted.includes("Expliquer"), true);
  assertEquals(formatted.includes("Explain"), true);
});

Deno.test("formatLevel - level not found", () => {
  const axis = createTestAxis();
  const formatted = formatLevel(axis, 3);
  assertEquals(formatted, "3");
});

Deno.test("formatAvailableLevels - French", () => {
  const axis = createTestAxis();
  const formatted = formatAvailableLevels(axis, "fr");
  assertEquals(formatted.includes("0: Écouter"), true);
  assertEquals(formatted.includes("5: Expliquer"), true);
  assertEquals(formatted.includes("10: Décider"), true);
});

Deno.test("formatAvailableLevels - English", () => {
  const axis = createTestAxis();
  const formatted = formatAvailableLevels(axis, "en");
  assertEquals(formatted.includes("0: Listen"), true);
  assertEquals(formatted.includes("5: Explain"), true);
  assertEquals(formatted.includes("10: Decide"), true);
});
