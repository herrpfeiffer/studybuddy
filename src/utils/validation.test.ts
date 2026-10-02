import { describe, it, expect } from 'vitest';
import { validateAnswer, evaluateEquation } from './validation';
import type { ProblemPart } from '../types/lesson';

describe('validateAnswer', () => {
  describe('numeric validation', () => {
    it('should validate correct numeric answers', () => {
      const part: ProblemPart = {
        partId: 'test',
        question: 'What is 2 + 3?',
        type: 'numeric',
        correctAnswer: 5,
      };

      const result = validateAnswer(part, 5);
      expect(result.correct).toBe(true);
      expect(result.feedback).toContain('Correct');
    });

    it('should reject incorrect numeric answers', () => {
      const part: ProblemPart = {
        partId: 'test',
        question: 'What is 2 + 3?',
        type: 'numeric',
        correctAnswer: 5,
      };

      const result = validateAnswer(part, 7);
      expect(result.correct).toBe(false);
      expect(result.feedback).toContain('Not quite');
    });

    it('should validate string numbers', () => {
      const part: ProblemPart = {
        partId: 'test',
        question: 'Solve for x',
        type: 'numeric',
        correctAnswer: 13,
      };

      const result = validateAnswer(part, '13');
      expect(result.correct).toBe(true);
    });
  });

  describe('multiple-choice validation', () => {
    it('should validate correct multiple choice answers', () => {
      const part: ProblemPart = {
        partId: 'test',
        question: 'Who is correct?',
        type: 'multiple-choice',
        options: ['Student A', 'Student B', 'Both', 'Neither'],
        correctAnswer: 0,
      };

      const result = validateAnswer(part, 0);
      expect(result.correct).toBe(true);
    });

    it('should reject incorrect multiple choice answers', () => {
      const part: ProblemPart = {
        partId: 'test',
        question: 'Who is correct?',
        type: 'multiple-choice',
        options: ['Student A', 'Student B', 'Both', 'Neither'],
        correctAnswer: 0,
      };

      const result = validateAnswer(part, 1);
      expect(result.correct).toBe(false);
    });
  });

  describe('text validation', () => {
    it('should validate text with required keywords', () => {
      const part: ProblemPart = {
        partId: 'test',
        question: 'Explain equivalence',
        type: 'text',
        validation: {
          keywords: ['equivalent', 'both sides'],
          minLength: 10,
        },
      };

      const result = validateAnswer(part, 'They are equivalent because we change both sides');
      expect(result.correct).toBe(true);
    });

    it('should reject text without keywords', () => {
      const part: ProblemPart = {
        partId: 'test',
        question: 'Explain equivalence',
        type: 'text',
        validation: {
          keywords: ['equivalent', 'both sides'],
          minLength: 10,
        },
      };

      const result = validateAnswer(part, 'This is just random text that is long enough');
      expect(result.correct).toBe(false);
    });

    it('should reject text that is too short', () => {
      const part: ProblemPart = {
        partId: 'test',
        question: 'Explain',
        type: 'text',
        validation: {
          minLength: 20,
        },
      };

      const result = validateAnswer(part, 'Too short');
      expect(result.correct).toBe(false);
      expect(result.feedback).toContain('at least 20 characters');
    });
  });

  describe('empty answer validation', () => {
    it('should reject empty numeric answers', () => {
      const part: ProblemPart = {
        partId: 'test',
        question: 'Solve',
        type: 'numeric',
        correctAnswer: 5,
      };

      const result = validateAnswer(part, '');
      expect(result.correct).toBe(false);
      expect(result.feedback).toContain('Please provide an answer');
    });

    it('should reject empty text answers', () => {
      const part: ProblemPart = {
        partId: 'test',
        question: 'Explain',
        type: 'text',
      };

      const result = validateAnswer(part, '');
      expect(result.correct).toBe(false);
    });
  });
});

describe('evaluateEquation', () => {
  it('should evaluate simple equations correctly', () => {
    expect(evaluateEquation('x + 7 = 12', 'x', 5)).toBe(true);
    expect(evaluateEquation('x + 7 = 12', 'x', 6)).toBe(false);
  });

  it('should evaluate subtraction equations', () => {
    expect(evaluateEquation('n - 9 = 4', 'n', 13)).toBe(true);
    expect(evaluateEquation('n - 9 = 4', 'n', 12)).toBe(false);
  });

  it('should evaluate equations with variables on the left', () => {
    expect(evaluateEquation('m + 5 = 18', 'm', 13)).toBe(true);
    expect(evaluateEquation('k + 6 = 15', 'k', 9)).toBe(true);
  });

  it('should handle equations with multiple operations', () => {
    expect(evaluateEquation('y + 11 = 20', 'y', 9)).toBe(true);
  });
});

describe('Properties of Equality - Week 1 Math Problems', () => {
  it('Problem 1: x + 7 = 12 should equal 5', () => {
    const part: ProblemPart = {
      partId: 'solve',
      question: 'Solve for x',
      type: 'numeric',
      correctAnswer: 5,
    };

    const result = validateAnswer(part, 5);
    expect(result.correct).toBe(true);
    expect(evaluateEquation('x + 7 = 12', 'x', 5)).toBe(true);
  });

  it('Problem 2: n - 9 = 4 should equal 13', () => {
    const part: ProblemPart = {
      partId: 'solve',
      question: 'Solve for n',
      type: 'numeric',
      correctAnswer: 13,
    };

    const result = validateAnswer(part, 13);
    expect(result.correct).toBe(true);
    expect(evaluateEquation('n - 9 = 4', 'n', 13)).toBe(true);
  });

  it('Problem 3: m + 5 = 18 should equal 13', () => {
    const part: ProblemPart = {
      partId: 'solve',
      question: 'Solve for m',
      type: 'numeric',
      correctAnswer: 13,
    };

    const result = validateAnswer(part, 13);
    expect(result.correct).toBe(true);
    expect(evaluateEquation('m + 5 = 18', 'm', 13)).toBe(true);
  });

  it('Problem 4: y + 11 = 20 should equal 9', () => {
    const part: ProblemPart = {
      partId: 'solve',
      question: 'Solve for y',
      type: 'numeric',
      correctAnswer: 9,
    };

    const result = validateAnswer(part, 9);
    expect(result.correct).toBe(true);
    expect(evaluateEquation('y + 11 = 20', 'y', 9)).toBe(true);
  });

  it('Problem 5: k + 6 = 15 should equal 9', () => {
    const part: ProblemPart = {
      partId: 'solve',
      question: 'Solve for k',
      type: 'numeric',
      correctAnswer: 9,
    };

    const result = validateAnswer(part, 9);
    expect(result.correct).toBe(true);
    expect(evaluateEquation('k + 6 = 15', 'k', 9)).toBe(true);
  });
});
