import type { AppState, ConceptMastery } from '../types/lesson';

const STORAGE_KEY = 'weekly-learning-studio';

export const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  
  return {
    weeks: [],
    userProgress: [],
    conceptMastery: {},
  };
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const exportData = (): string => {
  const state = loadState();
  return JSON.stringify(state, null, 2);
};

export const importData = (jsonString: string): boolean => {
  try {
    const state = JSON.parse(jsonString) as AppState;
    saveState(state);
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

export const calculateMasteryLevel = (correct: number, attempts: number): 'needs-practice' | 'developing' | 'proficient' => {
  if (attempts === 0) return 'needs-practice';
  const ratio = correct / attempts;
  if (ratio >= 0.8) return 'proficient';
  if (ratio >= 0.5) return 'developing';
  return 'needs-practice';
};

export const updateConceptMastery = (
  conceptMastery: Record<string, ConceptMastery>,
  conceptTags: string[],
  correct: boolean
): Record<string, ConceptMastery> => {
  const updated = { ...conceptMastery };
  
  conceptTags.forEach(tag => {
    if (!updated[tag]) {
      updated[tag] = {
        conceptTag: tag,
        attempts: 0,
        correct: 0,
        lastAttempt: Date.now(),
        masteryLevel: 'needs-practice',
      };
    }
    
    updated[tag].attempts++;
    if (correct) updated[tag].correct++;
    updated[tag].lastAttempt = Date.now();
    updated[tag].masteryLevel = calculateMasteryLevel(updated[tag].correct, updated[tag].attempts);
  });
  
  return updated;
};

export const getWeakConcepts = (conceptMastery: Record<string, ConceptMastery>): string[] => {
  return Object.values(conceptMastery)
    .filter(c => c.masteryLevel === 'needs-practice' || c.masteryLevel === 'developing')
    .sort((a, b) => b.lastAttempt - a.lastAttempt)
    .map(c => c.conceptTag)
    .slice(0, 5);
};

export const getReviewSuggestions = (
  conceptMastery: Record<string, ConceptMastery>,
  allLessons: any[]
): { weekId: string; stationId: string; problemId?: string; reason: string }[] => {
  const weakConcepts = getWeakConcepts(conceptMastery);
  const suggestions: { weekId: string; stationId: string; problemId?: string; reason: string }[] = [];
  
  allLessons.forEach(lesson => {
    lesson.stations.forEach((station: any) => {
      const stationTags = station.conceptTags || [];
      const relevantWeakTags = stationTags.filter((tag: string) => weakConcepts.includes(tag));
      
      if (relevantWeakTags.length > 0) {
        if (station.problems) {
          station.problems.forEach((problem: any) => {
            suggestions.push({
              weekId: lesson.weekId,
              stationId: station.id,
              problemId: problem.id,
              reason: `Review: ${relevantWeakTags.join(', ')}`,
            });
          });
        } else {
          suggestions.push({
            weekId: lesson.weekId,
            stationId: station.id,
            reason: `Review: ${relevantWeakTags.join(', ')}`,
          });
        }
      }
    });
  });
  
  return suggestions.slice(0, 2);
};
