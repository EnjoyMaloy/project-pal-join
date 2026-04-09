import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        violet: {
          "super-light": "hsl(var(--violet-super-light))",
          light: "hsl(var(--violet-light))",
          mid: "hsl(var(--violet-mid))",
          dark: "hsl(var(--violet-dark))",
          "super-dark": "hsl(var(--violet-super-dark))",
        },
        cat: {
          ai: { DEFAULT: "hsl(var(--cat-ai))", icon: "hsl(var(--cat-ai-icon))", bg: "hsl(var(--cat-ai-bg))" },
          crypto: { DEFAULT: "hsl(var(--cat-crypto))", bg: "hsl(var(--cat-crypto-bg))" },
          security: { DEFAULT: "hsl(var(--cat-security))", bg: "hsl(var(--cat-security-bg))" },
          trading: { DEFAULT: "hsl(var(--cat-trading))", icon: "hsl(var(--cat-trading-icon))", bg: "hsl(var(--cat-trading-bg))" },
          invest: { DEFAULT: "hsl(var(--cat-invest))", bg: "hsl(var(--cat-invest-bg))" },
          web3: { DEFAULT: "hsl(var(--cat-web3))", bg: "hsl(var(--cat-web3-bg))" },
          tools: { DEFAULT: "hsl(var(--cat-tools))", bg: "hsl(var(--cat-tools-bg))" },
        },
        tag: {
          trading: { DEFAULT: "hsl(var(--tag-trading))", bg: "hsl(var(--tag-trading-bg) / 0.5)" },
          security: { DEFAULT: "hsl(var(--tag-security))", bg: "hsl(var(--tag-security-bg) / 0.5)" },
          web3: { DEFAULT: "hsl(var(--tag-web3))", bg: "hsl(var(--tag-web3-bg) / 0.5)" },
          invest: { DEFAULT: "hsl(var(--tag-invest))", bg: "hsl(var(--tag-invest-bg) / 0.5)" },
          meme: { DEFAULT: "hsl(var(--tag-meme))", bg: "hsl(var(--tag-meme-bg) / 0.5)" },
          telegram: { DEFAULT: "hsl(var(--tag-telegram))", bg: "hsl(var(--tag-telegram-bg) / 0.5)" },
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "gradient-border": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-border": "gradient-border 3s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
