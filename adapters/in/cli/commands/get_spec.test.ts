/**
 * Integration tests for get_spec command.
 */

import { assertEquals } from "@std/assert";
import { executeGetSpec } from "./get_spec.ts";
import type { GetSpecUseCase } from "~/core/application/ports/in/get_spec.ts";
import type { Spec } from "~/core/domain/spec.ts";
import { axisId } from "~/core/domain/axis.ts";

// Test fixture (inline)
const createTestSpec = (): Spec => ({
  descriptionFr: "Spec de test en français",
  descriptionEn: "Test spec in English",
  promptFragmentFr: "Fragment FR global",
  promptFragmentEn: "Global EN fragment",
  axes: {
    [axisId("telisme")]: {
      id: axisId("telisme"),
      priority: 1,
      initials: ["T", "I"],
      nameFr: "Télisme",
      nameEn: "Initiative",
      descriptionFr: "Description du télisme",
      descriptionEn: "Initiative description",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        descriptionFr: `Description niveau ${i}`,
        descriptionEn: `Level ${i} description`,
        promptFr: `Prompt niveau ${i}`,
        promptEn: `Level ${i} prompt`,
      })),
    },
    [axisId("confrontation")]: {
      id: axisId("confrontation"),
      priority: 2,
      initials: ["C"],
      nameFr: "Confrontation",
      nameEn: "Challenge",
      descriptionFr: "Description de la confrontation",
      descriptionEn: "Challenge description",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        descriptionFr: `Description niveau ${i}`,
        descriptionEn: `Level ${i} description`,
        promptFr: `Prompt niveau ${i}`,
        promptEn: `Level ${i} prompt`,
      })),
    },
    [axisId("density")]: {
      id: axisId("density"),
      priority: 3,
      initials: ["D"],
      nameFr: "Densité",
      nameEn: "Density",
      descriptionFr: "Description de la densité",
      descriptionEn: "Density description",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        descriptionFr: `Description niveau ${i}`,
        descriptionEn: `Level ${i} description`,
        promptFr: `Prompt niveau ${i}`,
        promptEn: `Level ${i} prompt`,
      })),
    },
    [axisId("energy")]: {
      id: axisId("energy"),
      priority: 4,
      initials: ["E"],
      nameFr: "Énergie",
      nameEn: "Energy",
      descriptionFr: "Description de l'énergie",
      descriptionEn: "Energy description",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        descriptionFr: `Description niveau ${i}`,
        descriptionEn: `Level ${i} description`,
        promptFr: `Prompt niveau ${i}`,
        promptEn: `Level ${i} prompt`,
      })),
    },
    [axisId("register")]: {
      id: axisId("register"),
      priority: 5,
      initials: ["R"],
      nameFr: "Registre",
      nameEn: "Register",
      descriptionFr: "Description du registre",
      descriptionEn: "Register description",
      levels: Array.from({ length: 11 }, (_, i) => ({
        level: i,
        nameFr: `Niveau ${i}`,
        nameEn: `Level ${i}`,
        descriptionFr: `Description niveau ${i}`,
        descriptionEn: `Level ${i} description`,
        promptFr: `Prompt niveau ${i}`,
        promptEn: `Level ${i} prompt`,
      })),
    },
  },
});

// Mock implementation
class MockGetSpecUseCase implements GetSpecUseCase {
  execute(): Promise<Spec> {
    return Promise.resolve(createTestSpec());
  }
}

Deno.test("executeGetSpec - displays full spec in French by default", async () => {
  const getSpec = new MockGetSpecUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeGetSpec(getSpec, []);
    assertEquals(exitCalled, false);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeGetSpec - displays full spec in English with --lang=en", async () => {
  const getSpec = new MockGetSpecUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeGetSpec(getSpec, ["--lang=en"]);
    assertEquals(exitCalled, false);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeGetSpec - displays single axis by ID", async () => {
  const getSpec = new MockGetSpecUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeGetSpec(getSpec, ["telisme"]);
    assertEquals(exitCalled, false);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeGetSpec - displays single axis by initial", async () => {
  const getSpec = new MockGetSpecUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeGetSpec(getSpec, ["C"]);
    assertEquals(exitCalled, false);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeGetSpec - displays single axis by French name", async () => {
  const getSpec = new MockGetSpecUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeGetSpec(getSpec, ["Densité"]);
    assertEquals(exitCalled, false);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeGetSpec - displays single axis by English name", async () => {
  const getSpec = new MockGetSpecUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeGetSpec(getSpec, ["Energy"]);
    assertEquals(exitCalled, false);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeGetSpec - exits with error for invalid axis", async () => {
  const getSpec = new MockGetSpecUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  let exitCode: number | undefined;
  Deno.exit = ((code?: number) => {
    exitCalled = true;
    exitCode = code;
  }) as typeof Deno.exit;

  try {
    await executeGetSpec(getSpec, ["invalid_axis"]);
    assertEquals(exitCalled, true);
    assertEquals(exitCode, 1);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeGetSpec - uses --axis flag", async () => {
  const getSpec = new MockGetSpecUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeGetSpec(getSpec, ["--axis=register"]);
    assertEquals(exitCalled, false);
  } finally {
    Deno.exit = originalExit;
  }
});

Deno.test("executeGetSpec - handles error from getSpec.execute", async () => {
  // Mock GetSpecUseCase to throw during execute
  class FailingGetSpecUseCase implements GetSpecUseCase {
    execute(): Promise<Spec> {
      return Promise.reject(new Error("Failed to load spec"));
    }
  }
  const getSpec = new FailingGetSpecUseCase();

  const originalExit = Deno.exit;
  let exitCalled = false;
  Deno.exit = (() => {
    exitCalled = true;
  }) as typeof Deno.exit;

  try {
    await executeGetSpec(getSpec, []);
    assertEquals(exitCalled, true);
  } finally {
    Deno.exit = originalExit;
  }
});
