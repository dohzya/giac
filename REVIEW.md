# Code Review

**Date**: 2025-11-13 **Reviewer**: Claude Code **Status**: ✅ All tests passing
| ✅ Linting clean | ⚠️ CLAUDE.md compliance issues

---

## Executive Summary

This codebase demonstrates solid engineering practices with clean hexagonal
architecture, excellent test coverage (89.4% branch, 95.2% line), and proper use
of TypeScript strict mode. All tests and linting pass successfully. However,
several areas don't fully align with the CLAUDE.md guidelines, particularly
around English-first documentation, error handling patterns, and missing
glossary.

---

## ✅ Strengths

### 1. Architecture & Design

- **Hexagonal Architecture**: Clean ports & adapters pattern with proper
  separation of concerns
- **Dependency Injection**: Composition root in `mod.ts` properly instantiates
  and wires dependencies
- **Immutable Domain Models**: Consistent use of `readonly` properties
- **CQS Compliance**: Services properly separate commands (mutate) from queries
  (return data)

### 2. Type Safety

- **Strict Mode**: `strict`, `noUncheckedIndexedAccess`,
  `useUnknownInCatchVariables` enabled
- **ExplicitCast Pattern**: Proper use of custom casting utilities instead of
  `as` type assertions
- **Discriminated Unions**: Good use of literal types (`Level`, `AxisId`,
  `Language`)
- **Type Guards**: Functions like `isValidLevel` and `isComplete` provide proper
  type narrowing

### 3. Testing

- **Coverage**: 89.4% branch coverage, 95.2% line coverage
- **Test Organization**: Each domain module has corresponding `.test.ts` files
- **Table-Driven Tests**: Good patterns in `spec.test.ts` and `args.test.ts`
- **74 passing tests**: Comprehensive test suite with no failures

### 4. Deno Best Practices

- **JSR Imports**: All imports properly versioned (`@std/yaml@^1.0`,
  `@std/assert@^1.0`)
- **Permission Sets**: Defined `default` and `tests` permission sets in
  `deno.jsonc`
- **Standard Library**: Using Deno stdlib (@std/yaml, @std/assert)
- **Task Runner**: All common tasks defined (`lint`, `test`, `dev`, `compile`,
  `finalize`)

### 5. Code Quality

- **Naming Conventions**: Consistent camelCase for functions, PascalCase for
  types
- **Pure Functions**: Core logic (e.g., `BuildPromptService`) is pure and
  testable
- **Single Responsibility**: Each module has a clear, focused purpose

---

## 🔴 Critical Issues (CLAUDE.md Violations)

### 1. Missing GLOSSARY.md

**Priority**: High **Location**: Root directory **Guideline**: CLAUDE.md Section
1

**Issue**: The codebase uses French business terms (`telisme`, `confrontation`,
`densité`, `énergie`, `registre`) throughout the domain model, but there is no
`GLOSSARY.md` file documenting these terms as allowed exceptions to the
English-first rule.

**Action Required**:

```markdown
Create GLOSSARY.md with entries like:

# Glossary of French Business Terms

- **télisme**: [definition]
- **confrontation**: [definition]
- **densité**: [definition]
- **énergie**: [definition]
- **registre**: [definition]
```

---

### 2. French UI Messages

**Priority**: High **Location**: `adapters/in/cli/mod.ts:33-36` **Guideline**:
CLAUDE.md Section 1 (English by default everywhere)

**Current**:

```ts
ui.error(`Commande inconnue: ${command}`);
ui.info("Usage: giac [spec|build] [options]");
ui.info("  spec - Affiche la spécification");
ui.info("  build - Génère un prompt (par défaut)");
```

**Should Be**:

```ts
ui.error(`Unknown command: ${command}`);
ui.info("Usage: giac [spec|build] [options]");
ui.info("  spec - Display specification");
ui.info("  build - Generate prompt (default)");
```

**Note**: If multi-language support is required, implement proper i18n with
language selection based on the `lang` parameter already in use.

---

### 3. Error Message Style

**Priority**: Medium **Location**: `adapters/out/yaml/yaml_spec_adapter.ts:87`
**Guideline**: CLAUDE.md Section 2 (Error messages: sentence case, no trailing
period, active voice)

**Current**:

```ts
throw new Error(`Expected ${axisIds.length} axes, got ${raw.axes.length}`);
```

**Should Be**:

```ts
throw new Error(`Expected ${axisIds.length} axes but got ${raw.axes.length}`);
```

**Improvements**:

- More explicit conjunction ("but" instead of comma)
- Already follows: sentence case, no period, active voice ✓

---

### 4. Error Handling Pattern

**Priority**: High **Location**: Throughout codebase **Guideline**: CLAUDE.md
Section 5 (Prefer returning `Result | ErrorType` over throwing)

**Issue**: Functions throw errors instead of returning error types. Per
guidelines, prefer safe parsing that returns error types, with explicit
`OrThrow` variants for throwing behavior.

**Current Pattern**:

```ts
// yaml_spec_adapter.ts:106
async read(): Promise<Spec> {
  // ... throws on validation error
}
```

**Recommended Pattern**:

```ts
export class SpecValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpecValidationError";
  }
}

async read(): Promise<Spec | SpecValidationError> {
  try {
    // validation logic
    return mapSpec(validated);
  } catch (error) {
    return new SpecValidationError(/* ... */);
  }
}

async readOrThrow(): Promise<Spec> {
  const result = await this.read();
  if (result instanceof SpecValidationError) {
    throw result;
  }
  return result;
}
```

**Files Affected**:

- `adapters/out/yaml/yaml_spec_adapter.ts`
- `core/domain/spec.ts` (already partially compliant with `resolveAxis`,
  `resolveLevel` returning `undefined`)

---

### 5. Missing Custom Error Classes

**Priority**: Medium **Location**: Throughout codebase **Guideline**: CLAUDE.md
Section 12 (Examples show custom Error classes)

**Issue**: All errors use generic `Error` instead of domain-specific error
classes.

**Recommended Error Classes**:

```ts
// core/domain/errors.ts
export class SpecValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpecValidationError";
  }
}

export class AxisNotFoundError extends Error {
  constructor(axisId: string) {
    super(`Axis not found: "${axisId}"`);
    this.name = "AxisNotFoundError";
  }
}

export class InvalidLevelError extends Error {
  constructor(value: number | string) {
    super(`Invalid level value: "${value}"`);
    this.name = "InvalidLevelError";
  }
}
```

---

## ⚠️ Medium Priority Issues

### 6. Missing JSDoc on Exported APIs

**Priority**: Medium **Location**: Various files **Guideline**: CLAUDE.md
Section 2 (JSDoc for exported APIs)

**Files with Missing JSDoc**:

- `core/domain/profile.ts:26` - `createProfile`
- `core/domain/profile.ts:48` - `isComplete`
- `core/domain/profile.ts:61` - `getMissingAxes`
- `core/application/services/get_spec_service.ts:12` - `execute`

**Example Fix**:

```ts
/**
 * Create a complete profile from a partial profile, filling missing values with defaults.
 *
 * @param partial - Partial profile with some or all axes defined
 * @param defaults - Default values for missing axes (defaults to 5 for all)
 * @returns Complete profile with all axes defined
 */
export function createProfile(
  partial: PartialProfile,
  defaults: Profile = {
    telisme: 5,
    confrontation: 5,
    density: 5,
    energy: 5,
    register: 5,
  },
): Profile {
  // ...
}
```

---

### 7. Non-null Assertions Bypass Type Safety

**Priority**: Medium **Locations**:

- `adapters/in/cli/args.ts:22, 27-29, 38-39, 50-51`
- `adapters/out/yaml/yaml_spec_adapter.ts:91`

**Issue**: Using `!` non-null assertions bypasses TypeScript's type safety,
which contradicts the strict type safety emphasized in CLAUDE.md.

**Current** (`args.ts:22`):

```ts
while (i < args.length) {
  const arg = args[i]!;
  // ...
}
```

**Better**:

```ts
while (i < args.length) {
  const arg = args[i];
  if (!arg) continue; // Explicit check
  // ...
}
```

**Current** (`yaml_spec_adapter.ts:91`):

```ts
const axes: Axis[] = raw.axes.map((rawAxis: RawAxis, index: number) =>
  mapAxis(rawAxis, axisIds[index]!)
);
```

**Better**:

```ts
const axes: Axis[] = raw.axes.map((rawAxis: RawAxis, index: number) => {
  const axisId = axisIds[index];
  if (!axisId) {
    throw new SpecValidationError(`Missing axis ID at index ${index}`);
  }
  return mapAxis(rawAxis, axisId);
});
```

---

### 8. Zod + ExplicitCast Complexity

**Priority**: Low **Location**: `adapters/out/yaml/yaml_spec_adapter.ts:53-55`

**Issue**: Zod already validates and narrows types, so adding `ExplicitCast`
creates unnecessary ceremony.

**Current**:

```ts
function mapLevelDefinition(raw: RawLevelDefinition): LevelDefinition {
  return {
    level: ExplicitCast.from<number>(raw.level).cast<
      0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    >(),
    // ...
  };
}
```

**Alternative** (let Zod handle the narrowing):

```ts
const LevelDefinitionSchema = z.object({
  level: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
  ]),
  // ...
});

// Now raw.level is already narrowed to Level type
function mapLevelDefinition(raw: RawLevelDefinition): LevelDefinition {
  return {
    level: raw.level, // No cast needed
    nameFr: raw.name_fr,
    nameEn: raw.name_en,
    promptFragmentFr: raw.prompt_fragment_fr,
    promptFragmentEn: raw.prompt_fragment_en,
  };
}
```

---

### 9. Magic Numbers in Validation

**Priority**: Low **Location**: `adapters/out/yaml/yaml_spec_adapter.ts:33, 43`

**Issue**: Hardcoded `11` and `5` without clear source of truth.

**Current**:

```ts
levels: z.array(LevelDefinitionSchema).check(
  z.refine((arr) => arr.length === 11, "Must have exactly 11 levels"),
),
// ...
axes: z.array(AxisSchema).check(
  z.refine((arr) => arr.length === 5, "Must have exactly 5 axes"),
),
```

**Better**:

```ts
// At top of file
const EXPECTED_LEVEL_COUNT = 11; // 0-10 inclusive
const EXPECTED_AXIS_COUNT = 5; // telisme, confrontation, density, energy, register

// In schema
levels: z.array(LevelDefinitionSchema).check(
  z.refine(
    (arr) => arr.length === EXPECTED_LEVEL_COUNT,
    `Must have exactly ${EXPECTED_LEVEL_COUNT} levels`,
  ),
),
axes: z.array(AxisSchema).check(
  z.refine(
    (arr) => arr.length === EXPECTED_AXIS_COUNT,
    `Must have exactly ${EXPECTED_AXIS_COUNT} axes`,
  ),
),
```

**Even Better** (reference domain model):

```ts
import { getAxisIds } from "~/core/domain/spec.ts";

const EXPECTED_AXIS_COUNT = getAxisIds().length;
```

---

### 10. Missing Test Coverage

**Priority**: Medium **Location**: `core/domain/profile.ts` **Guideline**:
CLAUDE.md Section 11 (Each module should have explicit unit tests)

**Issue**: No `profile.test.ts` file exists despite exported functions
(`createProfile`, `isComplete`, `getMissingAxes`).

**Recommended**:

```ts
// core/domain/profile.test.ts
import { assertEquals } from "@std/assert";
import { createProfile, getMissingAxes, isComplete } from "./profile.ts";

Deno.test("createProfile - uses defaults for missing values", () => {
  const profile = createProfile({ telisme: 8 });
  assertEquals(profile.telisme, 8);
  assertEquals(profile.confrontation, 5); // default
});

Deno.test("isComplete - returns true for complete profile", () => {
  assertEquals(
    isComplete({
      telisme: 5,
      confrontation: 5,
      density: 5,
      energy: 5,
      register: 5,
    }),
    true,
  );
});

// ... more tests
```

---

## 📊 Test Results

```
✅ 74 tests passing
❌ 0 tests failing
⏱️  329ms runtime

Coverage:
├─ Branch: 89.4%
└─ Line:   95.2%

Files with 100% coverage:
├─ core/common/explicit_cast.ts
├─ core/domain/axis.ts
├─ core/domain/spec.ts
└─ adapters/in/cli/interactive/validators.ts
```

---

## 🎯 Action Items

### High Priority

- [ ] Create `GLOSSARY.md` with French business terms
- [ ] Convert CLI messages to English or implement i18n
- [ ] Refactor error handling to use `Result | ErrorType` pattern
- [ ] Create custom error classes per domain
- [ ] Add JSDoc to all exported APIs

### Medium Priority

- [ ] Remove non-null assertions in favor of proper narrowing
- [ ] Add tests for `core/domain/profile.ts`
- [ ] Review and fix error message formatting

### Low Priority

- [ ] Simplify Zod + ExplicitCast usage where Zod already narrows
- [ ] Extract magic numbers to named constants
- [ ] Consider adding integration tests for CLI commands

---

## 📁 File-by-File Analysis

### Core Domain (`core/domain/`)

| File       | Lines | Issues                      | Status |
| ---------- | ----- | --------------------------- | ------ |
| axis.ts    | 50    | None                        | ✅     |
| spec.ts    | 94    | None                        | ✅     |
| profile.ts | 70    | Missing JSDoc, missing test | ⚠️     |
| prompt.ts  | 6     | None (type alias only)      | ✅     |

### Application Services (`core/application/services/`)

| File                    | Lines | Issues        | Status |
| ----------------------- | ----- | ------------- | ------ |
| build_prompt_service.ts | 53    | None          | ✅     |
| get_spec_service.ts     | 16    | Missing JSDoc | ⚠️     |

### Adapters (`adapters/`)

| File                          | Lines | Issues                                          | Status |
| ----------------------------- | ----- | ----------------------------------------------- | ------ |
| yaml_spec_adapter.ts          | 115   | Non-null assertion, Zod+Cast complexity, throws | ⚠️     |
| cli/mod.ts                    | 41    | French UI messages                              | ⚠️     |
| cli/args.ts                   | 212   | Multiple non-null assertions                    | ⚠️     |
| cli/interactive/validators.ts | 42    | None                                            | ✅     |

---

## 🏆 Overall Assessment

**Grade**: B+ (85/100)

**Breakdown**:

- Architecture & Design: A (95/100)
- Type Safety: B+ (88/100)
- Testing: A- (90/100)
- Code Quality: B+ (85/100)
- CLAUDE.md Compliance: C+ (75/100)

**Verdict**: This is a well-engineered codebase with solid foundations.
Addressing the CLAUDE.md compliance issues (especially English-first, error
handling patterns, and documentation) would elevate it to A-tier. The clean
architecture and strong test coverage demonstrate good engineering discipline.

---

## 📚 References

- [CLAUDE.md](./CLAUDE.md) - Engineering principles for this repository
- [Deno Manual](https://docs.deno.com) - Deno 2 best practices
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript
  strict mode
