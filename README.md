# 🧮 vurma_cedveli

A multiplication table game built as an academic project for the **Veebirakenduste loomine** (Web Application Development) course at university.

🌐 **Live demo:** https://vurma-cedveli.web.app

---

## About

The player is shown a multiplication task (e.g. `7 × 8 = ?`) and must pick the correct answer from 4 options within 60 seconds. Wrong answers are penalised with a 3-second delay. The final score is `difficulty × correct answers` and is saved to a global leaderboard.

## Features

- 60-second countdown with a visual progress bar
- 4 answer buttons with colour feedback (green / red)
- Difficulty slider from 2 to 20 (controls the number range)
- New record detection with a special animation
- 3-2-1 animated countdown before each game
- Global leaderboard stored in Firebase Firestore
- Name saved in localStorage and pre-filled on the next game
- 4 languages: English, Estonian, Russian, Azerbaijani
- 2 themes: Dark (default) and Light
- Background music and sound effects powered by Howler.js
- Lottie animations throughout the UI

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | CSS Modules |
| Navigation | React Router v6 |
| State | React Context |
| Database | Firebase Firestore |
| Hosting | Firebase Hosting |
| Audio | Howler.js |
| Animations | lottie-web |


Developed by Fuad - based in Estonia 🇪🇪
