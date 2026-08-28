import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Space Grotesk', 'Outfit', 'sans-serif'],
        mono: ['Maple Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        gruvbox: {
          dark0_hard: '#1d2021',
          dark0:      '#282828',
          dark0_soft: '#32302f',
          dark1:      '#3c3836',
          dark2:      '#504945',
          dark3:      '#665c54',
          dark4:      '#7c6f64',
          light0_hard:'#f9f5d7',
          light0:     '#fbf1c7',
          light0_soft:'#f2e5bc',
          light1:     '#ebdbb2',
          light2:     '#d5c4a1',
          light3:     '#bdae93',
          light4:     '#a89984',
          bright_red:    '#fb4934',
          bright_green:  '#b8bb26',
          bright_yellow: '#fabd2f',
          bright_blue:   '#83a598',
          bright_purple: '#d3869b',
          bright_aqua:   '#8ec07c',
          bright_orange: '#fe8019',
        },
      },
    },
  },

  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        gruvbox: {
          "color-scheme": "dark",
          "primary":           "oklch(82% 0.18 85)",   // yellow bright  #fabd2f
          "primary-content":   "oklch(18% 0.01 55)",
          "secondary":         "oklch(73% 0.11 143)",  // aqua bright    #8ec07c
          "secondary-content": "oklch(18% 0.01 55)",
          "accent":            "oklch(71% 0.19 50)",   // orange bright  #fe8019
          "accent-content":    "oklch(18% 0.01 55)",
          "neutral":           "oklch(39% 0.02 50)",   // bg3            #665c54
          "neutral-content":   "oklch(88% 0.04 87)",
          "base-100":          "oklch(18% 0.01 55)",   // bg0            #282828
          "base-200":          "oklch(24% 0.01 55)",   // bg1            #3c3836
          "base-300":          "oklch(31% 0.015 50)",  // bg2            #504945
          "base-content":      "oklch(88% 0.04 87)",   // fg             #ebdbb2
          "info":              "oklch(66% 0.07 200)",  // blue bright    #83a598
          "info-content":      "oklch(18% 0.01 55)",
          "success":           "oklch(73% 0.18 128)",  // green bright   #b8bb26
          "success-content":   "oklch(18% 0.01 55)",
          "warning":           "oklch(72% 0.15 82)",   // yellow         #d79921
          "warning-content":   "oklch(18% 0.01 55)",
          "error":             "oklch(58% 0.22 25)",   // red bright     #fb4934
          "error-content":     "oklch(88% 0.04 87)",
        },
      },
    ],
  },
};
