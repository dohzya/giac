/**
 * Integration tests for build_prompt command.
 */

import { assertEquals } from "@std/assert";
import { executeBuildPrompt } from "./build_prompt.ts";
import type { BuildPromptUseCase } from "~/core/application/ports/in/build_prompt.ts";
import type { GetSpecUseCase } from "~/core/application/ports/in/get_spec.ts";
import type { Spec } from "~/core/domain/spec.ts";
import type { PartialProfile, Profile } from "~/core/domain/profile.ts";
import type { Level } from "~/core/domain/axis.ts";

// Test fixtures (inline)
const createTestSpec = (): Spec => ({
  descriptionFr: "Test spec FR",
  descriptionEn: "Test spec EN",
  promptFragmentFr: "Fragment FR",
  promptFragmentEn: "Fragment EN",
  axes: [
    {
      id: "telisme",
      initials: ["T", "I"],
      nameFr: "Télisme",
      nameEn: "Initiative",
      descriptionFr: "Test télisme",
      descriptionEn: "Test initiative",
      promptFragmentFr: "Télisme fragment FR",
      promptFragmentEn: "Initiative fragment EN",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i as Level,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        promptFragmentFr: `Fragment FR ${i}`,
        promptFragmentEn: `Fragment EN ${i}`,
      })),
    },
    {
      id: "confrontation",
      initials: ["C"],
      nameFr: "Confrontation",
      nameEn: "Challenge",
      descriptionFr: "Test confrontation",
      descriptionEn: "Test challenge",
      promptFragmentFr: "Confrontation fragment FR",
      promptFragmentEn: "Challenge fragment EN",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i as Level,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        promptFragmentFr: `Fragment FR ${i}`,
        promptFragmentEn: `Fragment EN ${i}`,
      })),
    },
    {
      id: "density",
      initials: ["D"],
      nameFr: "Densité",
      nameEn: "Density",
      descriptionFr: "Test densité",
      descriptionEn: "Test density",
      promptFragmentFr: "Densité fragment FR",
      promptFragmentEn: "Density fragment EN",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i as Level,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        promptFragmentFr: `Fragment FR ${i}`,
        promptFragmentEn: `Fragment EN ${i}`,
      })),
    },
    {
      id: "energy",
      initials: ["E"],
      nameFr: "Énergie",
      nameEn: "Energy",
      descriptionFr: "Test énergie",
      descriptionEn: "Test energy",
      promptFragmentFr: "Énergie fragment FR",
      promptFragmentEn: "Energy fragment EN",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i as Level,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        promptFragmentFr: `Fragment FR ${i}`,
        promptFragmentEn: `Fragment EN ${i}`,
      })),
    },
    {
      id: "register",
      initials: ["R"],
      nameFr: "Registre",
      nameEn: "Register",
      descriptionFr: "Test registre",
      descriptionEn: "Test register",
      promptFragmentFr: "Registre fragment FR",
      promptFragmentEn: "Register fragment EN",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i as Level,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        promptFragmentFr: `Fragment FR ${i}`,
        promptFragmentEn: `Fragment EN ${i}`,
      })),
    },
  ],
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
    return `Mock prompt for profile: T=${profile.telisme} C=${profile.confrontation} D=${profile.density} E=${profile.energy} R=${profile.register}`;
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
    assertEquals(profile, {
      telisme: 5,
      confrontation: 3,
      density: 7,
      energy: 2,
      register: 8,
    });
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
    assertEquals(profile, {
      telisme: 8,
      confrontation: 4,
      density: 6,
      energy: 3,
      register: 9,
    });
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
    Promise.resolve(
      {
        telisme: 1,
        confrontation: 2,
        density: 3,
        energy: 4,
        register: 5,
      } as const,
    );

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
    assertEquals(profile, {
      telisme: 1,
      confrontation: 2,
      density: 3,
      energy: 4,
      register: 5,
    });
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
