/**
 * YAML adapter implementing SpecReaderPort.
 * Loads and validates the spec from spec.yml using Zod.
 */

import { parse } from "@std/yaml";
import * as z from "zod/mini";
import type { SpecReaderPort } from "~/core/application/ports/out/spec_reader_port.ts";
import type { Axis, AxisId, LevelDefinition, Spec } from "~/core/domain/mod.ts";
import { getAxisIds } from "~/core/domain/spec.ts";
import { SpecValidationError } from "~/core/domain/errors.ts";
import { ExplicitCast } from "~/core/common/explicit_cast.ts";

// Constants derived from domain model (single source of truth)
const EXPECTED_LEVEL_COUNT = 11; // 0-10 inclusive
const EXPECTED_AXIS_COUNT = getAxisIds().length;

const LevelDefinitionSchema = z.object({
  level: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
  ]),
  name_fr: z.string(),
  name_en: z.string(),
  prompt_fragment_fr: z.string(),
  prompt_fragment_en: z.string(),
});

const AxisSchema = z.object({
  initials: z.array(z.string()),
  name_fr: z.string(),
  name_en: z.string(),
  description_fr: z.string(),
  description_en: z.string(),
  prompt_fragment_fr: z.string(),
  prompt_fragment_en: z.string(),
  levels: z.array(LevelDefinitionSchema).check(
    z.refine(
      (arr) => arr.length === EXPECTED_LEVEL_COUNT,
      `Must have exactly ${EXPECTED_LEVEL_COUNT} levels`,
    ),
  ),
});

const SpecSchema = z.object({
  description_fr: z.string(),
  description_en: z.string(),
  prompt_fragment_fr: z.string(),
  prompt_fragment_en: z.string(),
  axes: z.array(AxisSchema).check(
    z.refine(
      (arr) => arr.length === EXPECTED_AXIS_COUNT,
      `Must have exactly ${EXPECTED_AXIS_COUNT} axes`,
    ),
  ),
});

type RawSpec = z.infer<typeof SpecSchema>;
type RawAxis = z.infer<typeof AxisSchema>;
type RawLevelDefinition = z.infer<typeof LevelDefinitionSchema>;

function mapLevelDefinition(raw: RawLevelDefinition): LevelDefinition {
  return {
    level: raw.level, // Already narrowed to Level type by Zod schema
    nameFr: raw.name_fr,
    nameEn: raw.name_en,
    promptFragmentFr: raw.prompt_fragment_fr,
    promptFragmentEn: raw.prompt_fragment_en,
  };
}

function mapAxis(raw: RawAxis, id: AxisId): Axis {
  return {
    id,
    initials: raw.initials,
    nameFr: raw.name_fr,
    nameEn: raw.name_en,
    descriptionFr: raw.description_fr,
    descriptionEn: raw.description_en,
    promptFragmentFr: raw.prompt_fragment_fr,
    promptFragmentEn: raw.prompt_fragment_en,
    levels: raw.levels.map(mapLevelDefinition),
  };
}

function mapSpec(raw: RawSpec): Spec {
  const axisIds = getAxisIds();

  if (raw.axes.length !== axisIds.length) {
    throw new SpecValidationError(
      `Expected ${axisIds.length} axes but got ${raw.axes.length}`,
    );
  }

  const axes: Axis[] = raw.axes.map((rawAxis: RawAxis, index: number) => {
    const axisId = axisIds[index];
    if (!axisId) {
      throw new SpecValidationError(`Missing axis ID at index ${index}`);
    }
    return mapAxis(rawAxis, axisId);
  });

  return {
    descriptionFr: raw.description_fr,
    descriptionEn: raw.description_en,
    promptFragmentFr: raw.prompt_fragment_fr,
    promptFragmentEn: raw.prompt_fragment_en,
    axes,
  };
}

export class YamlSpecAdapter implements SpecReaderPort {
  constructor(private readonly specPath: string = "./spec.yml") {}

  async read(): Promise<Spec> {
    const content = await Deno.readTextFile(this.specPath);
    const raw = ExplicitCast.unknown(parse(content));

    const validated = SpecSchema.parse(raw);

    return mapSpec(validated);
  }
}
