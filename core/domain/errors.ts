/**
 * Custom error classes for the GIAC domain.
 *
 * These error types provide semantic clarity and enable precise error handling
 * throughout the application. Per AGENTS.md §5, prefer returning these error
 * types over throwing, with explicit `OrThrow` variants when needed.
 */

/**
 * Error thrown when specification validation fails.
 *
 * Used when YAML spec file cannot be parsed or does not match expected schema.
 */
export class SpecValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpecValidationError";
  }
}

/**
 * Error thrown when an axis identifier cannot be resolved.
 *
 * Used when user provides an invalid axis ID, initial, or name.
 */
export class AxisNotFoundError extends Error {
  constructor(axisId: string) {
    super(`Axis not found: "${axisId}"`);
    this.name = "AxisNotFoundError";
  }
}

/**
 * Error thrown when a level value is invalid.
 *
 * Used when a level is outside the valid range (0-10) or cannot be parsed.
 */
export class InvalidLevelError extends Error {
  constructor(value: number | string) {
    super(`Invalid level value: "${value}"`);
    this.name = "InvalidLevelError";
  }
}

/**
 * Error thrown when parsing user input fails.
 *
 * Generic parsing error for CLI arguments, interactive input, etc.
 */
export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParsingError";
  }
}
