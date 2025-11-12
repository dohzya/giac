/**
 * CLI adapter entry point.
 * Orchestrates the CLI commands.
 */

import type { GetSpecUseCase } from "~/core/application/ports/in/get_spec.ts";
import type { BuildPromptUseCase } from "~/core/application/ports/in/build_prompt.ts";
import { executeGetSpec } from "./commands/get_spec.ts";
import { executeBuildPrompt } from "./commands/build_prompt.ts";
import * as ui from "./ui.ts";

export interface CliAdapter {
  run(args: string[]): Promise<void>;
}

export class CliAdapterImpl implements CliAdapter {
  constructor(
    private readonly getSpec: GetSpecUseCase,
    private readonly buildPrompt: BuildPromptUseCase,
  ) {}

  async run(args: string[]): Promise<void> {
    const command = args[0];

    if (command === "spec" || command === "show") {
      await executeGetSpec(this.getSpec, args.slice(1));
    } else if (
      command === "build" || command === "prompt" || command === undefined
    ) {
      // Default command is to build prompt
      await executeBuildPrompt(this.getSpec, this.buildPrompt, args.slice(1));
    } else {
      ui.error(`Commande inconnue: ${command}`);
      ui.info("Usage: giac [spec|build] [options]");
      ui.info("  spec - Affiche la spécification");
      ui.info("  build - Génère un prompt (par défaut)");
      Deno.exit(1);
    }
  }
}
