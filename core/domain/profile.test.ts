/**
 * Tests for profile domain functions.
 */

import { assertEquals } from "@std/assert";
import {
  createProfile,
  getMissingAxes,
  isComplete,
  type PartialProfile,
  type Profile,
} from "./profile.ts";

Deno.test("createProfile - uses defaults for all missing values", () => {
  const profile = createProfile({});
  assertEquals(profile, {
    telisme: 5,
    confrontation: 5,
    density: 5,
    energy: 5,
    register: 5,
  });
});

Deno.test("createProfile - preserves provided values", () => {
  const profile = createProfile({
    telisme: 8,
    confrontation: 3,
  });
  assertEquals(profile, {
    telisme: 8,
    confrontation: 3,
    density: 5,
    energy: 5,
    register: 5,
  });
});

Deno.test("createProfile - uses custom defaults", () => {
  const customDefaults: Profile = {
    telisme: 7,
    confrontation: 7,
    density: 7,
    energy: 7,
    register: 7,
  };
  const profile = createProfile({ telisme: 9 }, customDefaults);
  assertEquals(profile, {
    telisme: 9,
    confrontation: 7,
    density: 7,
    energy: 7,
    register: 7,
  });
});

Deno.test("createProfile - handles complete profile", () => {
  const complete: Profile = {
    telisme: 1,
    confrontation: 2,
    density: 3,
    energy: 4,
    register: 5,
  };
  const profile = createProfile(complete);
  assertEquals(profile, complete);
});

Deno.test("createProfile - handles zero values", () => {
  const profile = createProfile({
    telisme: 0,
    confrontation: 0,
    density: 0,
    energy: 0,
    register: 0,
  });
  assertEquals(profile, {
    telisme: 0,
    confrontation: 0,
    density: 0,
    energy: 0,
    register: 0,
  });
});

Deno.test("isComplete - returns true for complete profile", () => {
  const complete: PartialProfile = {
    telisme: 5,
    confrontation: 5,
    density: 5,
    energy: 5,
    register: 5,
  };
  assertEquals(isComplete(complete), true);
});

Deno.test("isComplete - returns false when one axis is missing", () => {
  const tests: PartialProfile[] = [
    { confrontation: 5, density: 5, energy: 5, register: 5 },
    { telisme: 5, density: 5, energy: 5, register: 5 },
    { telisme: 5, confrontation: 5, energy: 5, register: 5 },
    { telisme: 5, confrontation: 5, density: 5, register: 5 },
    { telisme: 5, confrontation: 5, density: 5, energy: 5 },
  ];

  for (const partial of tests) {
    assertEquals(isComplete(partial), false);
  }
});

Deno.test("isComplete - returns false for empty profile", () => {
  assertEquals(isComplete({}), false);
});

Deno.test("isComplete - returns false when multiple axes missing", () => {
  assertEquals(isComplete({ telisme: 5 }), false);
  assertEquals(isComplete({ telisme: 5, confrontation: 3 }), false);
});

Deno.test("isComplete - handles profile with zero values", () => {
  const complete: PartialProfile = {
    telisme: 0,
    confrontation: 0,
    density: 0,
    energy: 0,
    register: 0,
  };
  assertEquals(isComplete(complete), true);
});

Deno.test("getMissingAxes - returns empty array for complete profile", () => {
  const complete: PartialProfile = {
    telisme: 5,
    confrontation: 5,
    density: 5,
    energy: 5,
    register: 5,
  };
  assertEquals(getMissingAxes(complete), []);
});

Deno.test("getMissingAxes - returns all axes for empty profile", () => {
  assertEquals(getMissingAxes({}), [
    "telisme",
    "confrontation",
    "density",
    "energy",
    "register",
  ]);
});

Deno.test("getMissingAxes - returns missing axes in priority order", () => {
  const tests: Array<[PartialProfile, string[]]> = [
    [{ telisme: 5 }, ["confrontation", "density", "energy", "register"]],
    [
      { telisme: 5, confrontation: 3 },
      ["density", "energy", "register"],
    ],
    [
      { telisme: 5, confrontation: 3, density: 7 },
      ["energy", "register"],
    ],
    [
      { telisme: 5, confrontation: 3, density: 7, energy: 2 },
      ["register"],
    ],
    [
      { confrontation: 3, density: 7, energy: 2, register: 1 },
      ["telisme"],
    ],
    [
      { telisme: 5, density: 7, register: 1 },
      ["confrontation", "energy"],
    ],
  ];

  for (const [partial, expected] of tests) {
    assertEquals(getMissingAxes(partial), expected);
  }
});

Deno.test("getMissingAxes - handles profile with zero values", () => {
  const partial: PartialProfile = {
    telisme: 0,
    confrontation: 0,
    density: 0,
  };
  assertEquals(getMissingAxes(partial), ["energy", "register"]);
});
