import { describe, it, expect, beforeEach } from 'vitest';
import { initializePreviewMode, isPreviewMode, enablePreviewMode, disablePreviewMode } from './previewMode';

describe('Preview Mode', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock window.location.search
    delete (window as any).location;
    (window as any).location = { search: '' };
  });

  describe('initializePreviewMode', () => {
    it('should enable preview mode when URL has ?preview=1', () => {
      (window as any).location.search = '?preview=1';
      const result = initializePreviewMode();
      
      expect(result).toBe(true);
      expect(localStorage.getItem('weekly-learning-studio-preview-mode')).toBe('true');
    });

    it('should disable preview mode when URL has ?preview=0', () => {
      localStorage.setItem('weekly-learning-studio-preview-mode', 'true');
      (window as any).location.search = '?preview=0';
      
      const result = initializePreviewMode();
      
      expect(result).toBe(false);
      expect(localStorage.getItem('weekly-learning-studio-preview-mode')).toBeNull();
    });

    it('should read from localStorage when no URL param', () => {
      localStorage.setItem('weekly-learning-studio-preview-mode', 'true');
      (window as any).location.search = '';
      
      const result = initializePreviewMode();
      
      expect(result).toBe(true);
    });

    it('should return false when no URL param and no localStorage', () => {
      (window as any).location.search = '';
      
      const result = initializePreviewMode();
      
      expect(result).toBe(false);
    });

    it('should handle URL params with other query strings', () => {
      (window as any).location.search = '?foo=bar&preview=1&baz=qux';
      
      const result = initializePreviewMode();
      
      expect(result).toBe(true);
    });
  });

  describe('isPreviewMode', () => {
    it('should return true when preview mode is enabled', () => {
      localStorage.setItem('weekly-learning-studio-preview-mode', 'true');
      
      expect(isPreviewMode()).toBe(true);
    });

    it('should return false when preview mode is disabled', () => {
      expect(isPreviewMode()).toBe(false);
    });
  });

  describe('enablePreviewMode', () => {
    it('should enable preview mode in localStorage', () => {
      enablePreviewMode();
      
      expect(localStorage.getItem('weekly-learning-studio-preview-mode')).toBe('true');
      expect(isPreviewMode()).toBe(true);
    });
  });

  describe('disablePreviewMode', () => {
    it('should remove preview mode from localStorage', () => {
      localStorage.setItem('weekly-learning-studio-preview-mode', 'true');
      
      disablePreviewMode();
      
      expect(localStorage.getItem('weekly-learning-studio-preview-mode')).toBeNull();
      expect(isPreviewMode()).toBe(false);
    });
  });
});
