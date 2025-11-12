/**
 * UI helpers for console output (formatting, colors, errors).
 */

export function info(message: string): void {
  console.log(message);
}

export function error(message: string): void {
  console.error(`\x1b[31m${message}\x1b[0m`);
}

export function success(message: string): void {
  console.log(`\x1b[32m${message}\x1b[0m`);
}

export function warning(message: string): void {
  console.log(`\x1b[33m${message}\x1b[0m`);
}

export function title(message: string): void {
  console.log(`\x1b[1m${message}\x1b[0m`);
}

export function prompt(message: string): void {
  console.log(`\x1b[36m${message}\x1b[0m`);
}

export function dim(message: string): void {
  console.log(`\x1b[2m${message}\x1b[0m`);
}
