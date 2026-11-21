import type { ProblemPart } from '../types/lesson';

const parseFraction = (str: string): number | null => {
  const cleaned = str.trim().replace(/\s+/g, '');
  
  if (cleaned.includes('/')) {
    const [num, denom] = cleaned.split('/').map(x => parseFloat(x));
    if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
      return num / denom;
    }
  }
  
  if (cleaned.endsWith('%')) {
    const num = parseFloat(cleaned.slice(0, -1));
    if (!isNaN(num)) {
      return num / 100;
    }
  }
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

const checkEquivalentAnswer = (userAnswer: string, acceptedAnswers: string[]): boolean => {
  const userValue = parseFraction(userAnswer);
  if (userValue === null) return false;
  
  return acceptedAnswers.some(accepted => {
    const acceptedValue = parseFraction(accepted);
    if (acceptedValue === null) return false;
    return Math.abs(userValue - acceptedValue) < 0.0001;
  });
};

const validateMultiField = (part: ProblemPart, answers: Record<string, string>): { correct: boolean; feedback: string } => {
  if (!part.fields || part.fields.length === 0) {
    return { correct: false, feedback: 'No fields defined for this question.' };
  }
  
  const results: Record<string, boolean> = {};
  const incorrectFields: string[] = [];
  
  for (const field of part.fields) {
    const userAnswer = answers?.[field.fieldId];
    
    if (!userAnswer || userAnswer.trim() === '') {
      results[field.fieldId] = false;
      incorrectFields.push(field.label);
      continue;
    }
    
    const userValue = parseFraction(userAnswer);
    const correctValue = typeof field.correctAnswer === 'number' 
      ? field.correctAnswer 
      : parseFraction(String(field.correctAnswer));
    
    if (userValue === null || correctValue === null) {
      results[field.fieldId] = false;
      incorrectFields.push(field.label);
      continue;
    }
    
    const isCorrect = Math.abs(userValue - correctValue) < 0.0001;
    results[field.fieldId] = isCorrect;
    
    if (!isCorrect) {
      incorrectFields.push(field.label);
    }
  }
  
  const allCorrect = Object.values(results).every(r => r);
  
  if (allCorrect) {
    return { correct: true, feedback: '✅ All correct!' };
  } else if (incorrectFields.length === part.fields.length) {
    return { correct: false, feedback: `Check your answers. ${part.hint ? 'Hint: ' + part.hint : 'Try again!'}` };
  } else {
    return { 
      correct: false, 
      feedback: `Almost! Check: ${incorrectFields.join(', ')}. ${part.hint ? 'Hint: ' + part.hint : ''}` 
    };
  }
};

const validateExplanation = (part: ProblemPart, answer: string): { correct: boolean; feedback: string } => {
  if (!answer || answer.trim() === '') {
    return { correct: false, feedback: 'Please write your explanation.' };
  }
  
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
        feedback: `Good start! ${part.hint ? 'Hint: ' + part.hint : 'Try including the key idea.'}`,
      };
    }
  }
  
  return {
    correct: true,
    feedback: '✅ Great explanation!',
  };
};

export const validateAnswer = (part: ProblemPart, answer: any): { correct: boolean; feedback: string } => {
  if (part.type === 'multi-field') {
    return validateMultiField(part, answer);
  }
  
  if (part.type === 'explanation') {
    return validateExplanation(part, answer);
  }
  
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
        const containsFractionOrNumber = validation.keywords.some(kw => 
          kw.includes('/') || kw.includes('%') || !isNaN(parseFloat(kw))
        );
        
        let hasKeywords: boolean;
        if (containsFractionOrNumber) {
          hasKeywords = checkEquivalentAnswer(answer, validation.keywords);
        } else {
          hasKeywords = validation.keywords.some(keyword => 
            textAnswer.includes(keyword.toLowerCase())
          );
        }
        
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
