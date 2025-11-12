/**
 * Input port: Get the complete specification.
 */

import type { Spec } from "../../../domain/spec.ts";

export interface GetSpecUseCase {
  execute(): Promise<Spec>;
}
