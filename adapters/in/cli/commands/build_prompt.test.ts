/**
 * Integration tests for build_prompt command.
 */

import { assertEquals } from "@std/assert";
import { executeBuildPrompt } from "./build_prompt.ts";
import type { BuildPromptUseCase } from "~/core/application/ports/in/build_prompt.ts";
import type { GetSpecUseCase } from "~/core/application/ports/in/get_spec.ts";
import type { Spec } from "~/core/domain/spec.ts";
import type { PartialProfile, Profile } from "~/core/domain/profile.ts";
import { axisId } from "~/core/domain/axis.ts";

// Test fixtures (inline)
const createTestSpec = (): Spec => ({
  descriptionFr: "Test spec FR",
  descriptionEn: "Test spec EN",
  promptFragmentFr: "Fragment FR global",
  promptFragmentEn: "Global fragment EN",
  axes: {
    [axisId("telisme")]: {
      id: axisId("telisme"),
      priority: 1,
      initials: ["T", "I"],
      nameFr: "Télisme",
      nameEn: "Initiative",
      descriptionFr: "Test télisme",
      descriptionEn: "Test initiative",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        descriptionFr: `Description niveau ${i}`,
        descriptionEn: `Level ${i} description`,
      })),
    },
    [axisId("confrontation")]: {
      id: axisId("confrontation"),
      priority: 2,
      initials: ["C"],
      nameFr: "Confrontation",
      nameEn: "Challenge",
      descriptionFr: "Test confrontation",
      descriptionEn: "Test challenge",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        descriptionFr: `Description niveau ${i}`,
        descriptionEn: `Level ${i} description`,
      })),
    },
    [axisId("density")]: {
      id: axisId("density"),
      priority: 3,
      initials: ["D"],
      nameFr: "Densité",
      nameEn: "Density",
      descriptionFr: "Test densité",
      descriptionEn: "Test density",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        descriptionFr: `Description niveau ${i}`,
        descriptionEn: `Level ${i} description`,
      })),
    },
    [axisId("energy")]: {
      id: axisId("energy"),
      priority: 4,
      initials: ["E"],
      nameFr: "Énergie",
      nameEn: "Energy",
      descriptionFr: "Test énergie",
      descriptionEn: "Test energy",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        descriptionFr: `Description niveau ${i}`,
        descriptionEn: `Level ${i} description`,
      })),
    },
    [axisId("register")]: {
      id: axisId("register"),
      priority: 5,
      initials: ["R"],
      nameFr: "Registre",
      nameEn: "Register",
      descriptionFr: "Test registre",
      descriptionEn: "Test register",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        descriptionFr: `Description niveau ${i}`,
        descriptionEn: `Level ${i} description`,
      })),
    },
  },
});

// Mock implementations
class MockGetSpecUseCase implements GetSpecUseCase {
  execute(): Promise<Spec> {
    return Promise.resolve(createTestSpec());
  }
}

class MockBuildPromptUseCase implements BuildPromptUseCase {
  #lastProfile?: Profile;

  execute(_spec: Spec, profile: Profile, _lang: "fr" | "en"): string {
    this.#lastProfile = profile;
    return `Mock prompt for profile: T=${profile[axisId("telisme")]} C=${
      profile[axisId("confrontation")]
    } D=${profile[axisId("density")]} E=${profile[axisId("energy")]} R=${
      profile[axisId("register")]
    }`;
  }

  getLastProfile(): Profile | undefined {
    return this.#lastProfile;
  }
}

Deno.test("executeBuildPrompt - builds prompt with complete profile", async () => {
  const getSpec = new MockGetSpecUseCase();
  const buildPrompt = new MockBuildPromptUseCase();

  // Mock Deno.exit to prevent test termination
  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeBuildPrompt(
      getSpec,
      buildPrompt,
      [
        "--telisme=5",
        "--confrontation=3",
        "--density=7",
        "--energy=2",
        "--register=8",
      ],
    );

    const profile = buildPrompt.getLastProfile();
    assertEquals(exitCalled, false);
    assertEquals(profile![axisId("telisme")], 5);
    assertEquals(profile![axisId("confrontation")], 3);
    assertEquals(profile![axisId("density")], 7);
    assertEquals(profile![axisId("energy")], 2);
    assertEquals(profile![axisId("register")], 8);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeBuildPrompt - uses abbreviated axis names", async () => {
  const getSpec = new MockGetSpecUseCase();
  const buildPrompt = new MockBuildPromptUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeBuildPrompt(
      getSpec,
      buildPrompt,
      ["-t", "8", "-c", "4", "-d", "6", "-e", "3", "-r", "9"],
    );

    const profile = buildPrompt.getLastProfile();
    assertEquals(exitCalled, false);
    assertEquals(profile![axisId("telisme")], 8);
    assertEquals(profile![axisId("confrontation")], 4);
    assertEquals(profile![axisId("density")], 6);
    assertEquals(profile![axisId("energy")], 3);
    assertEquals(profile![axisId("register")], 9);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeBuildPrompt - handles language parameter", async () => {
  const getSpec = new MockGetSpecUseCase();
  const buildPrompt = new MockBuildPromptUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeBuildPrompt(
      getSpec,
      buildPrompt,
      [
        "--lang=en",
        "--telisme=5",
        "--confrontation=5",
        "--density=5",
        "--energy=5",
        "--register=5",
      ],
    );

    assertEquals(exitCalled, false);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeBuildPrompt - prompts for missing axes (interactive mode)", async () => {
  const getSpec = new MockGetSpecUseCase();
  const buildPrompt = new MockBuildPromptUseCase();

  // Provide mock interactively function with correct signature and types
  const mockBuildProfileInteractively = (
    _spec: Spec,
    _partial: PartialProfile,
    _lang: "fr" | "en",
  ): Promise<Profile> =>
    Promise.resolve({
      [axisId("telisme")]: 1,
      [axisId("confrontation")]: 2,
      [axisId("density")]: 3,
      [axisId("energy")]: 4,
      [axisId("register")]: 5,
    });

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeBuildPrompt(
      getSpec,
      buildPrompt,
      ["--telisme=1"], // missing other axes
      mockBuildProfileInteractively,
    );
    const profile = buildPrompt.getLastProfile();
    assertEquals(exitCalled, false);
    assertEquals(profile![axisId("telisme")], 1);
    assertEquals(profile![axisId("confrontation")], 2);
    assertEquals(profile![axisId("density")], 3);
    assertEquals(profile![axisId("energy")], 4);
    assertEquals(profile![axisId("register")], 5);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeBuildPrompt - handles error and exits", async () => {
  // Mock GetSpecUseCase to throw
  class FailingGetSpecUseCase implements GetSpecUseCase {
    execute(): Promise<Spec> {
      return Promise.reject(new Error("Spec error"));
    }
  }
  const getSpec = new FailingGetSpecUseCase();
  const buildPrompt = new MockBuildPromptUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeBuildPrompt(getSpec, buildPrompt, ["--telisme=1"]);
    assertEquals(exitCalled, true);
  } finally {
    Deno.exit = originalExit;
  }
});
