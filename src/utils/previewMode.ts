const PREVIEW_MODE_KEY = 'weekly-learning-studio-preview-mode';

export const initializePreviewMode = (): boolean => {
  // Check URL query param first
  const params = new URLSearchParams(window.location.search);
  const previewParam = params.get('preview');
  
  let result: boolean;
  
  if (previewParam === '1') {
    localStorage.setItem(PREVIEW_MODE_KEY, 'true');
    result = true;
  } else if (previewParam === '0') {
    localStorage.removeItem(PREVIEW_MODE_KEY);
    result = false;
  } else {
    // Fall back to localStorage
    result = localStorage.getItem(PREVIEW_MODE_KEY) === 'true';
  }
  
  // Strip preview param from URL after reading it
  if (previewParam !== null) {
    removePreviewParamFromUrl();
  }
  
  return result;
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

export const removePreviewParamFromUrl = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('preview');
  
  // Use replaceState to update URL without page reload
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
};
