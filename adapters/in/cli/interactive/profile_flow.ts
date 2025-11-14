/**
 * Interactive flow for building a profile.
 * Guides the user through selecting levels for missing axes.
 */

import type { Spec } from "~/core/domain/spec.ts";
import type { PartialProfile, Profile } from "~/core/domain/profile.ts";
import { getMissingAxes } from "~/core/domain/profile.ts";
import { getAxisById } from "~/core/domain/spec.ts";
import type { AxisId } from "~/core/domain/axis.ts";
import type { Language } from "~/core/application/ports/in/build_prompt.ts";
import { formatAvailableLevels, validateLevelInput } from "./validators.ts";
import { ExplicitCast } from "~/core/common/explicit_cast.ts";
import { getMessages } from "../messages.ts";
import * as ui from "../ui.ts";

/**
 * Prompt the user for a level value for a given axis.
 */
async function promptForAxis(
  spec: Spec,
  axisId: AxisId,
  lang: Language,
): Promise<number | undefined> {
  const axis = getAxisById(spec, axisId);
  if (!axis) return undefined;

  const msg = getMessages(lang);
  const axisName = lang === "fr" ? axis.nameFr : axis.nameEn;
  const description = lang === "fr" ? axis.descriptionFr : axis.descriptionEn;

  ui.title(`\n${axisName}`);
  ui.dim(description);
  ui.info(msg.promptAvailableLevels);
  ui.info(formatAvailableLevels(axis, lang));
  ui.prompt(`${msg.promptChooseLevel} ${axisName} (0-10, FR or EN name): `);

  const decoder = new TextDecoder();
  const buffer = new Uint8Array(1024);
  const n = await Deno.stdin.read(buffer);
  if (n === null) return undefined;

  const input = decoder.decode(buffer.subarray(0, n)).trim();
  const level = validateLevelInput(axis, input);

  if (level === undefined) {
    ui.error(`${msg.errorInvalidLevelInput}: "${input}"`);
    return undefined;
  }

  return level;
}

/**
 * Build a complete profile interactively, asking for missing axes.
 */
export async function buildProfileInteractively(
  spec: Spec,
  partial: PartialProfile,
  lang: Language,
): Promise<Profile> {
  const missing = getMissingAxes(partial);
  const profile: PartialProfile = { ...partial };

  for (const axisId of missing) {
    let level: number | undefined;
    while (level === undefined) {
      level = await promptForAxis(spec, axisId, lang);
    }
    ExplicitCast.from<PartialProfile>(profile).cast<Record<string, number>>()[
      axisId
    ] = level;
  }

  return ExplicitCast.from<PartialProfile>(profile).cast<Profile>();
}
