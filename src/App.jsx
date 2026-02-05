
import React from 'react';
import { motion } from 'framer-motion';
import { Wine, Compass, Sparkles, Trophy, Gamepad2, Globe, ArrowRight } from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import FindDrinkPage from './pages/FindDrinkPage';

import SearchPage from './pages/SearchPage';
import ExpertGamePage from './pages/ExpertGamePage';
import BottleWhispererPage from './pages/BottleWhispererPage';
import CocktailFinderGame from './pages/CocktailFinderGame';

function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "I know my Liquor",
      desc: "Start with a spirit you already love and get tailored cocktail ideas.",
      button: "START",
      icon: Wine,
      theme: {
        from: "#1f4d3c",
        to: "#0c2b23",
        accent: "#9be29d",
        glow: "rgba(155, 226, 157, 0.35)"
      },
      action: () => navigate('/search'),
      delay: 0.1
    },
    {
      title: "DrinkFinder",
      desc: "Answer a few questions to uncover the perfect sip for your mood.",
      button: "EXPLORE",
      icon: Compass,
      theme: {
        from: "#103e4d",
        to: "#072530",
        accent: "#69d2e7",
        glow: "rgba(105, 210, 231, 0.35)"
      },
      action: () => navigate('/find-drink'),
      delay: 0.2
    },
    {
      title: "Find the Cocktail",
      desc: "Study the image and clues, then pick the correct cocktail name.",
      button: "PLAY",
      icon: Sparkles,
      theme: {
        from: "#3a2b1b",
        to: "#20150a",
        accent: "#f7c46c",
        glow: "rgba(247, 196, 108, 0.35)"
      },
      action: () => navigate('/bottle-whisperer'),
      delay: 0.3
    },
    {
      title: "Expert - Guess the Cocktail",
      desc: "Test your cocktail knowledge with expert-level guesses.",
      button: "CHALLENGE",
      icon: Trophy,
      theme: {
        from: "#2f1b2b",
        to: "#1a0d18",
        accent: "#f3a36b",
        glow: "rgba(243, 163, 107, 0.35)"
      },
      action: () => navigate('/expert-game'),
      delay: 0.4
    },
    {
      title: "Mixology Rush",
      desc: "Race the clock by picking the right ingredients for each cocktail.",
      button: "PLAY",
      icon: Gamepad2,
      theme: {
        from: "#102639",
        to: "#0a1621",
        accent: "#8bd0ff",
        glow: "rgba(139, 208, 255, 0.35)"
      },
      action: () => navigate('/cocktail-finder-game'),
      delay: 0.5
    }
  ];

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden">
      {/* Global Background Image */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://www.suntoryglobalspirits.com/sites/default/files/styles/style_28_9/public/2025-04/On-The-Rocks-Premium-Cocktails-and-The-House-of-Suntory-Debut-The-Harmony-Collection.jpg.webp?itok=QjLDFkvM"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-suntory-teal/85"></div>
      </div>

      {/* Gemba-style Header */}
      <div className="w-full bg-white h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 z-50 shadow-sm relative sticky top-0">
        <div className="flex items-center gap-2">
          <img src="https://www.suntoryglobalspirits.com/themes/custom/bsi_tokens_theme/bsi_tokens_subtheme/logo.svg" alt="Suntory Global Spirits" className="h-6 sm:h-8" />
        </div>
        <div className="flex-1 text-center text-[10px] sm:text-xs uppercase tracking-[0.35em] font-semibold bg-gradient-to-r from-[#f7c46c] via-[#69d2e7] to-[#f3a36b] bg-clip-text text-transparent">
          Suntory Mastery
        </div>
        <div className="flex items-center gap-4 text-suntory-teal text-sm font-medium">
          <div className="flex items-center gap-1 cursor-pointer opacity-70 hover:opacity-100">
            <Globe size={16} /> English
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white mb-4 tracking-tight font-bold">
            The Master’s Pour
          </h1>
          <p className="text-white/70 text-base sm:text-lg">
            Journey from amateur to expert.
            <br />Select a path to discover spirits, flavors, and signature serves.
          </p>
        </motion.div>

        {/* Cards Grid: 3 in first row, 2 centered in second row using 6-col grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-6 gap-6 px-1 sm:px-4">
          {/* First row: 3 cards, columns 1-3-5 */}
          {cards.slice(0, 3).map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: card.delay }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={
                `bg-gradient-to-br p-6 sm:p-8 rounded-lg border border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[18rem] sm:h-80 shadow-lg cursor-pointer hover:shadow-[0_10px_40px_var(--card-glow)] ` +
                `col-span-1 lg:col-span-2 mt-0 mb-0`
              }
              style={{
                '--card-glow': card.theme.glow,
                backgroundImage: `linear-gradient(135deg, ${card.theme.from}, ${card.theme.to})`,
                borderColor: 'rgba(255,255,255,0.1)'
              }}
            >
              <div>
                <div
                  className="mb-6 flex items-center justify-center h-16 w-16 rounded-full border border-white/15 bg-white/5 shadow-[0_0_25px_var(--card-glow)]"
                  style={{ color: card.theme.accent }}
                >
                  <card.icon size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-4">{card.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{card.desc}</p>
              </div>
              <button
                onClick={card.action}
                className="group w-full py-3 px-6 rounded-full border text-white font-medium text-sm flex items-center justify-between hover:bg-white/10 transition-all"
                style={{ borderColor: card.theme.accent }}
              >
                <span className="flex items-center gap-2">
                  <card.icon size={16} style={{ color: card.theme.accent }} />
                  {card.button}
                </span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
          {/* Second row: 2 cards, explicitly centered using col-start utilities */}
          {cards.slice(3, 5).map((card, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: card.delay }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={
                `bg-gradient-to-br p-6 sm:p-8 rounded-lg border border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[18rem] sm:h-80 shadow-lg cursor-pointer hover:shadow-[0_10px_40px_var(--card-glow)] col-span-1 lg:col-span-2 mt-0 mb-0 ` +
                (index === 0 ? 'lg:col-start-2' : 'lg:col-start-4')
              }
              style={{
                '--card-glow': card.theme.glow,
                backgroundImage: `linear-gradient(135deg, ${card.theme.from}, ${card.theme.to})`,
                borderColor: 'rgba(255,255,255,0.1)'
              }}
            >
              <div>
                <div
                  className="mb-6 flex items-center justify-center h-16 w-16 rounded-full border border-white/15 bg-white/5 shadow-[0_0_25px_var(--card-glow)]"
                  style={{ color: card.theme.accent }}
                >
                  <card.icon size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-4">{card.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{card.desc}</p>
              </div>
              <button
                onClick={card.action}
                className="group w-full py-3 px-6 rounded-full border text-white font-medium text-sm flex items-center justify-between hover:bg-white/10 transition-all"
                style={{ borderColor: card.theme.accent }}
              >
                <span className="flex items-center gap-2">
                  <card.icon size={16} style={{ color: card.theme.accent }} />
                  {card.button}
                </span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Strip */}
      <div className="w-full bg-white h-12 flex items-center justify-end px-4 sm:px-8 text-xs text-suntory-teal/60 uppercase tracking-widest">
        © 2026 Suntory Global Spirits
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/find-drink" element={<FindDrinkPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/expert-game" element={<ExpertGamePage />} />
      <Route path="/bottle-whisperer" element={<BottleWhispererPage />} />
      <Route path="/cocktail-finder-game" element={<CocktailFinderGame />} />
    </Routes>
  );
}

export default App;
