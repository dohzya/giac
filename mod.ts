/**
 * Composition root: instantiates adapters and services, injects dependencies, launches CLI.
 */

import { YamlSpecAdapter } from "./adapters/out/yaml/yaml_spec_adapter.ts";
import { GetSpecService } from "./core/application/services/get_spec_service.ts";
import { BuildPromptService } from "./core/application/services/build_prompt_service.ts";
import { CliAdapterImpl } from "./adapters/in/cli/mod.ts";

async function main() {
  const yamlAdapter = new YamlSpecAdapter("./spec.yml");

  const getSpecService = new GetSpecService(yamlAdapter);
  const buildPromptService = new BuildPromptService();

  const cliAdapter = new CliAdapterImpl(getSpecService, buildPromptService);

  const args = Deno.args;
  await cliAdapter.run(args);
}

if (import.meta.main) {
  await main();
}
