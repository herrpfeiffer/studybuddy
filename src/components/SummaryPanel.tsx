import type { AppState, WeekLesson } from '../types/lesson';
import { exportData, importData, getReviewSuggestions } from '../utils/storage';
import { useState } from 'react';

interface SummaryPanelProps {
  appState: AppState;
  lessons: WeekLesson[];
}

const SummaryPanel = ({ appState, lessons }: SummaryPanelProps) => {
  const [importText, setImportText] = useState('');
  const [importMessage, setImportMessage] = useState('');

  const totalWeeks = appState.weeks.length;
  const totalProgress = appState.userProgress.length;
  const correctAnswers = appState.userProgress.filter(p => p.correct).length;
  const accuracy = totalProgress > 0 ? Math.round((correctAnswers / totalProgress) * 100) : 0;

  const conceptEntries = Object.entries(appState.conceptMastery);
  const proficientConcepts = conceptEntries.filter(([_, c]) => c.masteryLevel === 'proficient').length;
  const developingConcepts = conceptEntries.filter(([_, c]) => c.masteryLevel === 'developing').length;
  const needsPracticeConcepts = conceptEntries.filter(([_, c]) => c.masteryLevel === 'needs-practice').length;

  const reviewSuggestions = getReviewSuggestions(appState.conceptMastery, lessons);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importData(importText)) {
      setImportMessage('✅ Data imported successfully! Please refresh the page.');
      setImportText('');
    } else {
      setImportMessage('❌ Failed to import data. Please check the format.');
    }
  };

  return (
    <div className="summary-panel">
      <h2>Progress Report</h2>
      <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
        For parents and tutors
      </p>

      <div className="summary-grid">
        <div className="summary-stat">
          <div className="value">{totalWeeks}</div>
          <div className="label">Weeks Started</div>
        </div>

        <div className="summary-stat">
          <div className="value">{totalProgress}</div>
          <div className="label">Total Responses</div>
        </div>

        <div className="summary-stat">
          <div className="value">{accuracy}%</div>
          <div className="label">Accuracy</div>
        </div>

        <div className="summary-stat">
          <div className="value">{correctAnswers}</div>
          <div className="label">Correct Answers</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
        <h3>Concept Mastery</h3>
        
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          {conceptEntries.length === 0 ? (
            <p style={{ color: 'var(--color-text-light)' }}>
              No concepts tracked yet. Complete some activities to see progress!
            </p>
          ) : (
            <>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                  <span className="mastery-indicator proficient">
                    ✓ Proficient: {proficientConcepts}
                  </span>
                  <span className="mastery-indicator developing">
                    ↗ Developing: {developingConcepts}
                  </span>
                  <span className="mastery-indicator needs-practice">
                    ⚡ Needs Practice: {needsPracticeConcepts}
                  </span>
                </div>
              </div>

              {conceptEntries
                .sort((a, b) => b[1].lastAttempt - a[1].lastAttempt)
                .slice(0, 10)
                .map(([tag, mastery]) => (
                  <div 
                    key={tag} 
                    style={{ 
                      padding: 'var(--spacing-md)',
                      background: '#f9fafb',
                      borderRadius: '0.5rem',
                      marginBottom: 'var(--spacing-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong>{tag.replace(/-/g, ' ')}</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                        {mastery.correct} correct out of {mastery.attempts} attempts
                      </div>
                    </div>
                    <span className={`mastery-indicator ${mastery.masteryLevel}`}>
                      {mastery.masteryLevel === 'proficient' && '✓ Proficient'}
                      {mastery.masteryLevel === 'developing' && '↗ Developing'}
                      {mastery.masteryLevel === 'needs-practice' && '⚡ Practice'}
                    </span>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

      {reviewSuggestions.length > 0 && (
        <div className="review-suggestions">
          <h3>Suggested Review</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-md)' }}>
            Based on concepts that could use more practice
          </p>
          
          {reviewSuggestions.map((suggestion, idx) => (
            <div key={idx} className="review-item">
              <strong>{suggestion.weekId.replace(/-/g, ' ').toUpperCase()}</strong>
              {' → '}
              {lessons
                .find(l => l.weekId === suggestion.weekId)
                ?.stations.find(s => s.id === suggestion.stationId)
                ?.title || suggestion.stationId}
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
                {suggestion.reason}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
        <h3>Export / Import Data</h3>
        <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
          Backup your progress or transfer it to another device
        </p>

        <div className="export-import">
          <button className="btn btn-primary" onClick={handleExport}>
            📥 Export Progress
          </button>
        </div>

        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>
            Import Progress Data
          </label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste exported JSON data here..."
            rows={4}
          />
          <button 
            className="btn btn-secondary" 
            onClick={handleImport}
            disabled={!importText}
            style={{ marginTop: 'var(--spacing-sm)' }}
          >
            📤 Import
          </button>

          {importMessage && (
            <div style={{ 
              marginTop: 'var(--spacing-md)', 
              padding: 'var(--spacing-md)',
              background: importMessage.startsWith('✅') ? '#d1fae5' : '#fee2e2',
              borderRadius: '0.5rem'
            }}>
              {importMessage}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--spacing-xl)', background: '#fef3c7' }}>
        <h3>📝 Academic Integrity Note</h3>
        <p style={{ marginTop: 'var(--spacing-sm)' }}>
          This app is designed for <strong>practice and enrichment only</strong>. 
          Responses should never be copied directly for homework submission. 
          The goal is to build understanding through exploration and reflection.
        </p>
      </div>
    </div>
  );
};

export default SummaryPanel;
