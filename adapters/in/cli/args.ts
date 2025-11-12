/**
 * Parse CLI arguments and environment variables.
 * Returns a partial profile and language preference.
 */

import type { PartialProfile } from "~/core/domain/profile.ts";
import type { Language } from "~/core/application/ports/in/build_prompt.ts";
import type { Spec } from "~/core/domain/spec.ts";
import { resolveLevel } from "~/core/domain/spec.ts";
import { ExplicitCast } from "~/core/common/explicit_cast.ts";

/**
 * Simple argument parser for CLI flags.
 */
export function parseArgsSimple(
  args: string[],
): Record<string, string | boolean> {
  const result: Record<string, string | boolean> = {};
  let i = 0;

  while (i < args.length) {
    const arg = args[i]!;

    if (arg.startsWith("-") && arg.includes("=")) {
      const dashCount = arg.startsWith("--") ? 2 : 1;
      const parts = arg.substring(dashCount).split("=", 2);
      const key = parts[0];
      const value = parts[1];
      if (key) {
        result[key] = value ?? true;
      }
      i++;
      continue;
    }

    if (arg.startsWith("--")) {
      const key = arg.substring(2);
      if (i + 1 < args.length && !args[i + 1]!.startsWith("-")) {
        result[key] = args[i + 1]!;
        i += 2;
      } else {
        result[key] = true;
        i++;
      }
      continue;
    }

    if (arg.startsWith("-") && !arg.startsWith("--")) {
      const key = arg.substring(1);
      if (i + 1 < args.length && !args[i + 1]!.startsWith("-")) {
        result[key] = args[i + 1]!;
        i += 2;
      } else {
        result[key] = true;
        i++;
      }
      continue;
    }

    i++;
  }

  return result;
}

export interface ParsedArgs {
  readonly profile: PartialProfile;
  readonly lang: Language;
}

/**
 * Parse environment variables for axis values.
 */
function parseEnvVars(): Partial<Record<string, string>> {
  const env: Partial<Record<string, string>> = {};

  const envVars = [
    "TELISME_VALUE",
    "CHALLENGE_VALUE",
    "CONFRONTATION_VALUE",
    "DENSITY_VALUE",
    "ENERGY_VALUE",
    "REGISTER_VALUE",
  ];

  for (const envVar of envVars) {
    const value = Deno.env.get(envVar);
    if (value !== undefined) {
      env[envVar] = value;
    }
  }

  return env;
}

/**
 * Parse CLI arguments and environment variables into a partial profile.
 */
export function parseArgs(spec: Spec, args: string[]): ParsedArgs {
  const flags = parseArgsSimple(args);

  if (flags.initiative !== undefined && flags.telisme === undefined) {
    flags.telisme = flags.initiative;
  }
  if (flags.t !== undefined && flags.telisme === undefined) {
    flags.telisme = flags.t;
  }
  if (flags.challenge !== undefined && flags.confrontation === undefined) {
    flags.confrontation = flags.challenge;
  }
  if (flags.c !== undefined && flags.confrontation === undefined) {
    flags.confrontation = flags.c;
  }
  if (flags.densité !== undefined && flags.density === undefined) {
    flags.density = flags.densité;
  }
  if (flags.d !== undefined && flags.density === undefined) {
    flags.density = flags.d;
  }
  if (flags.énergie !== undefined && flags.energy === undefined) {
    flags.energy = flags.énergie;
  }
  if (flags.e !== undefined && flags.energy === undefined) {
    flags.energy = flags.e;
  }
  if (flags.registre !== undefined && flags.register === undefined) {
    flags.register = flags.registre;
  }
  if (flags.r !== undefined && flags.register === undefined) {
    flags.register = flags.r;
  }

  const profile: PartialProfile = {};
  const envVars = parseEnvVars();

  let lang: Language = "fr";
  const envLang = Deno.env.get("GIAC_LANG");
  if (envLang === "en" || envLang === "fr") {
    lang = envLang;
  }
  if (flags.fr === true || flags.fr === "true") lang = "fr";
  if (flags.en === true || flags.en === "true") lang = "en";

  const axisMappings = [
    {
      envVar: "TELISME_VALUE",
      cliKeys: ["telisme", "initiative", "t"],
      axisId: "telisme",
    },
    {
      envVar: "CHALLENGE_VALUE",
      cliKeys: ["confrontation", "challenge", "c"],
      axisId: "confrontation",
    },
    {
      envVar: "CONFRONTATION_VALUE",
      cliKeys: ["confrontation", "challenge", "c"],
      axisId: "confrontation",
    },
    {
      envVar: "DENSITY_VALUE",
      cliKeys: ["density", "densité", "d"],
      axisId: "density",
    },
    {
      envVar: "ENERGY_VALUE",
      cliKeys: ["energy", "énergie", "e"],
      axisId: "energy",
    },
    {
      envVar: "REGISTER_VALUE",
      cliKeys: ["register", "registre", "r"],
      axisId: "register",
    },
  ];

  for (const mapping of axisMappings) {
    const envValue = envVars[mapping.envVar];
    if (envValue !== undefined) {
      const axis = spec.axes.find((a) => a.id === mapping.axisId);
      if (axis) {
        const level = resolveLevel(axis, envValue);
        if (level !== undefined) {
          ExplicitCast.from<PartialProfile>(profile).cast<
            Record<string, number>
          >()[mapping.axisId] = level;
          continue;
        }
      }
    }

    for (const key of mapping.cliKeys) {
      const value = flags[key];
      if (value !== undefined) {
        const axis = spec.axes.find((a) => a.id === mapping.axisId);
        if (axis) {
          // Try to resolve as level (handles both string and number)
          const level = resolveLevel(axis, String(value));
          if (level !== undefined) {
            ExplicitCast.from<PartialProfile>(profile).cast<
              Record<string, number>
            >()[mapping.axisId] = level;
            break;
          }
        }
      }
    }
  }

  return { profile, lang };
}
