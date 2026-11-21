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

describe('Compound Probability - Week 2 Math Problems', () => {
  describe('Equivalent fraction/decimal/percent acceptance', () => {
    it('should accept 1/4 as equivalent to 0.25 and 25%', () => {
      const part: ProblemPart = {
        partId: 'probability',
        question: 'What is the probability?',
        type: 'text',
        validation: {
          keywords: ['1/4', '0.25', '25%'],
        },
      };

      expect(validateAnswer(part, '1/4').correct).toBe(true);
      expect(validateAnswer(part, '0.25').correct).toBe(true);
      expect(validateAnswer(part, '25%').correct).toBe(true);
    });

    it('should accept 3/12 as equivalent to 1/4', () => {
      const part: ProblemPart = {
        partId: 'probability',
        question: 'What is the probability?',
        type: 'text',
        validation: {
          keywords: ['1/4', '3/12'],
        },
      };

      expect(validateAnswer(part, '3/12').correct).toBe(true);
      expect(validateAnswer(part, '1/4').correct).toBe(true);
    });

    it('should accept 4/12 as equivalent to 1/3', () => {
      const part: ProblemPart = {
        partId: 'first-raw',
        question: 'Probability first is raw',
        type: 'text',
        validation: {
          keywords: ['4/12', '1/3'],
        },
      };

      expect(validateAnswer(part, '4/12').correct).toBe(true);
      expect(validateAnswer(part, '1/3').correct).toBe(true);
    });

    it('should accept 7/8 in various forms', () => {
      const part: ProblemPart = {
        partId: 'at-least-one',
        question: 'At least one heads',
        type: 'text',
        validation: {
          keywords: ['7/8'],
        },
      };

      expect(validateAnswer(part, '7/8').correct).toBe(true);
      expect(validateAnswer(part, '0.875').correct).toBe(true);
    });

    it('should accept 2/5 as equivalent to 4/10 and 40%', () => {
      const part: ProblemPart = {
        partId: 'percent-to-fraction',
        question: 'Convert 40%',
        type: 'text',
        validation: {
          keywords: ['2/5', '4/10'],
        },
      };

      expect(validateAnswer(part, '2/5').correct).toBe(true);
      expect(validateAnswer(part, '4/10').correct).toBe(true);
      expect(validateAnswer(part, '0.4').correct).toBe(true);
    });
  });

  describe('Sample space problems', () => {
    it('should validate coin flip and die roll sample space count', () => {
      const part: ProblemPart = {
        partId: 'count-total',
        question: 'How many total outcomes?',
        type: 'numeric',
        correctAnswer: 12,
      };

      expect(validateAnswer(part, 12).correct).toBe(true);
      expect(validateAnswer(part, '12').correct).toBe(true);
    });

    it('should validate probability of heads and even number', () => {
      const part: ProblemPart = {
        partId: 'probability',
        question: 'P(heads and even)',
        type: 'text',
        validation: {
          keywords: ['1/4', '3/12', '0.25', '25%'],
        },
      };

      expect(validateAnswer(part, '1/4').correct).toBe(true);
      expect(validateAnswer(part, '3/12').correct).toBe(true);
      expect(validateAnswer(part, '0.25').correct).toBe(true);
      expect(validateAnswer(part, '25%').correct).toBe(true);
    });
  });

  describe('Independent events - rolling die twice', () => {
    it('should validate P(6 on first roll)', () => {
      const part: ProblemPart = {
        partId: 'first-roll',
        question: 'P(6 on first)',
        type: 'text',
        validation: {
          keywords: ['1/6'],
        },
      };

      expect(validateAnswer(part, '1/6').correct).toBe(true);
    });

    it('should validate P(6 and 6) = 1/36', () => {
      const part: ProblemPart = {
        partId: 'multiply',
        question: 'P(6 and 6)',
        type: 'text',
        validation: {
          keywords: ['1/36'],
        },
      };

      expect(validateAnswer(part, '1/36').correct).toBe(true);
    });
  });

  describe('Dependent events - eggs without replacement', () => {
    it('should validate first raw egg probability', () => {
      const part: ProblemPart = {
        partId: 'first-raw',
        question: 'P(first raw)',
        type: 'text',
        validation: {
          keywords: ['4/12', '1/3'],
        },
      };

      expect(validateAnswer(part, '4/12').correct).toBe(true);
      expect(validateAnswer(part, '1/3').correct).toBe(true);
    });

    it('should validate second raw probability given first', () => {
      const part: ProblemPart = {
        partId: 'second-raw-probability',
        question: 'P(second raw | first raw)',
        type: 'text',
        validation: {
          keywords: ['3/11'],
        },
      };

      expect(validateAnswer(part, '3/11').correct).toBe(true);
    });

    it('should validate both raw probability', () => {
      const part: ProblemPart = {
        partId: 'both-raw',
        question: 'P(both raw)',
        type: 'text',
        validation: {
          keywords: ['12/132', '1/11'],
        },
      };

      expect(validateAnswer(part, '12/132').correct).toBe(true);
      expect(validateAnswer(part, '1/11').correct).toBe(true);
    });
  });

  describe('At least one problems', () => {
    it('should validate P(no heads) = 1/8', () => {
      const part: ProblemPart = {
        partId: 'p-no-heads',
        question: 'P(all tails)',
        type: 'text',
        validation: {
          keywords: ['1/8'],
        },
      };

      expect(validateAnswer(part, '1/8').correct).toBe(true);
    });

    it('should validate P(at least one heads) = 7/8', () => {
      const part: ProblemPart = {
        partId: 'p-at-least-one',
        question: 'P(at least one heads)',
        type: 'text',
        validation: {
          keywords: ['7/8'],
        },
      };

      expect(validateAnswer(part, '7/8').correct).toBe(true);
    });
  });

  describe('Conversions', () => {
    it('should validate 3/4 to decimal', () => {
      const part: ProblemPart = {
        partId: 'fraction-to-decimal',
        question: 'Convert 3/4',
        type: 'text',
        validation: {
          keywords: ['0.75', '.75'],
        },
      };

      expect(validateAnswer(part, '0.75').correct).toBe(true);
      expect(validateAnswer(part, '.75').correct).toBe(true);
    });

    it('should validate 0.75 to percent', () => {
      const part: ProblemPart = {
        partId: 'decimal-to-percent',
        question: 'Convert 0.75',
        type: 'text',
        validation: {
          keywords: ['75%', '75'],
        },
      };

      expect(validateAnswer(part, '75%').correct).toBe(true);
    });

    it('should validate 40% to fraction', () => {
      const part: ProblemPart = {
        partId: 'percent-to-fraction',
        question: 'Convert 40%',
        type: 'text',
        validation: {
          keywords: ['2/5', '4/10'],
        },
      };

      expect(validateAnswer(part, '2/5').correct).toBe(true);
      expect(validateAnswer(part, '4/10').correct).toBe(true);
    });
  });

  describe('Spot the mistake - dependent events', () => {
    it('should validate correct probability for both red marbles', () => {
      const part: ProblemPart = {
        partId: 'correct-answer',
        question: 'Correct P(both red)',
        type: 'text',
        validation: {
          keywords: ['20/210', '2/21'],
        },
      };

      expect(validateAnswer(part, '20/210').correct).toBe(true);
      expect(validateAnswer(part, '2/21').correct).toBe(true);
    });
  });
});
