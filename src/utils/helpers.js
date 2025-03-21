export const getTokens = () => {
  const accessTokenString = localStorage.getItem('accessToken');
  const refreshTokenString = localStorage.getItem('refreshToken');
  return { accessToken: accessTokenString, refreshToken: refreshTokenString };
};

export const setTokens = (accessToken, refreshToken = '') => {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken !== '') {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('themePreference');
};

export const getThemePreference = () => {
  return localStorage.getItem('themePreference') || '3';
};

export const setThemePreference = preference => {
  localStorage.setItem('themePreference', preference);
};
