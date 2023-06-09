// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors:{
      transparent: 'transparent',
      'globalColor1' : '#f4c4d4',
      'globalColor2' : '#ea92ab',
      'globalColor3' : '#af7fc2',
      'globalColor4' : '#9085d0',
      'globalColor5' : '#8c76be',
      'globalColor6' : '#61567d',
    },
    extend: {},
  },
  plugins: [],
}