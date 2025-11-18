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
import { type AxisId, axisId } from "./axis.ts";

function testAxisIds(): readonly AxisId[] {
  return [
    axisId("telisme"),
    axisId("confrontation"),
    axisId("density"),
    axisId("energy"),
    axisId("register"),
  ];
}

Deno.test("createProfile - uses provided defaults for missing values", () => {
  const defaults: Profile = {
    telisme: 5,
    confrontation: 5,
    density: 5,
    energy: 5,
    register: 5,
  } as unknown as Profile; // dynamic record
  const profile = createProfile({}, defaults);
  assertEquals(profile, defaults);
});

Deno.test("createProfile - preserves provided values", () => {
  const defaults: Profile = {
    telisme: 5,
    confrontation: 5,
    density: 5,
    energy: 5,
    register: 5,
  } as unknown as Profile;
  const profile = createProfile(
    { [axisId("telisme")]: 8, [axisId("confrontation")]: 3 },
    defaults,
  );
  assertEquals(profile[axisId("telisme")], 8);
  assertEquals(profile[axisId("confrontation")], 3);
  assertEquals(profile[axisId("density")], 5);
});

Deno.test("createProfile - uses custom defaults", () => {
  const customDefaults: Profile = {
    telisme: 7,
    confrontation: 7,
    density: 7,
    energy: 7,
    register: 7,
  } as unknown as Profile;
  const profile = createProfile(
    { [axisId("telisme")]: 9 },
    customDefaults,
  );
  assertEquals(profile[axisId("telisme")], 9);
  assertEquals(profile[axisId("confrontation")], 7);
});

Deno.test("createProfile - handles complete profile", () => {
  const complete: Profile = {
    telisme: 1,
    confrontation: 2,
    density: 3,
    energy: 4,
    register: 5,
  } as unknown as Profile;
  const profile = createProfile(complete);
  assertEquals(profile[axisId("telisme")], 1);
  assertEquals(profile[axisId("register")], 5);
});

Deno.test("createProfile - handles zero values", () => {
  const profile = createProfile(
    { telisme: 0, confrontation: 0 } as PartialProfile,
    { density: 0, energy: 0, register: 0 } as Profile,
  );
  assertEquals(profile[axisId("telisme")], 0);
  assertEquals(profile[axisId("confrontation")], 0);
});

Deno.test("isComplete - returns true for complete profile", () => {
  const axisIds = testAxisIds();
  const complete: PartialProfile = {
    telisme: 5,
    confrontation: 5,
    density: 5,
    energy: 5,
    register: 5,
  } as unknown as PartialProfile;
  assertEquals(isComplete(complete, axisIds), true);
});

Deno.test("isComplete - returns false when one axis is missing", () => {
  const axisIds = testAxisIds();
  const tests: PartialProfile[] = [
    { confrontation: 5, density: 5, energy: 5, register: 5 } as PartialProfile,
    { telisme: 5, density: 5, energy: 5, register: 5 } as PartialProfile,
  ];
  for (const partial of tests) {
    assertEquals(isComplete(partial, axisIds), false);
  }
});

Deno.test("isComplete - returns false for empty profile", () => {
  const axisIds = testAxisIds();
  assertEquals(isComplete({}, axisIds), false);
});

Deno.test("isComplete - returns false when multiple axes missing", () => {
  const axisIds = testAxisIds();
  assertEquals(isComplete({ telisme: 5 } as PartialProfile, axisIds), false);
  assertEquals(
    isComplete({ telisme: 5, confrontation: 3 } as PartialProfile, axisIds),
    false,
  );
});

Deno.test("isComplete - handles profile with zero values", () => {
  const axisIds = testAxisIds();
  const complete: PartialProfile = {
    telisme: 0,
    confrontation: 0,
    density: 0,
    energy: 0,
    register: 0,
  } as unknown as PartialProfile;
  assertEquals(isComplete(complete, axisIds), true);
});

Deno.test("getMissingAxes - returns empty array for complete profile", () => {
  const axisIds = testAxisIds();
  const complete: PartialProfile = {
    telisme: 5,
    confrontation: 5,
    density: 5,
    energy: 5,
    register: 5,
  } as unknown as PartialProfile;
  assertEquals(getMissingAxes(complete, axisIds), []);
});

Deno.test("getMissingAxes - returns all axes for empty profile", () => {
  const axisIds = testAxisIds();
  assertEquals(getMissingAxes({}, axisIds), [
    "telisme",
    "confrontation",
    "density",
    "energy",
    "register",
  ]);
});

Deno.test("getMissingAxes - returns missing axes in supplied order", () => {
  const axisIds = testAxisIds();
  const partial: PartialProfile = { telisme: 5 } as PartialProfile;
  assertEquals(getMissingAxes(partial, axisIds), [
    "confrontation",
    "density",
    "energy",
    "register",
  ]);
});

Deno.test("getMissingAxes - handles profile with zero values", () => {
  const axisIds = testAxisIds();
  const partial: PartialProfile = {
    telisme: 0,
    confrontation: 0,
    density: 0,
  } as PartialProfile;
  assertEquals(getMissingAxes(partial, axisIds), ["energy", "register"]);
});
