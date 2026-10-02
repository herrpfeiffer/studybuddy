import type { ProblemPart } from '../types/lesson';

export const validateAnswer = (part: ProblemPart, answer: any): { correct: boolean; feedback: string } => {
  if ((answer === null || answer === undefined || answer === '') || (typeof answer === 'string' && answer.trim() === '')) {
    return { correct: false, feedback: 'Please provide an answer.' };
  }

  switch (part.type) {
    case 'numeric': {
      const numAnswer = typeof answer === 'number' ? answer : parseFloat(answer);
      if (isNaN(numAnswer)) {
        return { correct: false, feedback: 'Please enter a valid number.' };
      }
      
      const correct = numAnswer === part.correctAnswer;
      return {
        correct,
        feedback: correct 
          ? '✅ Correct!' 
          : `Not quite. ${part.hint ? 'Hint: ' + part.hint : 'Try again!'}`,
      };
    }
    
    case 'multiple-choice': {
      const correct = answer === part.correctAnswer;
      return {
        correct,
        feedback: correct 
          ? `✅ Correct! ${part.explanation || ''}` 
          : `Not quite. ${part.explanation || (part.hint ? 'Hint: ' + part.hint : 'Try again!')}`,
      };
    }
    
    case 'text': {
      const textAnswer = String(answer).toLowerCase();
      const validation = part.validation;
      
      if (validation?.minLength && textAnswer.length < validation.minLength) {
        return { 
          correct: false, 
          feedback: `Please write a bit more (at least ${validation.minLength} characters).` 
        };
      }
      
      if (validation?.keywords) {
        const hasKeywords = validation.keywords.some(keyword => 
          textAnswer.includes(keyword.toLowerCase())
        );
        
        if (!hasKeywords) {
          return {
            correct: false,
            feedback: `Good start! ${part.hint ? 'Hint: ' + part.hint : 'Try including key ideas from the question.'}`,
          };
        }
      }
      
      return {
        correct: true,
        feedback: '✅ Great thinking!',
      };
    }
    
    default:
      return { correct: true, feedback: 'Submitted!' };
  }
};

export const checkEquationEquivalence = (eq1: string, eq2: string): boolean => {
  // Simple check for equation equivalence (could be enhanced)
  const normalize = (eq: string) => eq.replace(/\s+/g, '').toLowerCase();
  return normalize(eq1) === normalize(eq2);
};

export const evaluateEquation = (equation: string, variable: string, value: number): boolean => {
  try {
    // Replace variable with value and evaluate
    // This is a simple implementation - in production, use a proper math parser
    const expr = equation.replace(new RegExp(variable, 'g'), String(value));
    const [left, right] = expr.split('=').map(side => side.trim());
    
    // eslint-disable-next-line no-eval
    const leftVal = eval(left.replace(/\s+/g, ''));
    // eslint-disable-next-line no-eval
    const rightVal = eval(right.replace(/\s+/g, ''));
    
    return Math.abs(leftVal - rightVal) < 0.0001;
  } catch {
    return false;
  }
};
