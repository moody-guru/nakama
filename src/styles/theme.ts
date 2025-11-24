// src/styles/theme.ts
export const theme = {
  colors: {
    background: "#0F0F1A", // Deep space blue/black
    card: "#1A1A2E", // Slightly lighter dark for cards
    primary: "#FF2E63", // Neon Pink/Red for buttons & accents
    secondary: "#08D9D6", // Neon Cyan for prices & highlights
    text: "#EAEAEA", // Off-white for main text
    textDim: "#8D8D9E", // Dim grey for secondary text
    border: "#2A2A3C", // subtle borders
    success: "#00FF9F", // Neon Green
    danger: "#FF0033", // Deep Red for SOLD/Errors
    overlay: "rgba(15, 15, 26, 0.9)", // Dark overlay
  },
  borderRadius: {
    md: 12,
    lg: 20,
    xl: 100, // For circles
  },
  shadows: {
    neon: {
      shadowColor: "#FF2E63",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
  },
};
