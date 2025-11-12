/**
 * YAML adapter implementing SpecReaderPort.
 * Loads and validates the spec from spec.yml using Zod.
 */

import { parse } from "@std/yaml";
import * as z from "zod/mini";
import type { SpecReaderPort } from "~/core/application/ports/out/spec_reader_port.ts";
import type { Axis, AxisId, LevelDefinition, Spec } from "~/core/domain/mod.ts";
import { ExplicitCast } from "~/core/common/explicit_cast.ts";

const LevelDefinitionSchema = z.object({
  level: z.number().check(
    z.gte(0),
    z.lte(10),
    z.refine((val) => Number.isInteger(val), "Must be an integer"),
  ),
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
    z.refine((arr) => arr.length === 11, "Must have exactly 11 levels"),
  ), // Must have exactly 11 levels (0-10)
});

const SpecSchema = z.object({
  description_fr: z.string(),
  description_en: z.string(),
  prompt_fragment_fr: z.string(),
  prompt_fragment_en: z.string(),
  axes: z.array(AxisSchema).check(
    z.refine((arr) => arr.length === 5, "Must have exactly 5 axes"),
  ), // Must have exactly 5 axes
});

type RawSpec = z.infer<typeof SpecSchema>;
type RawAxis = z.infer<typeof AxisSchema>;
type RawLevelDefinition = z.infer<typeof LevelDefinitionSchema>;

function mapLevelDefinition(raw: RawLevelDefinition): LevelDefinition {
  return {
    level: ExplicitCast.from<number>(raw.level).cast<
      0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    >(),
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
  const axisIds: AxisId[] = [
    "telisme",
    "confrontation",
    "density",
    "energy",
    "register",
  ];

  if (raw.axes.length !== axisIds.length) {
    throw new Error(`Expected ${axisIds.length} axes, got ${raw.axes.length}`);
  }

  const axes: Axis[] = raw.axes.map((rawAxis: RawAxis, index: number) =>
    mapAxis(rawAxis, axisIds[index]!)
  );

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
