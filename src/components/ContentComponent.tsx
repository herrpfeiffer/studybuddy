import { useState } from 'react';
import type { StationContent, UserProgress } from '../types/lesson';

interface ContentComponentProps {
  content: StationContent;
  currentPromptIndex: number;
  weekId: string;
  stationId: string;
  conceptTags: string[];
  onComplete: (progress: UserProgress[]) => void;
}

const ContentComponent = ({ 
  content, 
  currentPromptIndex, 
  weekId, 
  stationId, 
  conceptTags, 
  onComplete 
}: ContentComponentProps) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const currentPrompt = content.prompts[currentPromptIndex];

  const handleSubmit = () => {
    const progress: UserProgress = {
      weekId,
      stationId,
      promptId: currentPrompt.id,
      answer,
      correct: answer.length >= (currentPrompt.validation?.minLength || 0),
      attempts: 1,
      timestamp: Date.now(),
      conceptTags,
    };

    onComplete([progress]);
  };

  const isValid = answer.length >= (currentPrompt.validation?.minLength || 0);

  return (
    <div className="card">
      {currentPromptIndex === 0 && (
        <>
          <div style={{ 
            background: '#f3f4f6', 
            padding: 'var(--spacing-lg)', 
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            {content.introduction}
          </div>

          {content.mediaReference && (
            <div style={{ 
              padding: 'var(--spacing-md)', 
              background: '#e0e7ff',
              borderRadius: '0.5rem',
              marginBottom: 'var(--spacing-lg)',
              borderLeft: '4px solid var(--color-primary)'
            }}>
              <strong>📻 Optional listening:</strong> {content.mediaReference}
            </div>
          )}
        </>
      )}

      <div className="problem-part">
        <div className="question">
          {currentPrompt.optional && <span style={{ color: 'var(--color-secondary)' }}>(Optional) </span>}
          {currentPrompt.question}
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Share your thoughts..."
          rows={5}
        />

        <div style={{ 
          fontSize: '0.85rem', 
          color: 'var(--color-text-light)', 
          marginTop: 'var(--spacing-sm)' 
        }}>
          {answer.length} characters
          {currentPrompt.validation?.minLength && 
            ` (minimum: ${currentPrompt.validation.minLength})`
          }
        </div>

        {currentPrompt.hint && !showHint && answer.length > 0 && !isValid && (
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowHint(true)}
            style={{ marginTop: 'var(--spacing-md)' }}
          >
            💡 Show Hint
          </button>
        )}

        {showHint && currentPrompt.hint && (
          <div className="hint">
            <strong>💡 Hint:</strong> {currentPrompt.hint}
          </div>
        )}

        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <button 
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!isValid && !currentPrompt.optional}
          >
            {currentPrompt.optional && !isValid ? 'Skip' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentComponent;
