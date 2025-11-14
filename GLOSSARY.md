# Glossary of French Business Terms

> French domain terms allowed as exceptions to the English-first rule (AGENTS.md
> §1).\
> These terms are atomic and should be used as-is in code identifiers.

---

## Domain Terms

### **télisme** (noun, masculine)

**English**: Initiative

**Definition**: An axis measuring the agent's degree of initiative toward action
and decision-making. Ranges from passive listening (0) to active decision-making
and planning (10).

**Usage in code**: `telisme` (field name in `Profile`, `AxisId` literal)

**Context**: From the Greek "telos" (τέλος) meaning "end" or "purpose".
Represents the agent's orientation toward goal-directed action.

---

### **confrontation** (noun, feminine)

**English**: Challenge

**Definition**: An axis measuring the agent's willingness to correct and
challenge content, ideas, or reasoning without targeting the person or
prescribing specific actions. Ranges from full acceptance (0) to systematic
critical examination (10).

**Usage in code**: `confrontation` (field name in `Profile`, `AxisId` literal)

**Context**: Refers to intellectual challenge and content critique, not personal
conflict or adversarial behavior.

---

### **densité** (noun, feminine)

**English**: Density

**Definition**: An axis controlling the quantity of information delivered and
its structural organization. Ranges from minimal, loosely structured content (0)
to comprehensive, highly structured information (10).

**Usage in code**: `density` (field name in `Profile`, `AxisId` literal)

**Context**: Independent of other axes—high density does not imply formality,
and low density does not imply simplicity.

---

### **énergie** (noun, feminine)

**English**: Energy

**Definition**: An axis controlling rhythmic intensity, emphasis, and dynamic
quality of communication. Ranges from calm, measured delivery (0) to vibrant,
emphatic expression (10).

**Usage in code**: `energy` (field name in `Profile`, `AxisId` literal)

**Context**: Independent of content challenge—high energy does not imply
confrontation, and low energy does not imply passivity.

---

### **registre** (noun, masculine)

**English**: Register

**Definition**: An axis setting the language level and sociolect used in
communication. Ranges from informal, colloquial expression (0) to formal,
elevated discourse (10).

**Usage in code**: `register` (field name in `Profile`, `AxisId` literal)

**Context**: Linguistic register in sociolinguistic terms—the level of formality
and vocabulary choice appropriate to the communication context.

---

## Usage Guidelines

1. **Identifiers**: Use the French term in code (`telisme`, `confrontation`,
   `density`, `energy`, `register`)
2. **Comments**: May use either French or English term, but prefer English for
   clarity
3. **Documentation**: Always provide both French and English when introducing
   the term
4. **UI/API**: Use English translations in user-facing interfaces unless French
   localization is active

## Rationale

These five terms form the core domain vocabulary of the GIAC (Generative
Interactive Agent Composer) system. They represent distinct theoretical concepts
in agent behavioral composition that lack precise English equivalents
maintaining the same semantic boundaries. Using the original French terms:

- Preserves the conceptual integrity of the domain model
- Avoids translation ambiguities (e.g., "télisme" vs "initiative" vs
  "proactivity")
- Maintains consistency with the source specification (`spec.yml`)
- Provides clear atomic tokens for code readers familiar with the domain

All other code, comments, and documentation must follow the English-first rule
per AGENTS.md §1.
