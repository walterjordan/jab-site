## Gemini Prompt Output Rule (Project-Wide)

**Mandatory Behavior**
- Any time a Gemini prompt is requested or implied, output **one single line only**.
- **No newline characters** under any circumstance.
- **No formatting** that introduces breaks (no bullets, numbering, paragraphs, headings, code fences).
- Output **plain text only**.

**Structure (Inline Only)**
- If structure is required, use inline delimiters on the same line, e.g.: `Context: ... | Objectives: ... | Requirements: ... | Deliverables: ...`.

**Defaulting Rule**
- If Gemini is mentioned, **default to one-liner** even if not explicitly requested.
- If the user says "one-liner," comply exactly.

**Output Discipline**
- Do not append explanations or commentary.
- Return the prompt **only** unless the user explicitly asks otherwise.

