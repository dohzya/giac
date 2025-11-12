/**
 * Output port: Read a specification from a source.
 */

import type { Spec } from "../../../domain/spec.ts";

export interface SpecReaderPort {
  read(): Promise<Spec>;
}
