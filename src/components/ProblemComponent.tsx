import { useState } from 'react';
import type { Problem, UserProgress, ProblemPart } from '../types/lesson';
import { validateAnswer } from '../utils/validation';

interface ProblemComponentProps {
  problem: Problem;
  weekId: string;
  stationId: string;
  conceptTags: string[];
  onComplete: (progress: UserProgress[]) => void;
}

const ProblemComponent = ({ problem, weekId, stationId, conceptTags, onComplete }: ProblemComponentProps) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [feedback, setFeedback] = useState<Record<string, { correct: boolean; message: string }>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (partId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [partId]: value }));
    // Clear feedback when answer changes
    setFeedback(prev => {
      const newFeedback = { ...prev };
      delete newFeedback[partId];
      return newFeedback;
    });
  };

  const handleSubmitPart = (part: ProblemPart) => {
    const answer = answers[part.partId];
    const result = validateAnswer(part, answer);
    
    setFeedback(prev => ({
      ...prev,
      [part.partId]: { correct: result.correct, message: result.feedback }
    }));

    setAttempts(prev => ({
      ...prev,
      [part.partId]: (prev[part.partId] || 0) + 1
    }));
  };

  const handleShowHint = (partId: string) => {
    setShowHints(prev => ({ ...prev, [partId]: true }));
  };

  const handleCompleteProblem = () => {
    const progress: UserProgress[] = problem.parts.map(part => ({
      weekId,
      stationId,
      problemId: problem.id,
      partId: part.partId,
      answer: answers[part.partId],
      correct: feedback[part.partId]?.correct || false,
      attempts: attempts[part.partId] || 0,
      timestamp: Date.now(),
      conceptTags,
    }));

    onComplete(progress);
  };

  const allPartsAnswered = problem.parts
    .filter(p => !p.optional)
    .every(part => feedback[part.partId]?.correct);

  return (
    <div className="problem-container">
      <div className="problem-prompt">
        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
          <span className="badge" style={{ background: getTierColor(problem.tier) }}>
            Tier {problem.tier}
          </span>
        </div>
        {problem.prompt}
      </div>

      {problem.parts.map((part) => (
        <div 
          key={part.partId} 
          className={`problem-part ${feedback[part.partId]?.correct ? 'answered' : ''}`}
        >
          <div className="question">
            {part.optional && <span style={{ color: 'var(--color-secondary)' }}>(Optional) </span>}
            {part.question}
          </div>

          {part.type === 'text' && (
            <textarea
              value={answers[part.partId] || ''}
              onChange={(e) => handleAnswerChange(part.partId, e.target.value)}
              placeholder="Type your answer here..."
              disabled={feedback[part.partId]?.correct}
            />
          )}

          {part.type === 'numeric' && (
            <input
              type="number"
              value={answers[part.partId] || ''}
              onChange={(e) => handleAnswerChange(part.partId, e.target.value)}
              placeholder="Enter a number..."
              disabled={feedback[part.partId]?.correct}
            />
          )}

          {part.type === 'multiple-choice' && (
            <div className="options">
              {part.options?.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-button ${answers[part.partId] === idx ? 'selected' : ''}`}
                  onClick={() => handleAnswerChange(part.partId, idx)}
                  disabled={feedback[part.partId]?.correct}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {feedback[part.partId] && (
            <div className={`feedback ${feedback[part.partId].correct ? 'correct' : 'incorrect'}`}>
              {feedback[part.partId].message}
            </div>
          )}

          {!feedback[part.partId]?.correct && (
            <div className="button-group">
              <button 
                className="btn btn-primary"
                onClick={() => handleSubmitPart(part)}
                disabled={!answers[part.partId] && answers[part.partId] !== 0}
              >
                Submit Answer
              </button>

              {part.hint && !showHints[part.partId] && (attempts[part.partId] || 0) > 0 && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleShowHint(part.partId)}
                >
                  💡 Show Hint
                </button>
              )}
            </div>
          )}

          {showHints[part.partId] && part.hint && (
            <div className="hint">
              <strong>💡 Hint:</strong> {part.hint}
            </div>
          )}
        </div>
      ))}

      {allPartsAnswered && (
        <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
          <button className="btn btn-success" onClick={handleCompleteProblem}>
            Continue to Next →
          </button>
        </div>
      )}
    </div>
  );
};

const getTierColor = (tier: number): string => {
  switch (tier) {
    case 1: return '#10b981';
    case 2: return '#f59e0b';
    case 3: return '#6366f1';
    default: return '#6b7280';
  }
};

export default ProblemComponent;
