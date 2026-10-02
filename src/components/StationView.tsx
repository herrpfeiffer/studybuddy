import { useState } from 'react';
import type { Station, UserProgress } from '../types/lesson';
import ProblemComponent from './ProblemComponent';
import ContentComponent from './ContentComponent';

interface StationViewProps {
  station: Station;
  weekId: string;
  onComplete: (stationId: string, progress: UserProgress[]) => void;
  onBack: () => void;
}

const StationView = ({ station, weekId, onComplete, onBack }: StationViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [showEnrichment, setShowEnrichment] = useState(false);

  const hasProblems = !!station.problems;
  const totalItems = hasProblems ? station.problems!.length : (station.content?.prompts.length || 0);

  const handleProblemComplete = (problemProgress: UserProgress[]) => {
    setProgress(prev => [...prev, ...problemProgress]);
    
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowEnrichment(true);
    }
  };

  const handleContentComplete = (contentProgress: UserProgress[]) => {
    setProgress(prev => [...prev, ...contentProgress]);
    
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowEnrichment(true);
    }
  };

  const handleFinishStation = () => {
    onComplete(station.id, progress);
  };

  const progressPercentage = ((currentIndex + 1) / totalItems) * 100;

  return (
    <div>
      <button className="back-button" onClick={onBack}>
        ← Back to Week
      </button>

      <div className="card">
        <h2>{station.title}</h2>
        <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
          {station.subject} • ~{station.estimatedMinutes} minutes
        </p>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 10 && `${Math.round(progressPercentage)}%`}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
          {showEnrichment ? 'All done!' : `${currentIndex + 1} of ${totalItems}`}
        </p>
      </div>

      {!showEnrichment && hasProblems && station.problems && (
        <ProblemComponent
          problem={station.problems[currentIndex]}
          weekId={weekId}
          stationId={station.id}
          conceptTags={station.conceptTags}
          onComplete={handleProblemComplete}
        />
      )}

      {!showEnrichment && !hasProblems && station.content && (
        <ContentComponent
          content={station.content}
          currentPromptIndex={currentIndex}
          weekId={weekId}
          stationId={station.id}
          conceptTags={station.conceptTags}
          onComplete={handleContentComplete}
        />
      )}

      {showEnrichment && (
        <div className="card">
          <h3>🎉 Great work!</h3>
          <p style={{ marginTop: 'var(--spacing-md)' }}>
            You've completed all the activities in this station.
          </p>

          {(station.problems?.[0]?.enrichment || station.content?.enrichment) && (
            <div className="enrichment">
              <h3>🌟 Challenge Yourself</h3>
              <p>{station.problems?.[0]?.enrichment || station.content?.enrichment}</p>
            </div>
          )}

          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            <button className="btn btn-success" onClick={handleFinishStation}>
              Complete Station
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationView;
