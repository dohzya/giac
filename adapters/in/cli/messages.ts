/**
 * i18n message catalog for CLI user interface.
 *
 * Provides bilingual messages (French/English) for all user-facing strings.
 * Uses flat structure with descriptive keys for easy lookup.
 */

import type { Language } from "~/core/application/ports/in/build_prompt.ts";

/**
 * Message catalog interface defining all UI strings.
 */
export interface Messages {
  // Errors
  readonly errorUnknownCommand: string;
  readonly errorInvalidLevelInput: string;
  readonly errorGeneratingPrompt: string;
  readonly errorAxisNotFound: string;
  readonly errorRetrievingSpec: string;

  // Help & Usage
  readonly usageHelp: string;
  readonly commandHelpSpec: string;
  readonly commandHelpBuild: string;
  readonly helpAxisIdentifier: string;

  // Prompts
  readonly promptAvailableLevels: string;
  readonly promptChooseLevel: string;

  // Info messages
  readonly infoInteractiveModeActivated: string;

  // Labels
  readonly labelInitials: string;
  readonly labelDescription: string;
  readonly labelLevels: string;
  readonly labelProfile: string;

  // Titles
  readonly titleSpecification: string;
  readonly titleSelectedProfile: string;
  readonly titleGeneratedPrompt: string;
}

/**
 * Get localized messages for the specified language.
 *
 * @param lang - Target language ("fr" or "en")
 * @returns Message catalog with all strings in the target language
 */
export function getMessages(lang: Language): Messages {
  if (lang === "fr") {
    return {
      // Errors
      errorUnknownCommand: "Commande inconnue",
      errorInvalidLevelInput:
        "Valeur invalide. Veuillez entrer un nombre (0-10) ou un nom de niveau",
      errorGeneratingPrompt: "Erreur lors de la génération du prompt",
      errorAxisNotFound: "Axe introuvable",
      errorRetrievingSpec: "Erreur lors de la récupération de la spec",

      // Help & Usage
      usageHelp: "Usage: giac [spec|build] [options]",
      commandHelpSpec: "spec - Affiche la spécification",
      commandHelpBuild: "build - Génère un prompt (par défaut)",
      helpAxisIdentifier:
        "Utilisez un ID, une initiale, ou un nom d'axe (FR ou EN)",

      // Prompts
      promptAvailableLevels: "\nNiveaux disponibles:",
      promptChooseLevel: "\nChoisissez un niveau pour",

      // Info messages
      infoInteractiveModeActivated:
        "Certains axes ne sont pas spécifiés. Mode interactif activé.",

      // Labels
      labelInitials: "Initiales:",
      labelDescription: "Description:",
      labelLevels: "Niveaux:",
      labelProfile: "Profil:",

      // Titles
      titleSpecification: "Spécification GIAC",
      titleSelectedProfile: "\n=== Profil sélectionné ===",
      titleGeneratedPrompt: "\n=== Prompt généré ===",
    };
  }

  // Default to English
  return {
    // Errors
    errorUnknownCommand: "Unknown command",
    errorInvalidLevelInput:
      "Invalid value. Please enter a number (0-10) or a level name",
    errorGeneratingPrompt: "Error generating prompt",
    errorAxisNotFound: "Axis not found",
    errorRetrievingSpec: "Error retrieving spec",

    // Help & Usage
    usageHelp: "Usage: giac [spec|build] [options]",
    commandHelpSpec: "spec - Display specification",
    commandHelpBuild: "build - Generate prompt (default)",
    helpAxisIdentifier: "Use an ID, an initial, or an axis name (FR or EN)",

    // Prompts
    promptAvailableLevels: "\nAvailable levels:",
    promptChooseLevel: "\nChoose a level for",

    // Info messages
    infoInteractiveModeActivated:
      "Some axes are not specified. Interactive mode activated.",

    // Labels
    labelInitials: "Initials:",
    labelDescription: "Description:",
    labelLevels: "Levels:",
    labelProfile: "Profile:",

    // Titles
    titleSpecification: "GIAC Specification",
    titleSelectedProfile: "\n=== Selected Profile ===",
    titleGeneratedPrompt: "\n=== Generated Prompt ===",
  };
}
