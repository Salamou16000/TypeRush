# TypeRush

A lightweight typing speed test built with React + Vite.

## Features
- 15, 30 and 60 second tests
- Live WPM, accuracy, error and character counts
- Character-by-character correct / incorrect feedback
- Personal best saved in browser LocalStorage
- Responsive dark UI for desktop and mobile
- No backend or account required

## Run locally
1. Install Node.js (LTS).
2. Extract this project.
3. Open a terminal in the project folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

The production website is generated in the `dist` folder.

## Deploy
Import the project into GitHub, then import that repository into Vercel.
Use `npm run build` as the build command and `dist` as the output directory.
