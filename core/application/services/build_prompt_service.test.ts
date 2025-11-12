/**
 * Tests for BuildPromptService.
 */

import { assertEquals, assertExists } from "@std/assert";
import { BuildPromptService } from "./build_prompt_service.ts";
import type { Spec } from "~/core/domain/spec.ts";
import type { Profile } from "~/core/domain/profile.ts";

function createTestSpec(): Spec {
  return {
    descriptionFr: "Description FR",
    descriptionEn: "Description EN",
    promptFragmentFr: "Fragment intro FR",
    promptFragmentEn: "Fragment intro EN",
    axes: [
      {
        id: "telisme",
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
      {
        id: "confrontation",
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
    ],
  };
}

function createTestProfile(): Profile {
  return {
    telisme: 5,
    confrontation: 3,
    density: 0,
    energy: 0,
    register: 0,
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
