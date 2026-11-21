# Answer Format Validation Fixes

**PR #5**: https://github.com/herrpfeiffer/studybuddy/pull/5

## Problem Summary

Parent testing revealed that answer formats were unintuitive and took 3-4 attempts to match:

### Bug 1: Egg Question
```
Question: "How many raw eggs are LEFT? How many TOTAL eggs are left?"
Answer: "raw left = 4 - 1 = 3 Total left = 12 - 1 = 11"
Result: ❌ REJECTED

Expected: "3, 11" (but this was never stated)
```

### Bug 2: Marbles Error Analysis
```
Question: "Explain the student's mistake"
Answer: "4 red marbles left, 14 total marbles left"
Result: ❌ REJECTED

Answer: Full correct explanation about dependent events
Result: ❌ REJECTED

Expected: ??? (format never clear)
```

**Root Cause**: Questions asking for multiple values used free-text inputs requiring students to guess hidden formats.

---

## Solution

Added **multi-field answer types** where each value gets its own labeled input with independent validation.

---

## Before/After Examples

### Egg Question (Math 3, Part 2)

#### BEFORE
```
┌─────────────────────────────────────────────┐
│ How many raw eggs are LEFT? How many        │
│ TOTAL eggs are left?                        │
├─────────────────────────────────────────────┤
│                                             │
│ [_________________________________]         │ ← What format?!
│                                             │
└─────────────────────────────────────────────┘

Student tries: "raw left = 3, total left = 11"  → ❌
Student tries: "3 raw eggs left, 11 total"      → ❌
Student tries: "3, 11"                          → ✅ (WHY?!)
```

#### AFTER
```
┌─────────────────────────────────────────────┐
│ Fill in the blanks:                         │
├─────────────────────────────────────────────┤
│                                             │
│ Raw eggs left:                              │
│ [__________]                                │ ← Clear label
│                                             │
│ Total eggs left:                            │
│ [__________]                                │ ← Clear label
│                                             │
└─────────────────────────────────────────────┘

Student types: 3 [Enter] 11 [Enter] → ✅ Immediate success!

Student types: 3 [Enter] 12 [Enter] → ❌ "Almost! Check: Total eggs left"
                                         ↑ Specific feedback!
```

---

### Marbles Question (Math 6)

#### BEFORE (one vague question)
```
┌─────────────────────────────────────────────┐
│ Explain the student's mistake. What did     │
│ they do wrong?                              │
├─────────────────────────────────────────────┤
│                                             │
│ [_________________________________]         │
│ [_________________________________]         │
│ [_________________________________]         │
│                                             │
└─────────────────────────────────────────────┘

"4 red marbles left, 14 total" → ❌ "Good start! Hint: ..."
Full correct explanation → ❌ "Good start! Hint: ..."
```

#### AFTER (three clear parts)
```
┌─────────────────────────────────────────────┐
│ Part 1: After drawing one red marble        │
│         and KEEPING it:                     │
├─────────────────────────────────────────────┤
│ Red marbles left:                           │
│ [__________]                                │
│                                             │
│ Total marbles left:                         │
│ [__________]                                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Part 2: Explain the student's mistake:      │
├─────────────────────────────────────────────┤
│ [_________________________________]         │
│ [_________________________________]         │
│ [_________________________________]         │
│                                             │
│ ✅ Great explanation!                       │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ 📖 Model explanation:                │   │
│ │                                      │   │
│ │ The student used 5/15 for both       │   │
│ │ draws, but without replacement...    │   │
│ │                                      │   │
│ │ Did your explanation cover these     │   │
│ │ key ideas?                           │   │
│ └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Part 3: Show your work:                     │
├─────────────────────────────────────────────┤
│ P(first red):                               │
│ [__________]                                │
│                                             │
│ P(second red | first was red):              │
│ [__________]                                │
│                                             │
│ Final answer (simplified):                  │
│ [__________]                                │
└─────────────────────────────────────────────┘
```

---

## Technical Implementation

### 1. New Answer Types

```typescript
// Multi-field: Multiple labeled inputs
interface MultiField {
  fieldId: string;
  label: string;          // "Raw eggs left"
  correctAnswer: number | string;
  placeholder?: string;   // Example format
  unit?: string;          // Optional unit label
}

type: 'multi-field'
fields: MultiField[]

// Explanation: Lenient text validation
type: 'explanation'
modelAnswer?: string    // Shown after correct attempt
```

### 2. Validation Logic

**Multi-field validation**:
- Validates each field independently
- Accepts equivalent formats (1/3 === 5/15 === 0.333)
- Returns specific feedback: "Almost! Check: Total eggs left"

**Explanation validation**:
- Checks for key concepts (keywords)
- Minimum length requirement
- Lenient on wording - accepts any reasonable attempt

### 3. Per-Field Feedback

```typescript
// Before: Generic feedback
"Not quite. Try again!"

// After: Specific feedback
"Almost! Check: Total eggs left, Red marbles left"
```

---

## Questions Converted

### Week 2, Math Problem 3 (Dependent Events - Eggs)

**Part 2 - Converted to multi-field**:
```json
{
  "question": "Fill in the blanks:",
  "type": "multi-field",
  "fields": [
    {
      "fieldId": "raw-left",
      "label": "Raw eggs left",
      "correctAnswer": 3,
      "placeholder": "?"
    },
    {
      "fieldId": "total-left",
      "label": "Total eggs left",
      "correctAnswer": 11,
      "placeholder": "?"
    }
  ],
  "hint": "You took out one raw egg. So: raw left = 4 - 1 = ? Total left = 12 - 1 = ?"
}
```

### Week 2, Math Problem 6 (Spot the Mistake - Marbles)

**Split into 3 parts**:

**Part 1 - Find counts (multi-field)**:
```json
{
  "question": "After drawing one red marble and KEEPING it, fill in the correct counts:",
  "type": "multi-field",
  "fields": [
    {"fieldId": "red-left", "label": "Red marbles left", "correctAnswer": 4},
    {"fieldId": "total-left", "label": "Total marbles left", "correctAnswer": 14}
  ]
}
```

**Part 2 - Explain mistake (explanation)**:
```json
{
  "question": "Now explain the student's mistake:",
  "type": "explanation",
  "validation": {
    "keywords": ["without replacement", "4", "14", "dependent", "forgot"],
    "minLength": 20
  },
  "modelAnswer": "The student used 5/15 for both draws, but without replacement, the second draw has different counts. After removing one red marble, there are only 4 red left out of 14 total. They forgot to adjust the counts for the second draw."
}
```

**Part 3 - Show work (multi-field)**:
```json
{
  "question": "Calculate the CORRECT probability. Show your work:",
  "type": "multi-field",
  "fields": [
    {"fieldId": "first-prob", "label": "P(first red)", "correctAnswer": "5/15"},
    {"fieldId": "second-prob", "label": "P(second red | first was red)", "correctAnswer": "4/14"},
    {"fieldId": "final-answer", "label": "Final answer (simplified)", "correctAnswer": "2/21"}
  ]
}
```

---

## CONTENT_GUIDELINES.md Updates

Added **section on format visibility**:

### Rule: Expected Format Must Be Visible

Every input must show its expected format through:
- **Labeled fields** for multi-value questions
- **Placeholders** showing example format
- **Question text** explicitly stating format

### When to Use Each Type

```
numeric        → Single number ("What is 2 + 2?")
text           → Lists or explanations checked by keywords
multi-field    → 2+ distinct labeled values ✨ NEW
explanation    → Written reasoning checked leniently ✨ NEW
multiple-choice → Pick one option
```

### Bad Example (hidden format)
```json
{
  "question": "How many are left? How many total?",
  "type": "text",
  "validation": {"keywords": ["3", "11"]}
}
```
Problem: Student must guess "3, 11" or "3 and 11" or "3 raw, 11 total"

### Good Example (visible format)
```json
{
  "question": "Fill in:",
  "type": "multi-field",
  "fields": [
    {"label": "Items left", "correctAnswer": 3},
    {"label": "Total left", "correctAnswer": 11}
  ]
}
```
Now the student sees exactly what goes where!

---

## Testing

### All 46 Tests Passing

**Original 37 tests** + **9 new tests**:

**Multi-field validation**:
- ✅ Accept correct values in all fields (egg problem)
- ✅ Accept equivalent forms (1/3 === 5/15, 2/7 === 4/14)
- ✅ Give specific feedback for wrong fields
- ✅ Handle empty fields gracefully
- ✅ Accept marbles problem with correct counts

**Explanation validation**:
- ✅ Accept explanation with key concepts
- ✅ Reject explanation missing key concepts
- ✅ Require minimum length
- ✅ Accept varied wording with key concepts

---

## Student Experience Improvements

### Before
1. Read question: "How many... How many..."
2. Type answer: "raw left = 3, total left = 11"
3. Submit → ❌ "Good start! Hint: ..."
4. Try again: "3 raw eggs left, 11 total eggs left"
5. Submit → ❌ "Good start! Hint: ..."
6. Try again: "3, 11"
7. Submit → ✅ "Correct!"
8. **Frustration**: What format did it want?!

### After
1. Read question: "Fill in the blanks:"
2. See labels: "Raw eggs left:" and "Total eggs left:"
3. Type: 3 in first field, 11 in second field
4. Submit → ✅ "All correct!"
5. **Success**: Crystal clear!

---

## Files Changed

```
CONTENT_GUIDELINES.md            +100 lines   Added format visibility rules
public/lessons/week-02.json      +80 lines    Converted egg & marbles questions
src/types/lesson.ts              +15 lines    Added MultiField interface
src/utils/validation.ts          +80 lines    Added multi-field validation
src/utils/validation.test.ts     +130 lines   Added 9 new tests
src/components/ProblemComponent.tsx +60 lines  Render multi-field inputs
```

---

## Quality Checklist

✅ **Format Visibility** - All expected formats shown up front via labels
✅ **Per-Field Feedback** - "Check: Total eggs left" instead of "Try again"
✅ **Lenient Explanations** - Accept any reasonable wording with key concepts
✅ **Equivalent Formats** - Accept 1/3, 5/15, 0.333, 33.3%
✅ **No PII** - All content remains anonymized
✅ **No-AI Policy** - Practice/review only
✅ **All Tests Passing** - 46/46 tests green
✅ **Backward Compatible** - Existing questions still work

---

## Summary

**Problem**: Hidden formats caused frustration (3-4 attempts per question)

**Solution**: Multi-field inputs with labeled fields and per-field feedback

**Result**: 
- Egg question: Immediate success with labeled fields
- Marbles question: Split into concrete values + lenient explanation
- All formats visible up front
- Specific feedback shows exactly what's wrong

**PR #5**: https://github.com/herrpfeiffer/studybuddy/pull/5
