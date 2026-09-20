import type { AppState, WeekLesson } from '../types/lesson';

interface PastWeeksViewProps {
  appState: AppState;
  lessons: WeekLesson[];
  onWeekSelect: (weekId: string) => void;
}

const PastWeeksView = ({ appState, lessons, onWeekSelect }: PastWeeksViewProps) => {
  const completedWeeks = appState.weeks.filter(w => w.completedAt);
  const inProgressWeeks = appState.weeks.filter(w => !w.completedAt);

  const getWeekLesson = (weekId: string) => {
    return lessons.find(l => l.weekId === weekId);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderWeekCard = (weekProgress: typeof appState.weeks[0]) => {
    const lesson = getWeekLesson(weekProgress.weekId);
    if (!lesson) return null;

    const completionRate = (weekProgress.stationsCompleted.length / lesson.stations.length) * 100;
    const accuracy = weekProgress.totalAttempts > 0 
      ? Math.round((weekProgress.correctAnswers / weekProgress.totalAttempts) * 100)
      : 0;

    return (
      <div 
        key={weekProgress.weekId}
        className="card station-card"
        onClick={() => onWeekSelect(weekProgress.weekId)}
      >
        <div className="station-header">
          <div>
            <h3 className="station-title">{lesson.title}</h3>
            <p style={{ color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
              {lesson.dateRange}
            </p>
          </div>
          <div>
            {weekProgress.completedAt && (
              <span className="badge completed">✓ Completed</span>
            )}
            {!weekProgress.completedAt && (
              <span className="badge" style={{ background: 'var(--color-secondary)' }}>
                In Progress
              </span>
            )}
          </div>
        </div>

        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionRate}%` }}
            >
              {completionRate > 10 && `${Math.round(completionRate)}%`}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: 'var(--spacing-md)',
            fontSize: '0.9rem',
            color: 'var(--color-text-light)'
          }}>
            <span>{weekProgress.stationsCompleted.length} / {lesson.stations.length} stations</span>
            <span>{accuracy}% accuracy</span>
            <span>Started {formatDate(weekProgress.startedAt)}</span>
          </div>
        </div>

        <div style={{ marginTop: 'var(--spacing-md)' }}>
          {lesson.stations
            .filter(s => weekProgress.stationsCompleted.includes(s.id))
            .slice(0, 3)
            .map(station => (
              <span key={station.id} className="concept-tag">
                {station.subject}
              </span>
            ))}
          {weekProgress.stationsCompleted.length > 3 && (
            <span className="concept-tag">
              +{weekProgress.stationsCompleted.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="card">
        <h2>Past Weeks</h2>
        <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
          Review your learning journey and revisit concepts
        </p>
      </div>

      {inProgressWeeks.length > 0 && (
        <>
          <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>
            In Progress
          </h3>
          {inProgressWeeks.map(renderWeekCard)}
        </>
      )}

      {completedWeeks.length > 0 && (
        <>
          <h3 style={{ 
            marginTop: inProgressWeeks.length > 0 ? 'var(--spacing-xl)' : '0',
            marginBottom: 'var(--spacing-lg)', 
            color: 'var(--color-success)' 
          }}>
            Completed
          </h3>
          {completedWeeks
            .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
            .map(renderWeekCard)}
        </>
      )}

      {appState.weeks.length === 0 && (
        <div className="empty-state">
          <p>No weeks started yet. Let's begin with Week 1! 🚀</p>
        </div>
      )}
    </div>
  );
};

export default PastWeeksView;
