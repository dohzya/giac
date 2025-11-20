/**
 * YAML adapter implementing SpecReaderPort.
 * Loads and validates the spec from spec.yml using Zod.
 */

import { parse } from "@std/yaml";
import * as z from "@zod/zod/mini";
import type { SpecReaderPort } from "~/core/application/ports/out/spec_reader_port.ts";
import type { Axis, AxisId, LevelDefinition, Spec } from "~/core/domain/mod.ts";
import { axisId } from "~/core/domain/axis.ts";
import { SpecValidationError } from "~/core/domain/errors.ts";
import { ExplicitCast } from "~/core/common/explicit_cast.ts";

// No fixed counts: spec drives axes and levels. Only enforce unique priorities.

const LevelDefinitionSchema = z.object({
  level: z.int().check(z.nonnegative()),
  name_fr: z.string(),
  name_en: z.string(),
  description_fr: z.optional(z.string()),
  description_en: z.optional(z.string()),
});

const AxisSchema = z.object({
  priority: z.int().check(z.nonnegative()),
  initials: z.array(z.string()),
  name_fr: z.string(),
  name_en: z.string(),
  description_fr: z.string(),
  description_en: z.string(),
  levels: z.array(LevelDefinitionSchema),
});

const SpecSchema = z.object({
  description_fr: z.string(),
  description_en: z.string(),
  prompt_fragment_fr: z.string(),
  prompt_fragment_en: z.string(),
  axes: z.record(z.string(), AxisSchema),
});

type RawSpec = z.infer<typeof SpecSchema>;
type RawAxis = z.infer<typeof AxisSchema>;
type RawLevelDefinition = z.infer<typeof LevelDefinitionSchema>;

function mapLevelDefinition(raw: RawLevelDefinition): LevelDefinition {
  return {
    level: raw.level, // Already narrowed to Level type by Zod schema
    nameFr: raw.name_fr,
    nameEn: raw.name_en,
    descriptionFr: raw.description_fr,
    descriptionEn: raw.description_en,
  };
}

function mapAxis(id: string, raw: RawAxis): Axis {
  return {
    id: axisId(id),
    priority: raw.priority,
    initials: raw.initials,
    nameFr: raw.name_fr,
    nameEn: raw.name_en,
    descriptionFr: raw.description_fr,
    descriptionEn: raw.description_en,
    levels: raw.levels.map(mapLevelDefinition),
  };
}

function mapSpec(raw: RawSpec): Spec {
  const axes: Record<AxisId, Axis> = {};
  const priorities = new Set<number>();
  for (const [key, rawAxis] of Object.entries(raw.axes)) {
    if (priorities.has(rawAxis.priority)) {
      throw new SpecValidationError(
        `Duplicate axis priority: ${rawAxis.priority}`,
      );
    }
    priorities.add(rawAxis.priority);
    const axis = mapAxis(key, rawAxis);
    axes[axis.id] = axis;
  }
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
