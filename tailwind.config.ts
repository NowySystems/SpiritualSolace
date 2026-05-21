import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crcf: {
          navy: "#0f2742",
          blue: "#1f5f8b",
          sky: "#dff2ff",
          mint: "#d8f4e6",
          gold: "#f4b942",
          slate: "#27384a"
        }
      },
      boxShadow: {
        panel: "0 18px 50px rgba(15, 39, 66, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
