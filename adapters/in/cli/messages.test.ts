/**
 * Tests for i18n message catalog.
 */

import { assertEquals, assertExists } from "@std/assert";
import { getMessages } from "./messages.ts";

Deno.test("getMessages - returns French messages", () => {
  const messages = getMessages("fr");

  assertExists(messages);
  assertEquals(messages.errorUnknownCommand, "Commande inconnue");
  assertEquals(
    messages.errorInvalidLevelInput,
    "Valeur invalide. Veuillez entrer un nombre (0-10) ou un nom de niveau",
  );
  assertEquals(
    messages.errorGeneratingPrompt,
    "Erreur lors de la génération du prompt",
  );
  assertEquals(messages.errorAxisNotFound, "Axe introuvable");
  assertEquals(
    messages.errorRetrievingSpec,
    "Erreur lors de la récupération de la spec",
  );
  assertEquals(messages.usageHelp, "Usage: giac [spec|build] [options]");
  assertEquals(messages.commandHelpSpec, "spec - Affiche la spécification");
  assertEquals(
    messages.infoInteractiveModeActivated,
    "Certains axes ne sont pas spécifiés. Mode interactif activé.",
  );
});

Deno.test("getMessages - returns English messages", () => {
  const messages = getMessages("en");

  assertExists(messages);
  assertEquals(messages.errorUnknownCommand, "Unknown command");
  assertEquals(
    messages.errorInvalidLevelInput,
    "Invalid value. Please enter a number (0-10) or a level name",
  );
  assertEquals(
    messages.errorGeneratingPrompt,
    "Error generating prompt",
  );
  assertEquals(messages.errorAxisNotFound, "Axis not found");
  assertEquals(
    messages.errorRetrievingSpec,
    "Error retrieving spec",
  );
  assertEquals(messages.usageHelp, "Usage: giac [spec|build] [options]");
  assertEquals(messages.commandHelpSpec, "spec - Display specification");
  assertEquals(
    messages.infoInteractiveModeActivated,
    "Some axes are not specified. Interactive mode activated.",
  );
});

Deno.test("getMessages - French has all required fields", () => {
  const messages = getMessages("fr");

  // Errors
  assertExists(messages.errorUnknownCommand);
  assertExists(messages.errorInvalidLevelInput);
  assertExists(messages.errorGeneratingPrompt);
  assertExists(messages.errorAxisNotFound);
  assertExists(messages.errorRetrievingSpec);

  // Help & Usage
  assertExists(messages.usageHelp);
  assertExists(messages.commandHelpSpec);
  assertExists(messages.commandHelpBuild);
  assertExists(messages.helpAxisIdentifier);

  // Prompts
  assertExists(messages.promptAvailableLevels);
  assertExists(messages.promptChooseLevel);

  // Info messages
  assertExists(messages.infoInteractiveModeActivated);

  // Labels
  assertExists(messages.labelInitials);
  assertExists(messages.labelDescription);
  assertExists(messages.labelLevels);
  assertExists(messages.labelProfile);

  // Titles
  assertExists(messages.titleSpecification);
  assertExists(messages.titleSelectedProfile);
  assertExists(messages.titleGeneratedPrompt);
});

Deno.test("getMessages - English has all required fields", () => {
  const messages = getMessages("en");

  // Errors
  assertExists(messages.errorUnknownCommand);
  assertExists(messages.errorInvalidLevelInput);
  assertExists(messages.errorGeneratingPrompt);
  assertExists(messages.errorAxisNotFound);
  assertExists(messages.errorRetrievingSpec);

  // Help & Usage
  assertExists(messages.usageHelp);
  assertExists(messages.commandHelpSpec);
  assertExists(messages.commandHelpBuild);
  assertExists(messages.helpAxisIdentifier);

  // Prompts
  assertExists(messages.promptAvailableLevels);
  assertExists(messages.promptChooseLevel);

  // Info messages
  assertExists(messages.infoInteractiveModeActivated);

  // Labels
  assertExists(messages.labelInitials);
  assertExists(messages.labelDescription);
  assertExists(messages.labelLevels);
  assertExists(messages.labelProfile);

  // Titles
  assertExists(messages.titleSpecification);
  assertExists(messages.titleSelectedProfile);
  assertExists(messages.titleGeneratedPrompt);
});
