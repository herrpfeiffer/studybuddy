const PREVIEW_MODE_KEY = 'weekly-learning-studio-preview-mode';

export const initializePreviewMode = (): boolean => {
  // Check URL query param first
  const params = new URLSearchParams(window.location.search);
  const previewParam = params.get('preview');
  
  if (previewParam === '1') {
    localStorage.setItem(PREVIEW_MODE_KEY, 'true');
    return true;
  } else if (previewParam === '0') {
    localStorage.removeItem(PREVIEW_MODE_KEY);
    return false;
  }
  
  // Fall back to localStorage
  return localStorage.getItem(PREVIEW_MODE_KEY) === 'true';
};

export const isPreviewMode = (): boolean => {
  return localStorage.getItem(PREVIEW_MODE_KEY) === 'true';
};

export const enablePreviewMode = (): void => {
  localStorage.setItem(PREVIEW_MODE_KEY, 'true');
};

export const disablePreviewMode = (): void => {
  localStorage.removeItem(PREVIEW_MODE_KEY);
};
