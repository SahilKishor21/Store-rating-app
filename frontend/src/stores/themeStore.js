import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEME, STORAGE_KEYS } from '../utils/constants';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: THEME.SYSTEM,
      setTheme: (theme) => {
        set({ theme });
        get().applyTheme(theme);
      },
      applyTheme: (theme) => {
        const root = window.document.documentElement;
        root.classList.remove(THEME.LIGHT, THEME.DARK);
        if (theme === THEME.SYSTEM) {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? THEME.DARK
            : THEME.LIGHT;
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },
      initializeTheme: () => {
        const { theme } = get();
        get().applyTheme(theme);
        if (theme === THEME.SYSTEM) {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => get().applyTheme(THEME.SYSTEM);
          mediaQuery.addEventListener('change', handleChange);
          return () => mediaQuery.removeEventListener('change', handleChange);
        }
      },
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
        get().setTheme(newTheme);
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export default useThemeStore;
