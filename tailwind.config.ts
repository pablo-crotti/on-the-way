import type { Config } from "tailwindcss";

const config: Config = {
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'media',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {

        primary: "#1c8d70",
        secondary: "#b5d4c0",
        darkbg: {
          "50": "#f8f9fa",
          "100": "#eef0f2",
          "200": "#dce0e4",
          "300": "#c1c5cc",
          "400": "#8a909a",
          "500": "#5a636e",
          "600": "#393e49",
          "700": "#262b36",
          "800": "#14171e",
          "900": "#1e1e1e",
          "950": "#030712"
        },
        
        

        // primary: {
        //   "50": "#eff6ff",
        //   "100": "#dbeafe",
        //   "200": "#bfdbfe",
        //   "300": "#93c5fd",
        //   "400": "#60a5fa",
        //   "500": "#3b82f6",
        //   "600": "#2563eb",
        //   "700": "#1d4ed8",
        //   "800": "#1e40af",
        //   "900": "#1e3a8a",
        //   "950": "#172554"
        // },
        comment: "#6A5ACD",
        question: "#808000",
        partnership: "#483C32",
        location: "#4682B4",
        other: "#708090",
      }
    },
    fontFamily: {
      'body': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
      'sans': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ]
    }
  }
}
export default config;













