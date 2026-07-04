import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme, ThemeMode } from '@constants/colors';

type ThemeShape = typeof LightTheme;

interface ThemeContextValue {
  mode: ThemeMode;
  theme: ThemeShape;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');

  const theme = useMemo(() => (mode === 'dark' || mode === 'amoled' ? DarkTheme : LightTheme), [
    mode,
  ]);

  const value = useMemo(() => ({ mode, theme, setMode }), [mode, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return ctx;
};
