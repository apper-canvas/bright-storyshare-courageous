import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const THEME_STORAGE_KEY = 'storyshare-theme';
const TEXT_SIZE_STORAGE_KEY = 'storyshare-text-size';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [textSize, setTextSize] = useState('medium');

  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const savedTextSize = localStorage.getItem(TEXT_SIZE_STORAGE_KEY);
    
    if (savedTheme && ['light', 'dark', 'sepia'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
    
    if (savedTextSize && ['small', 'medium', 'large', 'extra-large'].includes(savedTextSize)) {
      setTextSize(savedTextSize);
    }
  }, []);

  // Apply theme and text size to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-text-size', textSize);
  }, [theme, textSize]);

  const changeTheme = (newTheme) => {
    if (['light', 'dark', 'sepia'].includes(newTheme)) {
      setTheme(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  };

  const changeTextSize = (newTextSize) => {
    if (['small', 'medium', 'large', 'extra-large'].includes(newTextSize)) {
      setTextSize(newTextSize);
      localStorage.setItem(TEXT_SIZE_STORAGE_KEY, newTextSize);
    }
  };

  const value = {
    theme,
    textSize,
    changeTheme,
    changeTextSize,
    themes: [
      { id: 'light', name: 'Light', description: 'Warm and comfortable reading' },
      { id: 'dark', name: 'Dark', description: 'Easy on the eyes in low light' },
      { id: 'sepia', name: 'Sepia', description: 'Classic vintage paper feel' }
    ],
    textSizes: [
      { id: 'small', name: 'Small', size: '14px' },
      { id: 'medium', name: 'Medium', size: '16px' },
      { id: 'large', name: 'Large', size: '18px' },
      { id: 'extra-large', name: 'Extra Large', size: '20px' }
    ]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};