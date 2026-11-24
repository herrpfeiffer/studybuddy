import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initializePreviewMode, isPreviewMode, enablePreviewMode, disablePreviewMode, removePreviewParamFromUrl } from './previewMode';

describe('Preview Mode', () => {
  let mockReplaceState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock window.location
    delete (window as any).location;
    (window as any).location = {
      href: 'http://localhost:3000/studybuddy/',
      pathname: '/studybuddy/',
      search: '',
      hash: ''
    };
    
    // Mock history.replaceState
    mockReplaceState = vi.fn();
    (window.history.replaceState as any) = mockReplaceState;
  });

  describe('initializePreviewMode', () => {
    it('should enable preview mode when URL has ?preview=1', () => {
      (window as any).location.href = 'http://localhost:3000/studybuddy/?preview=1';
      (window as any).location.search = '?preview=1';
      
      const result = initializePreviewMode();
      
      expect(result).toBe(true);
      expect(localStorage.getItem('weekly-learning-studio-preview-mode')).toBe('true');
    });

    it('should disable preview mode when URL has ?preview=0', () => {
      localStorage.setItem('weekly-learning-studio-preview-mode', 'true');
      (window as any).location.href = 'http://localhost:3000/studybuddy/?preview=0';
      (window as any).location.search = '?preview=0';
      
      const result = initializePreviewMode();
      
      expect(result).toBe(false);
      expect(localStorage.getItem('weekly-learning-studio-preview-mode')).toBeNull();
    });

    it('should strip preview param from URL after reading ?preview=1', () => {
      (window as any).location.href = 'http://localhost:3000/studybuddy/?preview=1';
      (window as any).location.pathname = '/studybuddy/';
      (window as any).location.search = '?preview=1';
      
      initializePreviewMode();
      
      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/studybuddy/');
    });

    it('should strip preview param from URL after reading ?preview=0', () => {
      (window as any).location.href = 'http://localhost:3000/studybuddy/?preview=0';
      (window as any).location.pathname = '/studybuddy/';
      (window as any).location.search = '?preview=0';
      
      initializePreviewMode();
      
      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/studybuddy/');
    });

    it('should preserve other query params when stripping preview param', () => {
      (window as any).location.href = 'http://localhost:3000/studybuddy/?foo=bar&preview=1&baz=qux';
      (window as any).location.pathname = '/studybuddy/';
      (window as any).location.search = '?foo=bar&preview=1&baz=qux';
      
      const result = initializePreviewMode();
      
      expect(result).toBe(true);
      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/studybuddy/?foo=bar&baz=qux');
    });

    it('should not call replaceState when no preview param in URL', () => {
      (window as any).location.search = '';
      
      initializePreviewMode();
      
      expect(mockReplaceState).not.toHaveBeenCalled();
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

  describe('removePreviewParamFromUrl', () => {
    it('should remove preview param from URL', () => {
      (window as any).location.href = 'http://localhost:3000/studybuddy/?preview=1';
      (window as any).location.pathname = '/studybuddy/';
      (window as any).location.search = '?preview=1';
      (window as any).location.hash = '';
      
      removePreviewParamFromUrl();
      
      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/studybuddy/');
    });

    it('should preserve other query params when removing preview param', () => {
      (window as any).location.href = 'http://localhost:3000/studybuddy/?foo=bar&preview=1';
      (window as any).location.pathname = '/studybuddy/';
      (window as any).location.search = '?foo=bar&preview=1';
      (window as any).location.hash = '';
      
      removePreviewParamFromUrl();
      
      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/studybuddy/?foo=bar');
    });

    it('should preserve hash when removing preview param', () => {
      (window as any).location.href = 'http://localhost:3000/studybuddy/?preview=1#section';
      (window as any).location.pathname = '/studybuddy/';
      (window as any).location.search = '?preview=1';
      (window as any).location.hash = '#section';
      
      removePreviewParamFromUrl();
      
      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/studybuddy/#section');
    });
  });
});
