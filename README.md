
# Suntory Mastery Cocktail App

An interactive React + Vite web app for exploring, learning, and playing with cocktails and spirits, built for Suntory Global Spirits hackathon.

## Features

- **Home Page**: Modern, responsive layout with 3 feature cards in the first row and 2 centered cards in the second row (6-column grid).
- **I Know My Liquor**: Start with a spirit you love and get tailored cocktail ideas.
- **DrinkFinder**: Answer questions to get a personalized drink recommendation.
- **Find the Cocktail**: Guess the cocktail from an image and clues.
- **Expert Game**: Test your cocktail knowledge with expert-level questions.
- **Mixology Rush**: Race the clock to pick the right ingredients for cocktails.

## Tech Stack

- React 19, Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Router v7 for navigation
- Lucide React icons
- ESLint for linting

## Data

- Cocktail recipes and expert questions are stored in JSON files in `src/data/`.
- A Node.js script (`convert_excel.js`) can convert Excel quiz data to JSON.

## Getting Started

1. **Install dependencies:**
	```bash
	npm install
	```
2. **Run the app in development:**
	```bash
	npm run dev
	```
3. **Build for production:**
	```bash
	npm run build
	```

## Folder Structure

- `src/` — Main source code
  - `pages/` — Main app/game pages
  - `hooks/` — Custom React hooks
  - `data/` — Cocktail and quiz data
- `public/` — Static assets

## Customization

- To update quiz questions, edit the Excel file in `src/data/` and run `node convert_excel.js` to regenerate the JSON.
- To add new cocktails, update `recipe-cocktails.json`.

## License

For hackathon/demo use only. Not for production.
