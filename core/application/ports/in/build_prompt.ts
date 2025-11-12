/**
 * Input port: Build a prompt from a spec and profile.
 */

import type { Profile } from "../../../domain/profile.ts";
import type { Prompt } from "../../../domain/prompt.ts";
import type { Spec } from "../../../domain/spec.ts";

export type Language = "fr" | "en";

export interface BuildPromptUseCase {
  execute(spec: Spec, profile: Profile, lang: Language): Prompt;
}
