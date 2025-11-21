/**
 * Parse CLI arguments and environment variables.
 * Returns a partial profile and language preference.
 */

import type { PartialProfile } from "~/core/domain/profile.ts";
import type { Language } from "~/core/application/ports/in/build_prompt.ts";
import type { Spec } from "~/core/domain/spec.ts";
import { resolveLevel } from "~/core/domain/spec.ts";
import { UnspecifiedLevel } from "~/core/domain/axis.ts";
import { ExplicitCast } from "~/core/common/explicit_cast.ts";

/**
 * Parse a long flag (--key or --key=value) and return [key, value, consumedCount]
 */
function parseLongFlag(
  arg: string,
  nextArg: string | undefined,
): [string, string | boolean, number] | undefined {
  const match = /^--([^=]+)(?:=(.*))?$/.exec(arg);
  if (!match) return undefined;
  const key = match[1];
  const directValue = match[2];
  if (!key) return undefined;
  if (directValue !== undefined) return [key, directValue, 1];
  if (nextArg && (nextArg === UnspecifiedLevel || !nextArg.startsWith("-"))) {
    return [key, nextArg, 2];
  }
  return [key, true, 1];
}

/**
 * Parse a short flag (-k or -k=value) and return [key, value, consumedCount]
 */
function parseShortFlag(
  arg: string,
  nextArg: string | undefined,
): [string, string | boolean, number] | undefined {
  const match = /^-([^=])(?:=(.*))?$/.exec(arg);
  if (!match) return undefined;
  const key = match[1];
  const directValue = match[2];
  if (!key) return undefined;
  if (directValue !== undefined) return [key, directValue, 1];
  if (nextArg && (nextArg === UnspecifiedLevel || !nextArg.startsWith("-"))) {
    return [key, nextArg, 2];
  }
  return [key, true, 1];
}

/**
 * Simple argument parser for CLI flags.
 */
export function parseArgsSimple(
  args: string[],
): Record<string, string | boolean> {
  const result: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length;) {
    const arg = args[i];
    if (!arg?.startsWith("-")) {
      i++;
      continue;
    }
    const parsed = parseLongFlag(arg, args[i + 1]) ??
      parseShortFlag(arg, args[i + 1]);
    if (parsed) {
      const [key, value, consumed] = parsed;
      result[key] = value;
      i += consumed;
    } else {
      i++;
    }
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
// Convert axis id to primary env var name (e.g. telisme -> TELISME_VALUE)
function toEnvVar(id: string): string {
  return id.replaceAll(/[^a-zA-Z0-9]/g, "_").toUpperCase() + "_VALUE";
}

/**
 * Parse CLI arguments and environment variables into a partial profile.
 */
// Language resolution isolated to reduce complexity
function resolveLang(flags: Record<string, string | boolean>): Language {
  let lang: Language = "fr";
  const envLang = Deno.env.get("GIAC_LANG");
  if (envLang === "en" || envLang === "fr") lang = envLang;
  if (flags.fr === true || flags.fr === "true") lang = "fr";
  if (flags.en === true || flags.en === "true") lang = "en";
  return lang;
}

function applyEnv(
  axis: Spec["axes"][keyof Spec["axes"]],
  profile: PartialProfile,
): boolean {
  const id = axis.id as string;
  const envVal = Deno.env.get(toEnvVar(id));
  if (envVal === undefined) return false;
  const level = resolveLevel(axis, envVal);
  if (level === undefined) return false;
  const mutableProfile = ExplicitCast.from<PartialProfile>(profile)
    .cast<Record<string, typeof level>>();
  mutableProfile[id] = level;
  return true;
}

function buildPossibleKeys(
  id: string,
  initials: readonly string[],
  aliasToAxis: Record<string, string>,
): string[] {
  const keys = [id];
  for (const initial of initials) keys.push(initial.toLowerCase());
  for (const [alias, target] of Object.entries(aliasToAxis)) {
    if (target === id) keys.push(alias);
  }
  return keys;
}

function applyFlags(
  axis: Spec["axes"][keyof Spec["axes"]],
  flags: Record<string, string | boolean>,
  profile: PartialProfile,
  aliasToAxis: Record<string, string>,
): void {
  const id = axis.id as string;
  const possibleKeys = buildPossibleKeys(id, axis.initials, aliasToAxis);
  for (const key of possibleKeys) {
    const raw = flags[key];
    if (raw === undefined) continue;
    const level = resolveLevel(axis, String(raw));
    if (level !== undefined) {
      const mutableProfile = ExplicitCast.from<PartialProfile>(profile)
        .cast<Record<string, typeof level>>();
      mutableProfile[id] = level;
      break;
    }
  }
}

export function parseArgs(spec: Spec, args: string[]): ParsedArgs {
  const flags = parseArgsSimple(args);

  // Alias map (spec-driven axes can receive these extra French synonyms or legacy names)
  const aliasToAxis: Record<string, string> = {
    initiative: "telisme",
    challenge: "confrontation",
    densité: "density",
    "énergie": "energy",
    registre: "register",
  };

  const profile: PartialProfile = {};

  const lang = resolveLang(flags);

  // Iterate axes dynamically (spec-driven)
  for (const axis of Object.values(spec.axes)) {
    if (!applyEnv(axis, profile)) {
      applyFlags(axis, flags, profile, aliasToAxis);
    }
  }

  return { profile, lang };
}
