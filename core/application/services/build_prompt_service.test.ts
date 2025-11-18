/**
 * Tests for BuildPromptService.
 */

import { assertEquals, assertExists } from "@std/assert";
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
    promptFragmentFr: "Fragment intro FR",
    promptFragmentEn: "Fragment intro EN",
    axes: {
      [telismeId]: {
        id: telismeId,
        priority: 1,
        initials: ["T"],
        nameFr: "Télisme",
        nameEn: "Telism",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        promptFragmentFr: "Fragment axe FR",
        promptFragmentEn: "Fragment axis EN",
        levels: [
          {
            level: 5,
            nameFr: "Niveau 5",
            nameEn: "Level 5",
            promptFragmentFr: "Fragment niveau 5 FR",
            promptFragmentEn: "Fragment level 5 EN",
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
        promptFragmentFr: "Fragment axe FR",
        promptFragmentEn: "Fragment axis EN",
        levels: [
          {
            level: 3,
            nameFr: "Niveau 3",
            nameEn: "Level 3",
            promptFragmentFr: "Fragment niveau 3 FR",
            promptFragmentEn: "Fragment level 3 EN",
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

  assertEquals(prompt.includes("Fragment intro FR"), true);
  assertEquals(prompt.includes("Profil:"), true);
  assertEquals(prompt.includes("Télisme=5"), true);
  assertEquals(prompt.includes("Confrontation=3"), true);
  assertEquals(prompt.includes("Fragment niveau 5 FR"), true);
  assertEquals(prompt.includes("Fragment niveau 3 FR"), true);
});

Deno.test("BuildPromptService - execute in English", () => {
  const service = new BuildPromptService();
  const spec = createTestSpec();
  const profile = createTestProfile();
  const prompt = service.execute(spec, profile, "en");

  assertEquals(prompt.includes("Fragment intro EN"), true);
  assertEquals(prompt.includes("Profil:"), true);
  assertEquals(prompt.includes("Telism=5"), true);
  assertEquals(prompt.includes("Confrontation=3"), true);
  assertEquals(prompt.includes("Fragment level 5 EN"), true);
  assertEquals(prompt.includes("Fragment level 3 EN"), true);
});

Deno.test("BuildPromptService - profile line format", () => {
  const service = new BuildPromptService();
  const spec = createTestSpec();
  const profile = createTestProfile();
  const prompt = service.execute(spec, profile, "fr");

  const lines = prompt.split("\n");
  const profileLine = lines.find((line) => line.startsWith("Profil:"));
  assertExists(profileLine);
  assertEquals(profileLine!.includes("Télisme=5"), true);
  assertEquals(profileLine!.includes("Confrontation=3"), true);
});

Deno.test("BuildPromptService - handles missing axis gracefully", () => {
  const service = new BuildPromptService();
  // Spec with only telisme axis (missing confrontation, density, energy, register)
  const incompleteSpec: Spec = {
    descriptionFr: "Description FR",
    descriptionEn: "Description EN",
    promptFragmentFr: "Fragment intro FR",
    promptFragmentEn: "Fragment intro EN",
    axes: {
      [axisId("telisme")]: {
        id: axisId("telisme"),
        priority: 1,
        initials: ["T"],
        nameFr: "Télisme",
        nameEn: "Telism",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        promptFragmentFr: "Fragment axe FR",
        promptFragmentEn: "Fragment axis EN",
        levels: [
          {
            level: 5,
            nameFr: "Niveau 5",
            nameEn: "Level 5",
            promptFragmentFr: "Fragment niveau 5 FR",
            promptFragmentEn: "Fragment level 5 EN",
          },
        ],
      },
    },
  };
  const profile = createTestProfile();

  // Should not throw, just skip missing axes
  const prompt = service.execute(incompleteSpec, profile, "fr");
  assertExists(prompt);
  assertEquals(prompt.includes("Fragment intro FR"), true);
});

Deno.test("BuildPromptService - handles missing level gracefully", () => {
  const service = new BuildPromptService();
  // Spec with axis but missing the level used in profile
  const specWithMissingLevel: Spec = {
    descriptionFr: "Description FR",
    descriptionEn: "Description EN",
    promptFragmentFr: "Fragment intro FR",
    promptFragmentEn: "Fragment intro EN",
    axes: {
      [axisId("telisme")]: {
        id: axisId("telisme"),
        priority: 1,
        initials: ["T"],
        nameFr: "Télisme",
        nameEn: "Telism",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        promptFragmentFr: "Fragment axe FR",
        promptFragmentEn: "Fragment axis EN",
        levels: [
          {
            level: 3,
            nameFr: "Niveau 3",
            nameEn: "Level 3",
            promptFragmentFr: "Fragment niveau 3 FR",
            promptFragmentEn: "Fragment level 3 EN",
          },
        ],
      },
    },
  };
  const profile = createTestProfile(); // Uses level 5 for telisme, but spec only has level 3

  // Should not throw, just skip missing level
  const prompt = service.execute(specWithMissingLevel, profile, "fr");
  assertExists(prompt);
  assertEquals(prompt.includes("Fragment intro FR"), true);
  assertEquals(prompt.includes("Fragment niveau 3 FR"), false); // Level 5 not found, so fragment skipped
});
