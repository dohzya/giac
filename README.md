# GIAC (Generative Interactive Agent Composer)

Specification–driven prompt builder for composing an AI agent "style" across five independent behavioral axes. GIAC loads a structured YAML spec (`spec.yml`), lets you define / interactively fill a profile (levels 0–10 per axis), and generates a reproducible multi-fragment prompt.

## Table of Contents

1. Overview
2. Features
3. Domain Model (Axes & Levels)
4. Installation & Requirements
5. Quick Start
6. CLI Usage
7. Internationalization (i18n)
8. Glossary (French Domain Terms)
9. Error Handling & Validation
10. Architecture (Hexagonal)
11. Testing & Quality Gates
12. Development Workflow
13. Contributing

## 1. Overview

GIAC composes an agent behavioral profile from five independent axes:

| Axis (FR) | Axis (EN)     | Purpose (Summary)                                   |
|-----------|---------------|------------------------------------------------------|
| Télisme   | Initiative    | Degree of initiative toward action/decision         |
| Confrontation | Challenge | Level of constructive content critique              |
| Densité   | Density       | Information amount & structural compression         |
| Énergie   | Energy        | Rhythmic intensity & emphasis                       |
| Registre  | Register      | Language level & sociolect                          |

Each axis has 11 discrete levels (0–10) defined in `spec.yml` with French & English names plus prompt fragments. The final prompt is built by selecting one level per axis and applying arbitration rules (higher-priority axes override lower ones when fragments clash).

## 2. Features

- YAML driven specification (`spec.yml`)
- Independent, strictly typed domain model (TypeScript + Deno 2)
- Profile creation: flags, environment variables, or interactive fill-in
- Bilingual output (French / English) via flat i18n catalog
- Hexagonal architecture (ports/adapters/services)
- Deterministic prompt synthesis
- Strict type safety (no `any`, custom casting utility)
- High test coverage (unit + integration)

## 3. Domain Model (Axes & Levels)

Each axis contains 11 `LevelDefinition` entries:

```ts
interface LevelDefinition {
  readonly level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  readonly nameFr: string;
  readonly nameEn: string;
  readonly promptFragmentFr: string;
  readonly promptFragmentEn: string;
}
```

The specification object (`Spec`) aggregates all axes plus global description and introductory prompt fragments.

## 4. Installation & Requirements

Prerequisites:
- Deno 2.x (https://docs.deno.com)

Clone the repository, then run:

```fish
deno task lint    # syntax + style
deno task test    # run unit & integration tests
deno task dev     # run default dev entry (build prompt)
```

The code uses permission sets (see `deno.jsonc`). Avoid running with `-A`; use tasks.

## 5. Quick Start

Display the specification:

```fish
deno run -P mod.ts spec
```

Generate a prompt with explicit axis levels:

```fish
deno run -P mod.ts build \
  --telisme=7 --confrontation=4 --density=6 --energy=5 --register=3
```

Omit axes to trigger interactive completion:

```fish
deno run -P mod.ts build --telisme=8 --density=5
```

Set language (English):

```fish
deno run -P mod.ts build --lang=en --telisme=5 --confrontation=5 --density=5 --energy=5 --register=5
```

## 6. CLI Usage

Primary commands:

| Command        | Aliases      | Description                     |
|----------------|--------------|---------------------------------|
| `spec`         | `show`       | Print full or per-axis spec     |
| `build`        | `prompt`     | Generate prompt from a profile  |

Axis level inputs (precedence):
1. CLI flags: `--telisme=7`, short forms: `-t 7`
2. Axis name / ID / initials / localized level name
3. Environment variables: `GIAC_TELISME=7` etc.

Flags:

| Flag            | Description                           |
|-----------------|---------------------------------------|
| `--lang=<fr|en>`| Language of output                    |
| `--axis=<id>`   | Filter spec to a single axis          |
| `--telisme=...` (etc.) | Set axis level (0–10 or name)  |

Exit codes: `0` success; `1` invalid command/input.

## 7. Internationalization (i18n)

Flat message catalog in `adapters/in/cli/messages.ts`:

```ts
const msg = getMessages(lang);
ui.error(`${msg.errorUnknownCommand}: ${command}`);
```

All user-visible strings have French & English variants. Domain terms appear in French inside internal identifiers; public output matches selected language.

## 8. Glossary (French Domain Terms)

See `GLOSSARY.md` for canonical definitions. Terms are atomic in code (e.g. `telisme`) to preserve domain semantics.

## 9. Error Handling & Validation

- Specification validation uses Zod (literal unions for levels) with custom error classes (`SpecValidationError`, etc.).
- Non-null assertions removed; explicit checks ensure safety with `noUncheckedIndexedAccess`.
- Future expansion may introduce result-returning patterns rather than throws.

## 10. Architecture

Hexagonal (Ports & Adapters):

| Layer         | Responsibility                                     |
|---------------|-----------------------------------------------------|
| Domain        | Pure models (`axis`, `spec`, `profile`)             |
| Application   | Use cases / services (`BuildPromptService`, etc.)   |
| Adapters (In) | CLI parsing, interactive flows                      |
| Adapters (Out)| YAML spec reader                                    |

Composition root: `mod.ts` wires services + adapters.

## 11. Testing & Quality Gates

- Unit tests for domain & services
- Integration tests for CLI commands
- Coverage output in `coverage/` (HTML + lcov)
- Lint + type check via `deno task lint`

## 12. Development Workflow

1. Edit code
2. `deno fmt`
3. `deno task lint`
4. `deno task test`
5. Commit with conventional message (`feat:`, `fix:`, etc.)

Permissions: tasks apply predefined sets; extend `deno.jsonc` instead of using `-A`.

## 13. Contributing

1. Open an issue describing the change
2. Keep French domain vocabulary limited to glossary terms; everything else in English
3. Add/adjust tests for all public changes
4. Avoid introducing non-null assertions or unsafe casts
5. Maintain or improve coverage

## License

No license file provided. Add one (e.g., MIT) if external distribution is intended.

## Acknowledgements

Built with Deno 2, Zod, and a strict TypeScript setup. Inspired by structured prompt engineering methodologies.

---

For engineering standards see `AGENTS.md`.
