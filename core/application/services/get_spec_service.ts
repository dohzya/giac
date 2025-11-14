/**
 * Service implementing GetSpecUseCase.
 */

import type { GetSpecUseCase } from "../ports/in/get_spec.ts";
import type { SpecReaderPort } from "../ports/out/spec_reader_port.ts";
import type { Spec } from "~/core/domain/spec.ts";

export class GetSpecService implements GetSpecUseCase {
  constructor(private readonly specReader: SpecReaderPort) {}

  /**
   * Retrieve the complete GIAC specification.
   *
   * Reads the specification from the configured source (typically spec.yml)
   * containing all axis definitions, level descriptions, and prompt fragments.
   *
   * @returns Promise resolving to the complete Spec with all axes and metadata
   * @throws SpecValidationError if the specification file cannot be parsed or validated
   *
   * @example
   * ```typescript
   * const spec = await getSpecService.execute();
   * console.log(spec.axes.length); // 5 (télisme, confrontation, densité, énergie, registre)
   * ```
   */
  async execute(): Promise<Spec> {
    return await this.specReader.read();
  }
}
