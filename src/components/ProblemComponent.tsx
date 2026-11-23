import { useState } from 'react';
import type { Problem, UserProgress, ProblemPart } from '../types/lesson';
import { validateAnswer } from '../utils/validation';

interface ProblemComponentProps {
  problem: Problem;
  weekId: string;
  stationId: string;
  conceptTags: string[];
  onComplete: (progress: UserProgress[]) => void;
  previewMode?: boolean;
}

const ProblemComponent = ({ problem, weekId, stationId, conceptTags, onComplete, previewMode }: ProblemComponentProps) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [feedback, setFeedback] = useState<Record<string, { correct: boolean; message: string }>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [showExplainer, setShowExplainer] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

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

      {problem.explainer && (
        <div style={{ marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowExplainer(!showExplainer)}
            style={{ 
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
              background: showExplainer ? '#e0e7ff' : '#f3f4f6',
              color: showExplainer ? '#4f46e5' : '#6b7280',
              border: '1px solid #d1d5db'
            }}
          >
            {showExplainer ? '📖 Hide' : '📖 Quick Reminder'}
          </button>
          {showExplainer && (
            <div style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              background: '#f0f9ff',
              borderRadius: 'var(--border-radius)',
              borderLeft: '4px solid #0ea5e9',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-line'
            }}>
              {problem.explainer}
            </div>
          )}
        </div>
      )}

      {previewMode && (
        <div style={{ marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowAnswers(!showAnswers)}
            style={{ 
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
              background: showAnswers ? '#fef3c7' : '#f3f4f6',
              color: showAnswers ? '#92400e' : '#6b7280',
              border: '1px solid #d1d5db'
            }}
          >
            {showAnswers ? '👁️ Hide Answers' : '👁️ Show Answers'}
          </button>
          {showAnswers && (
            <div style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              background: '#fffbeb',
              borderRadius: 'var(--border-radius)',
              borderLeft: '4px solid #f59e0b',
              fontSize: '0.95rem',
            }}>
              <strong>Expected Answers:</strong>
              <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
                {problem.parts.map(part => (
                  <li key={part.partId} style={{ marginTop: '0.5rem' }}>
                    <strong>{part.question}</strong><br/>
                    {part.type === 'multi-field' && part.fields ? (
                      <div style={{ marginTop: '0.25rem', paddingLeft: '1rem' }}>
                        {part.fields.map(field => (
                          <div key={field.fieldId}>
                            {field.label}: <code>{field.correctAnswer}</code>
                          </div>
                        ))}
                      </div>
                    ) : part.type === 'explanation' ? (
                      <div style={{ marginTop: '0.25rem', fontStyle: 'italic' }}>
                        {part.modelAnswer || 'Model answer: ' + part.correctAnswer}
                      </div>
                    ) : (
                      <code>{String(part.correctAnswer)}</code>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

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

          {part.type === 'multi-field' && part.fields && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {part.fields.map((field) => (
                <div key={field.fieldId} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                    {field.label}:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={answers[part.partId]?.[field.fieldId] || ''}
                      onChange={(e) => {
                        const newAnswers = { ...answers[part.partId], [field.fieldId]: e.target.value };
                        handleAnswerChange(part.partId, newAnswers);
                      }}
                      placeholder={field.placeholder || 'Enter value...'}
                      disabled={feedback[part.partId]?.correct}
                      style={{ flex: 1 }}
                    />
                    {field.unit && <span style={{ color: 'var(--color-text-light)' }}>{field.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {part.type === 'explanation' && (
            <div>
              <textarea
                value={answers[part.partId] || ''}
                onChange={(e) => handleAnswerChange(part.partId, e.target.value)}
                placeholder={part.validation?.keywords ? 
                  "Explain your thinking... (What did they do wrong? Why?)" : 
                  "Type your explanation here..."}
                rows={3}
                disabled={feedback[part.partId]?.correct}
              />
              {part.modelAnswer && feedback[part.partId]?.correct && (
                <div style={{
                  marginTop: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  background: '#f0f9ff',
                  borderRadius: 'var(--border-radius)',
                  borderLeft: '4px solid #0ea5e9'
                }}>
                  <strong>Model explanation:</strong>
                  <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>{part.modelAnswer}</p>
                  <p style={{ marginTop: '0.5rem', marginBottom: 0, fontStyle: 'italic', color: 'var(--color-text-light)' }}>
                    Did your explanation cover these key ideas?
                  </p>
                </div>
              )}
            </div>
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
