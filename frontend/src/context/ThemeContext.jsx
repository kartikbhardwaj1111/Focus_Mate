// ThemeContext removed; light/dark mode is no longer supported.
export const ThemeProvider = ({ children }) => children;
export const useTheme = () => ({ theme: 'dark', toggleTheme: () => {} });