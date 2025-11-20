/**
 * Tests for BuildPromptService.
 */

import {
  assertEquals,
  assertExists,
  assertNotMatch,
  assertNotStrictEquals,
  assertStringIncludes,
} from "@std/assert";
import { BuildPromptService } from "./build_prompt_service.ts";
import type { Spec } from "~/core/domain/spec.ts";
import type { Profile } from "~/core/domain/profile.ts";
import { axisId } from "~/core/domain/axis.ts";

function createTestSpec(): Spec {
  const telismeId = axisId("telisme");
  const confrontationId = axisId("confrontation");
  return {
    descriptionFr: "Description FR",
    descriptionEn: "Description EN",
    promptFragmentFr: "Fragment FR global",
    promptFragmentEn: "Global fragment EN",
    axes: {
      [telismeId]: {
        id: telismeId,
        priority: 1,
        initials: ["T"],
        nameFr: "Télisme",
        nameEn: "Telism",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        levels: [
          {
            level: 5,
            nameFr: "Niveau 5",
            nameEn: "Level 5",
            descriptionFr: "Description niveau 5",
            descriptionEn: "Level 5 description",
            promptFr: "Prompt niveau 5",
            promptEn: "Level 5 prompt",
          },
        ],
      },
      [confrontationId]: {
        id: confrontationId,
        priority: 2,
        initials: ["C"],
        nameFr: "Confrontation",
        nameEn: "Confrontation",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        levels: [
          {
            level: 3,
            nameFr: "Niveau 3",
            nameEn: "Level 3",
            descriptionFr: "Description niveau 3",
            descriptionEn: "Level 3 description",
            promptFr: "Prompt niveau 3",
            promptEn: "Level 3 prompt",
          },
        ],
      },
    },
  };
}

function createTestProfile(): Profile {
  return {
    [axisId("telisme")]: 5,
    [axisId("confrontation")]: 3,
    [axisId("density")]: 0,
    [axisId("energy")]: 0,
    [axisId("register")]: 0,
  };
}

Deno.test("BuildPromptService - execute in French", () => {
  const service = new BuildPromptService();
  const spec = createTestSpec();
  const profile = createTestProfile();
  const prompt = service.execute(spec, profile, "fr");

  assertEquals(prompt.includes("Fragment FR global"), true);
  assertEquals(prompt.includes("Instructions relatives au comportement"), true);
  assertEquals(prompt.includes("Télisme 5/10"), true);
  assertEquals(prompt.includes("Confrontation 3/10"), true);
  assertEquals(prompt.includes("Prompt niveau 5"), true);
  assertEquals(prompt.includes("Prompt niveau 3"), true);
});

Deno.test("BuildPromptService - execute in English", () => {
  const service = new BuildPromptService();
  const spec = createTestSpec();
  const profile = createTestProfile();
  const prompt = service.execute(spec, profile, "en");

  assertStringIncludes(prompt, "Global fragment EN");
  assertStringIncludes(prompt, "Behavior instructions:");
  assertStringIncludes(prompt, "Telism 5/10");
  assertStringIncludes(prompt, "Confrontation 3/10");
  assertStringIncludes(prompt, "Level 5 prompt");
  assertStringIncludes(prompt, "Level 3 prompt");
});

Deno.test("BuildPromptService - instruction lines format", () => {
  const service = new BuildPromptService();
  const spec = createTestSpec();
  const profile = createTestProfile();
  const prompt = service.execute(spec, profile, "fr");

  const lines = prompt.split("\n");
  const telismeInstruction =
    lines.find((line) => line.includes("Télisme 5/10")) || "";
  const confrontationInstruction =
    lines.find((line) => line.includes("Confrontation 3/10")) || "";
  assertNotStrictEquals(telismeInstruction, "");
  assertNotStrictEquals(confrontationInstruction, "");
  assertStringIncludes(telismeInstruction, "Prompt niveau 5");
  assertStringIncludes(confrontationInstruction, "Prompt niveau 3");
});

Deno.test("BuildPromptService - handles missing axis gracefully", () => {
  const service = new BuildPromptService();
  // Spec with only telisme axis (missing confrontation, density, energy, register)
  const incompleteSpec: Spec = {
    descriptionFr: "Description FR",
    descriptionEn: "Description EN",
    promptFragmentFr: "Fragment FR global",
    promptFragmentEn: "Global fragment EN",
    axes: {
      [axisId("telisme")]: {
        id: axisId("telisme"),
        priority: 1,
        initials: ["T"],
        nameFr: "Télisme",
        nameEn: "Telism",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        levels: [
          {
            level: 5,
            nameFr: "Niveau 5",
            nameEn: "Level 5",
            descriptionFr: "Description niveau 5",
            descriptionEn: "Level 5 description",
            promptFr: "Prompt niveau 5",
            promptEn: "Level 5 prompt",
          },
        ],
      },
    },
  };
  const profile = createTestProfile();

  // Should not throw, just skip missing axes
  const prompt = service.execute(incompleteSpec, profile, "fr");
  assertExists(prompt);
  assertStringIncludes(prompt, "Fragment FR global");
});

Deno.test("BuildPromptService - handles missing level gracefully", () => {
  const service = new BuildPromptService();
  // Spec with axis but missing the level used in profile
  const specWithMissingLevel: Spec = {
    descriptionFr: "Description FR",
    descriptionEn: "Description EN",
    promptFragmentFr: "Fragment FR global",
    promptFragmentEn: "Global fragment EN",
    axes: {
      [axisId("telisme")]: {
        id: axisId("telisme"),
        priority: 1,
        initials: ["T"],
        nameFr: "Télisme",
        nameEn: "Telism",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        levels: [
          {
            level: 3,
            nameFr: "Niveau 3",
            nameEn: "Level 3",
            descriptionFr: "Description niveau 3",
            descriptionEn: "Level 3 description",
            promptFr: "Prompt niveau 3",
            promptEn: "Level 3 prompt",
          },
        ],
      },
    },
  };
  const profile = createTestProfile(); // Uses level 5 for telisme, but spec only has level 3

  // Should not throw, just skip missing level
  const prompt = service.execute(specWithMissingLevel, profile, "fr");
  assertExists(prompt);
  assertStringIncludes(prompt, "Fragment FR global");
  assertNotMatch(prompt, /Description niveau 3/); // Level 5 not found, so description skipped
});
