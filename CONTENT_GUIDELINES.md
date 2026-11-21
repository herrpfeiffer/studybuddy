# Content Guidelines for Weekly Learning Studio

## Purpose

These guidelines ensure every lesson is **crystal clear to a 7th grader** who may have forgotten first principles and can't recall how their teacher explained concepts in class. All content must be self-contained, practice-oriented, and compliant with strict No-AI policies.

## Core Principles

### 1. Define All Notation & Shorthand

**Rule**: Never assume a student remembers notation. Define it directly in the prompt.

**❌ Bad**:
```
List all possible outcomes (e.g., H1, H2, ...)
```

**✅ Good**:
```
Write each outcome as coin + die. 
For example, H1 means Heads and a 1, T4 means Tails and a 4. 
List all of them.
```

### 2. Add First-Principles Explainers

**Rule**: For each complex concept, add an `explainer` field with:
- A short first-principles reminder (what the concept means)
- A small worked example using **different numbers** than the question
- The example must NEVER give away the question's answer

**Example Structure**:
```json
{
  "prompt": "You roll a die twice...",
  "explainer": "WHAT IT MEANS: Independent events are when the first outcome doesn't change the second outcome. The die doesn't 'remember' the first roll!\n\nWHEN TO MULTIPLY: For independent events, multiply the probabilities.\n\nEXAMPLE: What's the probability of flipping Heads twice?\n- P(first Heads) = 1/2\n- P(second Heads) = 1/2\n- P(both Heads) = 1/2 × 1/2 = 1/4\n\nNow try the die problem below using the same method!",
  "parts": [...]
}
```

### 3. Use Plain Language

**Rules**:
- Short sentences (under 20 words when possible)
- No unexplained jargon
- Active voice ("You multiply..." not "Probabilities are multiplied...")
- Concrete examples before abstract concepts

**Vocabulary Bank** (always explain these):
- Sample space → "all possible outcomes"
- Independent events → "when the first doesn't change the second"
- Dependent events → "when the first changes what's left for the second"
- Without replacement → "you don't put it back"
- At least one → "one or more" + the trick of using 1 - P(none)

### 4. Hints Guide, Never Reveal

**❌ Bad Hint**:
```
"The answer is 3/11"
```

**✅ Good Hint**:
```
"One raw egg is gone, so 4 - 1 = 3 raw. Total is 12 - 1 = 11."
```

Hints should:
- Point to the METHOD, not the answer
- Break the problem into smaller steps
- Remind of first principles without solving

### 5. Accept Equivalent Formats & Make Formats Visible

**Rule**: Validation must accept all mathematically equivalent answers, AND the expected format must be visible up front.

**For probabilities**:
- Fractions: `1/4`, `3/12` (any equivalent fraction)
- Decimals: `0.25`
- Percents: `25%`

**For lists**:
- Any order
- With or without spaces
- Common separators (commas, newlines, spaces)

**CRITICAL: Expected Format Must Be Visible**

Every input must show its expected format through:
- **Labeled fields** for multi-value questions
- **Placeholders** showing example format
- **Question text** explicitly stating format

❌ **Bad** (hidden format):
```json
{
  "question": "How many raw eggs are left? How many total eggs are left?",
  "type": "text",
  "hint": "raw left = 4 - 1 = ? Total left = 12 - 1 = ?"
}
```
Problem: Student must guess "3, 11" or "3 raw, 11 total" or "raw left = 3, total left = 11"

✅ **Good** (visible format via labeled fields):
```json
{
  "question": "Fill in the blanks:",
  "type": "multi-field",
  "fields": [
    {"fieldId": "raw-left", "label": "Raw eggs left", "correctAnswer": 3},
    {"fieldId": "total-left", "label": "Total eggs left", "correctAnswer": 11}
  ]
}
```
Now the student sees exactly what to enter where.

**Hints Must Match Input Format**

If you use multi-field inputs, hints should guide the calculation without specifying a text format that doesn't match the UI.

❌ **Bad** (hint shows text format, but UI has separate fields):
```
"hint": "Write it as: 3 raw, 11 total"
```

✅ **Good** (hint guides calculation for fields):
```
"hint": "You took out one raw egg. So: raw left = 4 - 1 = ? Total left = 12 - 1 = ?"
```

### 6. Academic Integrity (No-AI Policy)

**CRITICAL RULE**: This is a **practice and study aid ONLY**. Content must:

✅ **Allowed**:
- Concept review and practice
- Worked examples with different numbers
- Hints that guide thinking
- Enrichment challenges

❌ **Forbidden**:
- Essay prompts that could be submitted
- Homework answer keys
- Complete solutions students could copy
- Anything framed as "turn this in"

**Language reminders**:
- "Practice converting..." not "Convert these for homework"
- "Review..." not "Complete this assignment"
- "Explain in your own words" (keywords check, not graded)

### 7. Content Structure Checklist

For each **problem-based station**:
- [ ] Complex concepts have an `explainer` field
- [ ] Prompts define all notation inline
- [ ] Examples use different numbers than the question
- [ ] Hints guide without revealing
- [ ] Validation accepts equivalent formats
- [ ] Enrichment suggests optional extension

For each **reflection station**:
- [ ] Prompts use plain, concrete language
- [ ] Optional explainers for complex vocabulary
- [ ] Minimum length ensures thoughtful response
- [ ] Keywords check for understanding (not grading)

## File Organization

### Lesson JSON Schema

```json
{
  "weekId": "week-XX",
  "title": "Week X: Clear Topic Names",
  "dateRange": "Week of [Month Day]",
  "stations": [
    {
      "id": "math",
      "problems": [
        {
          "id": "math-1",
          "tier": 1,
          "prompt": "Clear, self-contained problem statement",
          "explainer": "Optional: first-principles reminder + worked example",
          "parts": [
            {
              "partId": "part-1",
              "question": "What is... (defines all notation)",
              "type": "text",
              "validation": {
                "keywords": ["accept", "equivalent", "formats"],
                "minLength": 10
              },
              "hint": "Guides without revealing",
              "correctAnswer": "For reference only"
            },
            {
              "partId": "part-2",
              "question": "Fill in the values:",
              "type": "multi-field",
              "fields": [
                {
                  "fieldId": "value1",
                  "label": "First value",
                  "correctAnswer": 3,
                  "placeholder": "number"
                },
                {
                  "fieldId": "value2",
                  "label": "Second value",
                  "correctAnswer": 11,
                  "placeholder": "number"
                }
              ],
              "hint": "Guides calculation for each field"
            },
            {
              "partId": "part-3",
              "question": "Explain your reasoning:",
              "type": "explanation",
              "validation": {
                "keywords": ["key", "concept", "words"],
                "minLength": 20
              },
              "modelAnswer": "Shows good explanation after submit",
              "hint": "What key idea should you mention?"
            }
          ],
          "enrichment": "Optional challenge"
        }
      ]
    }
  ]
}
```

### Answer Type Guide

**When to use each type**:

1. **`type: "numeric"`** - Single number answer
   - Simple calculation with one result
   - Example: "What is 2 + 2?"

2. **`type: "text"`** - Written explanation or list
   - Lists where order doesn't matter
   - Explanations checked by keywords only
   - Example: "List all outcomes: H1, H2, H3..."

3. **`type: "multi-field"`** - Multiple labeled numeric/text values
   - **Use this when asking for 2+ distinct values**
   - Each field gets its own label and validation
   - Per-field feedback shows which are right/wrong
   - Example: "Raw eggs left: [ ] Total eggs left: [ ]"

4. **`type: "explanation"`** - Written reasoning checked leniently
   - Checked for key concepts, not exact wording
   - Shows model answer after correct attempt
   - Example: "Explain the student's mistake"

5. **`type: "multiple-choice"`** - Pick one option
   - Fixed set of choices
   - Example: "Who is correct? A/B/Both/Neither"

## Anonymization

**All content must remain anonymous**:
- ❌ Student names, parent names, teacher names
- ❌ School names or identifiers
- ❌ Specific dates with context that identifies individuals
- ✅ Generic references: "Student A", "the student", "middle school"

## Testing New Content

Before adding a new week:
1. Read it aloud — does it sound like you're talking to a 7th grader?
2. Check: could someone with no class context understand this?
3. Verify: do examples use different numbers than questions?
4. Test: do equivalent answers validate correctly?
5. Scan: are all complex terms defined inline?

## Revision Checklist

When editing existing lessons:
- [ ] Add explainers for concepts that need first-principles review
- [ ] Define any notation/abbreviations inline in prompts
- [ ] Rewrite hints to guide rather than reveal
- [ ] Update validation to accept equivalent formats
- [ ] Simplify jargon to plain language
- [ ] Verify no PII remains
- [ ] Add tests for new validation patterns

---

**Remember**: If a 7th grader who missed class and forgot the lecture can still work through the problem using only what's written here, the content is clear enough. If not, add more explanation!
