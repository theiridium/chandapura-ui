import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    // "./node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        color1d: '#650081',
        color1l: '#ffc901',
        color2d: '#ffc901',
      },
      maxWidth: {
        'screen-xl': '1350px'
      },
      screens: {
        'xs': '400px'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui({
    prefix: "ch",
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#650081",
            600: "#650081",
            foreground: "#FFFFFF"
          },
          secondary: {
            DEFAULT: "#ffc901",
            600: "#ad8300",
            foreground: "#272727"
          }
        }
      },
    },
  })],
};
export default config;
