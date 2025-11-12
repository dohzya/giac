/**
 * Service implementing GetSpecUseCase.
 */

import type { GetSpecUseCase } from "../ports/in/get_spec.ts";
import type { SpecReaderPort } from "../ports/out/spec_reader_port.ts";
import type { Spec } from "~/core/domain/spec.ts";

export class GetSpecService implements GetSpecUseCase {
  constructor(private readonly specReader: SpecReaderPort) {}

  async execute(): Promise<Spec> {
    return await this.specReader.read();
  }
}
