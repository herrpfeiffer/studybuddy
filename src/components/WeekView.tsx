import type { WeekLesson, WeekProgress } from '../types/lesson';

interface WeekViewProps {
  lesson: WeekLesson;
  weekProgress?: WeekProgress;
  onStationSelect: (stationId: string) => void;
}

const WeekView = ({ lesson, weekProgress, onStationSelect }: WeekViewProps) => {
  const completedStations = weekProgress?.stationsCompleted || [];
  const totalStations = lesson.stations.length;
  const progressPercentage = (completedStations.length / totalStations) * 100;

  return (
    <div>
      <div className="card">
        <h2>{lesson.title}</h2>
        <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
          {lesson.dateRange} • ~{lesson.estimatedMinutes} minutes
        </p>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 10 && `${Math.round(progressPercentage)}%`}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>
          {completedStations.length} of {totalStations} stations completed
        </p>
      </div>

      <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>
        Learning Stations
      </h3>

      {lesson.stations.map(station => {
        const isCompleted = completedStations.includes(station.id);
        
        return (
          <div
            key={station.id}
            className={`card station-card ${isCompleted ? 'completed' : ''}`}
            onClick={() => onStationSelect(station.id)}
          >
            <div className="station-header">
              <h3 className="station-title">{station.title}</h3>
              <div className="station-meta">
                {isCompleted && <span className="badge completed">✓ Completed</span>}
                <span className="badge subject">{station.subject}</span>
                <span className="badge time">~{station.estimatedMinutes} min</span>
              </div>
            </div>

            {station.problems && (
              <p style={{ color: 'var(--color-text-light)' }}>
                {station.problems.length} interactive problems
              </p>
            )}

            {station.content && (
              <p style={{ color: 'var(--color-text-light)' }}>
                {station.content.prompts.length} reflection prompts
              </p>
            )}

            <div style={{ marginTop: 'var(--spacing-md)' }}>
              {station.conceptTags.slice(0, 3).map(tag => (
                <span key={tag} className="concept-tag">
                  {tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;
