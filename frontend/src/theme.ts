// src/theme.ts
// Design system for ExpenseOS – premium dark/light mode with glassmorphism

export const lightTheme = {
  background: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(12px) saturate(180%)",
  borderRadius: "12px",
  primary: "hsl(210, 40%, 55%)",
  secondary: "hsl(210, 30%, 70%)",
  text: "#111111",
  mutedText: "#555555",
  accent: "hsl(34, 80%, 55%)",
};

export const darkTheme = {
  background: "rgba(18, 18, 20, 0.6)",
  backdropFilter: "blur(12px) saturate(180%)",
  borderRadius: "12px",
  primary: "hsl(210, 40%, 65%)",
  secondary: "hsl(210, 30%, 45%)",
  text: "#eeeeee",
  mutedText: "#bbbbbb",
  accent: "hsl(34, 80%, 65%)",
};

export type Theme = typeof lightTheme;

export const defaultTheme = darkTheme; // start in dark mode
