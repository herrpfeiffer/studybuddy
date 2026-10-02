import { useState, useEffect } from 'react';
import './App.css';
import type { WeekLesson, AppState, UserProgress, WeekProgress } from './types/lesson';
import { loadState, saveState, updateConceptMastery } from './utils/storage';
import WeekView from './components/WeekView';
import StationView from './components/StationView';
import SummaryPanel from './components/SummaryPanel';
import PastWeeksView from './components/PastWeeksView';

function App() {
  const [appState, setAppState] = useState<AppState>(loadState());
  const [lessons, setLessons] = useState<WeekLesson[]>([]);
  const [currentView, setCurrentView] = useState<'week' | 'station' | 'summary' | 'past'>('week');
  const [currentWeekId, setCurrentWeekId] = useState<string>('week-01');
  const [currentStationId, setCurrentStationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    saveState(appState);
  }, [appState]);

  const loadLessons = async () => {
    try {
      const response = await fetch('/lessons/week-01.json');
      if (!response.ok) throw new Error('Failed to load lesson');
      const lesson = await response.json();
      setLessons([lesson]);
      setLoading(false);
    } catch (err) {
      setError('Failed to load lessons. Please refresh the page.');
      setLoading(false);
    }
  };

  const getCurrentLesson = (): WeekLesson | undefined => {
    return lessons.find(l => l.weekId === currentWeekId);
  };

  const getCurrentStation = () => {
    const lesson = getCurrentLesson();
    if (!lesson || !currentStationId) return null;
    return lesson.stations.find(s => s.id === currentStationId);
  };

  const handleStationSelect = (stationId: string) => {
    setCurrentStationId(stationId);
    setCurrentView('station');
  };

  const handleStationComplete = (stationId: string, progress: UserProgress[]) => {
    // Update app state with progress
    setAppState(prevState => {
      const newProgress = [...prevState.userProgress, ...progress];
      
      // Update concept mastery
      let newMastery = { ...prevState.conceptMastery };
      progress.forEach(p => {
        newMastery = updateConceptMastery(newMastery, p.conceptTags, p.correct || false);
      });

      // Update week progress
      const weekProgress = prevState.weeks.find(w => w.weekId === currentWeekId);
      let newWeeks = [...prevState.weeks];
      
      if (weekProgress) {
        const updatedWeek: WeekProgress = {
          ...weekProgress,
          stationsCompleted: [...new Set([...weekProgress.stationsCompleted, stationId])],
          totalAttempts: weekProgress.totalAttempts + progress.length,
          correctAnswers: weekProgress.correctAnswers + progress.filter(p => p.correct).length,
        };
        newWeeks = newWeeks.map(w => w.weekId === currentWeekId ? updatedWeek : w);
      } else {
        newWeeks.push({
          weekId: currentWeekId,
          startedAt: Date.now(),
          stationsCompleted: [stationId],
          totalAttempts: progress.length,
          correctAnswers: progress.filter(p => p.correct).length,
          hintsUsed: 0,
        });
      }

      return {
        ...prevState,
        userProgress: newProgress,
        conceptMastery: newMastery,
        weeks: newWeeks,
      };
    });

    // Return to week view
    setCurrentView('week');
    setCurrentStationId(null);
  };

  const handleBackToWeek = () => {
    setCurrentView('week');
    setCurrentStationId(null);
  };

  const getWeekProgress = (): WeekProgress | undefined => {
    return appState.weeks.find(w => w.weekId === currentWeekId);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading Weekly Learning Studio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">{error}</div>
      </div>
    );
  }

  const currentLesson = getCurrentLesson();
  if (!currentLesson) {
    return (
      <div className="app">
        <div className="error">Lesson not found.</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>
          <span>📚</span>
          Weekly Learning Studio
        </h1>
        <p>Let's explore, practice, and grow together!</p>
        
        <nav className="nav">
          <button 
            className="nav-button" 
            onClick={() => setCurrentView('week')}
            disabled={currentView === 'week'}
          >
            This Week
          </button>
          <button 
            className="nav-button secondary" 
            onClick={() => setCurrentView('past')}
            disabled={currentView === 'past'}
          >
            Past Weeks
          </button>
          <button 
            className="nav-button secondary" 
            onClick={() => setCurrentView('summary')}
            disabled={currentView === 'summary'}
          >
            Progress Report
          </button>
        </nav>
      </header>

      <main>
        {currentView === 'week' && (
          <WeekView
            lesson={currentLesson}
            weekProgress={getWeekProgress()}
            onStationSelect={handleStationSelect}
          />
        )}

        {currentView === 'station' && currentStationId && (
          <StationView
            station={getCurrentStation()!}
            weekId={currentWeekId}
            onComplete={handleStationComplete}
            onBack={handleBackToWeek}
          />
        )}

        {currentView === 'summary' && (
          <SummaryPanel
            appState={appState}
            lessons={lessons}
          />
        )}

        {currentView === 'past' && (
          <PastWeeksView
            appState={appState}
            lessons={lessons}
            onWeekSelect={(weekId) => {
              setCurrentWeekId(weekId);
              setCurrentView('week');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
