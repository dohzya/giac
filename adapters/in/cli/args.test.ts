/**
 * Tests for CLI argument parsing.
 */

import { assertEquals } from "@std/assert";
import { parseArgs, parseArgsSimple } from "./args.ts";
import type { Spec } from "~/core/domain/spec.ts";

function createTestSpec(): Spec {
  return {
    descriptionFr: "Description FR",
    descriptionEn: "Description EN",
    promptFragmentFr: "Fragment FR",
    promptFragmentEn: "Fragment EN",
    axes: [
      {
        id: "telisme",
        initials: ["T"],
        nameFr: "Télisme",
        nameEn: "Telism",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        promptFragmentFr: "Fragment FR",
        promptFragmentEn: "Fragment EN",
        levels: [
          {
            level: 0,
            nameFr: "Niveau 0",
            nameEn: "Level 0",
            promptFragmentFr: "Fragment 0 FR",
            promptFragmentEn: "Fragment 0 EN",
          },
          {
            level: 5,
            nameFr: "Niveau 5",
            nameEn: "Level 5",
            promptFragmentFr: "Fragment 5 FR",
            promptFragmentEn: "Fragment 5 EN",
          },
          {
            level: 10,
            nameFr: "Niveau 10",
            nameEn: "Level 10",
            promptFragmentFr: "Fragment 10 FR",
            promptFragmentEn: "Fragment 10 EN",
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
        promptFragmentFr: "Fragment FR",
        promptFragmentEn: "Fragment EN",
        levels: [
          {
            level: 0,
            nameFr: "Niveau 0",
            nameEn: "Level 0",
            promptFragmentFr: "Fragment 0 FR",
            promptFragmentEn: "Fragment 0 EN",
          },
          {
            level: 3,
            nameFr: "Niveau 3",
            nameEn: "Level 3",
            promptFragmentFr: "Fragment 3 FR",
            promptFragmentEn: "Fragment 3 EN",
          },
        ],
      },
      {
        id: "density",
        initials: ["D"],
        nameFr: "Densité",
        nameEn: "Density",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        promptFragmentFr: "Fragment FR",
        promptFragmentEn: "Fragment EN",
        levels: [
          {
            level: 0,
            nameFr: "Niveau 0",
            nameEn: "Level 0",
            promptFragmentFr: "Fragment 0 FR",
            promptFragmentEn: "Fragment 0 EN",
          },
        ],
      },
      {
        id: "energy",
        initials: ["E"],
        nameFr: "Énergie",
        nameEn: "Energy",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        promptFragmentFr: "Fragment FR",
        promptFragmentEn: "Fragment EN",
        levels: [
          {
            level: 8,
            nameFr: "Niveau 8",
            nameEn: "Level 8",
            promptFragmentFr: "Fragment 8 FR",
            promptFragmentEn: "Fragment 8 EN",
          },
        ],
      },
      {
        id: "register",
        initials: ["R"],
        nameFr: "Registre",
        nameEn: "Register",
        descriptionFr: "Description FR",
        descriptionEn: "Description EN",
        promptFragmentFr: "Fragment FR",
        promptFragmentEn: "Fragment EN",
        levels: [
          {
            level: 2,
            nameFr: "Niveau 2",
            nameEn: "Level 2",
            promptFragmentFr: "Fragment 2 FR",
            promptFragmentEn: "Fragment 2 EN",
          },
        ],
      },
    ],
  };
}

Deno.test("parseArgsSimple - empty args", () => {
  const result = parseArgsSimple([]);
  assertEquals(result, {});
});

Deno.test("parseArgsSimple - single flag", () => {
  const result = parseArgsSimple(["--fr"]);
  assertEquals(result, { fr: true });
});

Deno.test("parseArgsSimple - flag with value", () => {
  const result = parseArgsSimple(["--key", "value"]);
  assertEquals(result, { key: "value" });
});

Deno.test("parseArgsSimple - short flag", () => {
  const result = parseArgsSimple(["-f"]);
  assertEquals(result, { f: true });
});

Deno.test("parseArgsSimple - short flag with value", () => {
  const result = parseArgsSimple(["-k", "value"]);
  assertEquals(result, { k: "value" });
});

Deno.test("parseArgsSimple - equals syntax (long)", () => {
  const result = parseArgsSimple(["--key=value"]);
  assertEquals(result, { key: "value" });
});

Deno.test("parseArgsSimple - equals syntax (short)", () => {
  const result = parseArgsSimple(["-k=value"]);
  assertEquals(result, { k: "value" });
});

Deno.test("parseArgsSimple - multiple flags", () => {
  const result = parseArgsSimple(["--fr", "--en"]);
  assertEquals(result, { fr: true, en: true });
});

Deno.test("parseArgsSimple - mixed flags and values", () => {
  const result = parseArgsSimple(["--fr", "--key", "value", "-x"]);
  assertEquals(result, { fr: true, key: "value", x: true });
});

Deno.test("parseArgsSimple - flag followed by non-flag is value", () => {
  const result = parseArgsSimple(["--key", "value", "positional"]);
  assertEquals(result, { key: "value" });
});

Deno.test("parseArgsSimple - equals with empty value", () => {
  const result = parseArgsSimple(["--key="]);
  assertEquals(result, { key: "" });
});

Deno.test("parseArgs - default language is fr", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, []);
  assertEquals(result.lang, "fr");
  assertEquals(result.profile, {});
});

Deno.test("parseArgs - language from CLI flag --fr", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--fr"]);
  assertEquals(result.lang, "fr");
});

Deno.test("parseArgs - language from CLI flag --en", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--en"]);
  assertEquals(result.lang, "en");
});

Deno.test("parseArgs - language from env var GIAC_LANG", () => {
  const spec = createTestSpec();
  Deno.env.set("GIAC_LANG", "en");
  const result = parseArgs(spec, []);
  assertEquals(result.lang, "en");
  Deno.env.delete("GIAC_LANG");
});

Deno.test("parseArgs - CLI flag overrides env var", () => {
  const spec = createTestSpec();
  Deno.env.set("GIAC_LANG", "fr");
  const result = parseArgs(spec, ["--en"]);
  assertEquals(result.lang, "en");
  Deno.env.delete("GIAC_LANG");
});

Deno.test("parseArgs - parse axis value from CLI (long form)", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--telisme", "5"]);
  assertEquals(result.profile.telisme, 5);
});

Deno.test("parseArgs - parse axis value from CLI (short form)", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["-t", "5"]);
  assertEquals(result.profile.telisme, 5);
});

Deno.test("parseArgs - parse axis value from CLI (equals syntax)", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--telisme=5"]);
  assertEquals(result.profile.telisme, 5);
});

Deno.test("parseArgs - alias initiative maps to telisme", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--initiative", "5"]);
  assertEquals(result.profile.telisme, 5);
});

Deno.test("parseArgs - alias challenge maps to confrontation", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--challenge", "3"]);
  assertEquals(result.profile.confrontation, 3);
});

Deno.test("parseArgs - alias densité maps to density", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--densité", "0"]);
  assertEquals(result.profile.density, 0);
});

Deno.test("parseArgs - alias énergie maps to energy", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--énergie", "8"]);
  assertEquals(result.profile.energy, 8);
});

Deno.test("parseArgs - alias registre maps to register", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--registre", "2"]);
  assertEquals(result.profile.register, 2);
});

Deno.test("parseArgs - parse axis value from env var", () => {
  const spec = createTestSpec();
  Deno.env.set("TELISME_VALUE", "5");
  const result = parseArgs(spec, []);
  assertEquals(result.profile.telisme, 5);
  Deno.env.delete("TELISME_VALUE");
});

Deno.test("parseArgs - env var has priority over CLI", () => {
  const spec = createTestSpec();
  Deno.env.set("TELISME_VALUE", "0");
  const result = parseArgs(spec, ["--telisme", "5"]);
  // Env var is processed first, so it takes priority
  assertEquals(result.profile.telisme, 0);
  Deno.env.delete("TELISME_VALUE");
});

Deno.test("parseArgs - parse multiple axes", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--telisme", "5", "--confrontation", "3"]);
  assertEquals(result.profile.telisme, 5);
  // confrontation level 3 exists in test spec
  assertEquals(result.profile.confrontation, 3);
});

Deno.test("parseArgs - invalid level value is ignored", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--telisme", "99"]);
  assertEquals("telisme" in result.profile, false);
});

Deno.test("parseArgs - level name (French) is resolved", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--telisme", "Niveau 5"]);
  assertEquals(result.profile.telisme, 5);
});

Deno.test("parseArgs - level name (English) is resolved", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--telisme", "Level 10"]);
  assertEquals(result.profile.telisme, 10);
});

Deno.test("parseArgs - level name case insensitive", () => {
  const spec = createTestSpec();
  const result = parseArgs(spec, ["--telisme", "niveau 5"]);
  assertEquals(result.profile.telisme, 5);
});
