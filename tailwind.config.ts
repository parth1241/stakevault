import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080010",
        surface: "#0d0019",
        elevated: "#120022",
        high: "#1a0033",
        primary: {
          DEFAULT: "#8b5cf6",
          foreground: "#f1f5f9",
        },
        secondary: {
          DEFAULT: "#a78bfa",
          foreground: "#f1f5f9",
        },
        accent: {
          indigo: "#6366f1",
          fuchsia: "#d946ef",
          cyan: "#06b6d4",
          amber: "#f59e0b",
          rose: "#f43f5e",
          sky: "#0ea5e9",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#475569",
        },
        border: {
          subtle: "rgba(139,92,246,0.15)",
          default: "rgba(139,92,246,0.25)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
        yieldTick: "yieldTick 0.5s ease-out",
        lockUnlock: "lockUnlock 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        stakeConfirm: "stakeConfirm 1s ease-out forwards",
        progressFill: "progressFill 2s ease-out forwards",
        rotateBorder: "rotateBorder 4s linear infinite",
        bob1: "bob 3s ease-in-out infinite",
        bob2: "bob 3.5s ease-in-out infinite",
        bob3: "bob 4s ease-in-out infinite",
        marquee: "marquee 25s linear infinite",
        spinRing: "spinRing 2s linear infinite",
        countPulse: "countPulse 1s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
        yieldTick: {
          "0%": { transform: "scale(1)", color: "#8b5cf6" },
          "50%": { transform: "scale(1.1)", color: "#d946ef" },
          "100%": { transform: "scale(1)", color: "inherit" },
        },
        lockUnlock: {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "50%": { transform: "scale(1.2) rotate(-10deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        stakeConfirm: {
          "0%": { transform: "scale(0.8)", opacity: "0", boxShadow: "0 0 0 0 rgba(139,92,246,0.5)" },
          "50%": { transform: "scale(1.1)", opacity: "1", boxShadow: "0 0 0 20px rgba(139,92,246,0)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        progressFill: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        rotateBorder: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        spinRing: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        countPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
