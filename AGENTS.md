# AGENTS.md

> Engineering principles & coding standards for this repository (TypeScript on
> **Deno 2**).\
> **Audience**: all contributors (code, tests, scripts).\
> **Code/docs/logs language**: English (US).

---

## 1) Language & Domain Terms

- **Default**: English (US) everywhere (identifiers, comments, docs, APIs).
- **Exception**: French business terms allowed **only** if listed in
  **GLOSSARY.md**.
- **Mixing rule**: treat accepted French tokens as atomic (`SIRET`, `facture`),
  keep the rest in English (`factureId`, `parseSiret`). If not in glossary → use
  English.

---

## 2) Code Style (Deno-first)

- Use Deno’s built-ins: `deno fmt`, `deno task lint`, (which uses `deno check`
  and `deno lint`), `deno task test` (which uses `deno test`). Configure via
  `deno.json(c)`.
- Prefer the **Deno stdlib** (`@std/*`) and **JSR** packages with versioned
  imports. Avoid unversioned specifiers.
- **Files**: underscores (no dashes), avoid `index.ts`/`index.js`; use `mod.ts`
  for entrypoints.
- **Top-level functions**: use the `function` keyword (arrow only for closures).
- **Private fields**: prefer `#` over `private` (runtime privacy).
- **JSDoc** for exported APIs; each module should have explicit unit tests.
- **Error messages**: sentence case, **no trailing period**, quote string
  values, state the action, active voice.

---

## 3) Naming & Casing

- `camelCase` for functions, methods, fields, locals.
- `PascalCase` for classes, types, interfaces, enums.
- `UPPER_SNAKE_CASE` for top-level constants.

---

## 4) Function Signatures (public API)

- ≤ 2 required positionals; the rest in a typed `options` object (defined just
  above the function).
- Keep options **readonly** when possible; prefer discriminated unions for
  modes.

```ts
export interface CreateOptions {
  readonly from?: string;
  readonly path?: string;
  readonly force?: boolean;
}

export function create(branch: string, options: CreateOptions = {}): void {
  // implementation
}
```

---

## 5) Type Safety

- TS `strict` everywhere. Avoid `any`; prefer `unknown` + narrowing, `never`,
  `readonly`, `satisfies`, discriminated unions.
- **Type assertions**: Never use `as` type assertions directly. Always use
  `ExplicitCast` from `~/core/common/explicit_cast.ts`:
  - `ExplicitCast.unknown(value)` to force considering `any` values (e.g.,
    JSON.parse results) as unknown.
  - `ExplicitCast.from<T>(value).cast()` for type-safe casts. The type parameter
    on `from` clarifies what you think you're casting from, helping catch type
    changes. You can optionally type `cast()` but it's not strictly necessary.
  - `ExplicitCast.from<T>(value).dangerousCast<TResult>()` only when necessary
    (e.g., building objects incrementally)
- Isolate unavoidable casts in tiny helpers with a one-line justification.
- Validate external inputs early; fail fast with clear errors.
- **Error handling**: Prefer returning `Result | ErrorType` (where
  `ErrorType extends Error`) over throwing. If a function throws, make it
  explicit in the name (e.g., `parseMonthOrThrow`). Use `parseMonth` for safe
  parsing that returns `Month | ParsingError`.

---

## 6) Command–Query Separation (CQS)

- A function is either a **command** (mutates state) or a **query** (returns
  data). Not both.
- **Naming**: commands `create/update/delete/assign/rebuildIndex`; queries
  `get/find/list/is/has/count`.
- **Returns**: commands → ack/id/version/`void`; queries → data only.
- **HTTP**: `GET` = queries; `POST/PUT/PATCH/DELETE` = commands. No mutation on
  `GET`.

---

## 7) Modules & Dependencies

- Prefer **JSR** (`jsr:`) & **@std** via `deno.jsonc`'s `"imports"` (works as
  import map). Use versions (`@^1`, `@1.0.9`, etc.).
- **Lint**: enable rules that prevent risky patterns (e.g.
  `no-unversioned-import`, `no-import-prefix`).

---

## 8) Permissions & Security (Deno 2)

- Secure-by-default: no FS/net/env/run access unless granted.
- Define **permission sets** in `deno.jsonc` and opt in with `-P` (or
  `-P <name>`). Avoid `-A` in CI/prod.
- Scope permissions narrowly (paths, hostnames, specific executables). Consider
  enabling permission **audit logs** in CI.

Example permission sets in `deno.jsonc`:

```jsonc
{
  "permissions": {
    "default": {
      "read": ["./spec.yml"],
      "env": ["GIAC_LANG", "TELISME_VALUE"]
    },
    "tests": {
      "read": ["./", "./spec.yml"],
      "env": true
    }
  },
  "tasks": {
    "test": "deno test -P=tests",
    "dev": "deno run -P mod.ts"
  }
}
```

---

## 9) Dev Loop & CI

- Local loop: **fmt → lint → check → test** (tasked in `deno.jsonc`).
- CI must enforce fmt/lint/check/tests.
- Prefer permissioned tasks (`-P`) in dev/test/compile.

---

## 10) Logging & Observability

- **Do not rely on `@std/log`** for production (slated for removal). Prefer
  OpenTelemetry/structured JSON logs collected by the platform. Never log
  secrets/PII.

---

## 11) Testing

- Run tests with `deno task test` (it includes coverage `--coverage=coverage`).
- Tests are based on `@std/assert`. Table-driven tests where useful.
- Keep unit tests fast/deterministic; fake IO; isolate permissions via test
  permission set.

---

## 12) Examples

**CQS naming:**

```ts
// queries
export async function getInvoicesByMonth(
  customerId: string,
  month: string,
): Promise<Invoice[]> {/* ... */}
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  /* ... */
}

// commands
export async function createInvoice(draft: InvoiceDraft): Promise<InvoiceId> {
  /* ... */
}
export async function updateUserPermissions(
  userId: string,
  patch: PermissionsPatch,
): Promise<void> {/* ... */}
```

**Error handling (prefer Result over throw):**

```ts
export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParsingError";
  }
}

export function parseMonth(raw: string): Month | ParsingError {
  // Isolates parsing & validation in one place
  // Returns ParsingError on invalid format
  /* ... */
}

export function parseMonthOrThrow(raw: string): Month {
  const result = parseMonth(raw);
  if (result instanceof ParsingError) {
    throw result;
  }
  return result;
}
```
