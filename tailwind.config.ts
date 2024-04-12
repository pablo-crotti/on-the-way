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
        primarydark: "#0f5e4e",
        secondary: "#b5d4c0",
        darkbg: {
          "50": "#f4f4f4",
          "100": "#e0e0e0",
          "200": "#c7c7c7",
          "300": "#adadad",
          "400": "#949494",
          "500": "#7a7a7a",
          "600": "#606060",
          "700": "#464646",
          "800": "#2d2d2d",
          "900": "#1e1e1e",
          "950": "#030712"
        },
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













