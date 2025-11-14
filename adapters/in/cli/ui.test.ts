/**
 * Tests for UI helper functions.
 */

import { assertEquals } from "@std/assert";
import * as ui from "./ui.ts";

Deno.test("ui.info - outputs to console", () => {
  const originalLog = console.log;
  let captured = "";
  console.log = (msg: string) => {
    captured = msg;
  };

  try {
    ui.info("Test message");
    assertEquals(captured, "Test message");
  } finally {
    console.log = originalLog;
  }
});

Deno.test("ui.error - outputs with red color", () => {
  const originalError = console.error;
  let captured = "";
  console.error = (msg: string) => {
    captured = msg;
  };

  try {
    ui.error("Error message");
    assertEquals(captured, "\x1b[31mError message\x1b[0m");
  } finally {
    console.error = originalError;
  }
});

Deno.test("ui.success - outputs with green color", () => {
  const originalLog = console.log;
  let captured = "";
  console.log = (msg: string) => {
    captured = msg;
  };

  try {
    ui.success("Success message");
    assertEquals(captured, "\x1b[32mSuccess message\x1b[0m");
  } finally {
    console.log = originalLog;
  }
});

Deno.test("ui.warning - outputs with yellow color", () => {
  const originalLog = console.log;
  let captured = "";
  console.log = (msg: string) => {
    captured = msg;
  };

  try {
    ui.warning("Warning message");
    assertEquals(captured, "\x1b[33mWarning message\x1b[0m");
  } finally {
    console.log = originalLog;
  }
});

Deno.test("ui.title - outputs with bold formatting", () => {
  const originalLog = console.log;
  let captured = "";
  console.log = (msg: string) => {
    captured = msg;
  };

  try {
    ui.title("Title message");
    assertEquals(captured, "\x1b[1mTitle message\x1b[0m");
  } finally {
    console.log = originalLog;
  }
});

Deno.test("ui.prompt - outputs with cyan color", () => {
  const originalLog = console.log;
  let captured = "";
  console.log = (msg: string) => {
    captured = msg;
  };

  try {
    ui.prompt("Prompt message");
    assertEquals(captured, "\x1b[36mPrompt message\x1b[0m");
  } finally {
    console.log = originalLog;
  }
});

Deno.test("ui.dim - outputs with dim formatting", () => {
  const originalLog = console.log;
  let captured = "";
  console.log = (msg: string) => {
    captured = msg;
  };

  try {
    ui.dim("Dim message");
    assertEquals(captured, "\x1b[2mDim message\x1b[0m");
  } finally {
    console.log = originalLog;
  }
});
