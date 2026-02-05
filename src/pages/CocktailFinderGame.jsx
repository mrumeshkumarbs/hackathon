import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Timer,
  Flame,
  RefreshCw,
  Shuffle,
  CheckCircle2,
  XCircle,
  Droplets,
  Beaker
} from 'lucide-react';
import cocktailsData from '../data/recipe-cocktails.json';

const imagePool = [
  'https://house.suntory.com/sites/default/files/styles/card_9_16/public/2025-02/CDP_Haku_Lychee_Product.jpg.webp?itok=7Piv2iib',
  'https://house.suntory.com/sites/default/files/styles/card_9_16/public/2025-04/New%20Project%20%282%29.png.webp?itok=emCCghoC',
  'https://house.suntory.com/sites/default/files/2024-03/ROKU_SAKURA_APERITIF_LTO_SERVE_sRGB_0.jpg',
  'https://house.suntory.com/sites/default/files/2022-09/SDP_OntheRocks.jpg',
  'https://www.suntoryglobalspirits.com/sites/default/files/styles/style_28_9/public/2025-04/On-The-Rocks-Premium-Cocktails-and-The-House-of-Suntory-Debut-The-Harmony-Collection.jpg.webp?itok=QjLDFkvM'
];

const palettes = [
  {
    name: 'Midnight Citrus',
    base: '#0f3d3e',
    glow: 'rgba(231, 194, 122, 0.45)',
    accent: '#e7c27a',
    overlay: 'linear-gradient(145deg, rgba(7, 24, 26, 0.8) 10%, rgba(20, 72, 78, 0.6) 55%, rgba(231, 194, 122, 0.2) 100%)'
  },
  {
    name: 'Ruby Velvet',
    base: '#2f1b2b',
    glow: 'rgba(233, 117, 94, 0.45)',
    accent: '#f3a36b',
    overlay: 'linear-gradient(145deg, rgba(24, 10, 22, 0.85) 10%, rgba(63, 30, 46, 0.7) 55%, rgba(243, 163, 107, 0.2) 100%)'
  },
  {
    name: 'Sapphire Mist',
    base: '#102639',
    glow: 'rgba(104, 192, 228, 0.4)',
    accent: '#69d2e7',
    overlay: 'linear-gradient(145deg, rgba(8, 20, 31, 0.85) 10%, rgba(20, 59, 83, 0.7) 55%, rgba(105, 210, 231, 0.25) 100%)'
  },
  {
    name: 'Golden Hour',
    base: '#3a2b1b',
    glow: 'rgba(255, 199, 120, 0.45)',
    accent: '#f7c46c',
    overlay: 'linear-gradient(145deg, rgba(24, 17, 9, 0.85) 10%, rgba(73, 48, 22, 0.7) 55%, rgba(247, 196, 108, 0.2) 100%)'
  },
  {
    name: 'Verdant Smoke',
    base: '#183129',
    glow: 'rgba(141, 206, 144, 0.45)',
    accent: '#9be29d',
    overlay: 'linear-gradient(145deg, rgba(9, 19, 15, 0.85) 10%, rgba(30, 75, 55, 0.7) 55%, rgba(155, 226, 157, 0.2) 100%)'
  }
];

const ROUND_TIME = 40;
const GRID_SIZE = 12;

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getSpiritLabel = (categoryName) => {
  if (!categoryName) return 'Spirit';
  const match = categoryName.match(/^[A-Za-z ]+/);
  return match ? match[0].trim() : categoryName;
};

const buildRound = (cocktails) => {
  const target = cocktails[Math.floor(Math.random() * cocktails.length)];
  const correctItems = Array.from(new Set(target.ingredients.map((item) => item.item)));
  const ingredientPool = Array.from(
    new Set(
      cocktails.flatMap((cocktail) => cocktail.ingredients.map((item) => item.item))
    )
  ).filter((item) => !correctItems.includes(item));

  const fillerCount = Math.max(GRID_SIZE - correctItems.length, 0);
  const fillers = shuffle(ingredientPool).slice(0, fillerCount);
  const deck = shuffle([...correctItems, ...fillers]);
  const seed = hashString(`${target.name}-${target.categoryName}`);
  const palette = palettes[seed % palettes.length];
  const image = imagePool[seed % imagePool.length];

  return {
    target: {
      ...target,
      id: `${target.categoryName}-${target.name}`,
      palette,
      image,
      correctItems
    },
    deck
  };
};

const CocktailFinderGame = () => {
  const navigate = useNavigate();
  const cocktails = useMemo(() => {
    return cocktailsData.Recipe.flatMap((category) =>
      category.cocktails.map((cocktail) => ({
        ...cocktail,
        categoryName: category.category
      }))
    );
  }, []);

  const [round, setRound] = useState(1);
  const [target, setTarget] = useState(null);
  const [deck, setDeck] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [status, setStatus] = useState('loading');
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);

  const startRound = useCallback((nextRound) => {
    const next = buildRound(cocktails);
    setTarget(next.target);
    setDeck(next.deck);
    setSelected([]);
    setTimeLeft(ROUND_TIME);
    setStatus('playing');
    if (typeof nextRound === 'number') {
      setRound(nextRound);
    }
  }, [cocktails]);

  useEffect(() => {
    if (cocktails.length) {
      startRound(1);
    }
  }, [cocktails, startRound]);

  useEffect(() => {
    if (status !== 'playing') return undefined;
    if (timeLeft <= 0) {
      setStatus('timeout');
      setStreak(0);
      return undefined;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, timeLeft]);

  const toggleIngredient = (item) => {
    if (status !== 'playing') return;
    setSelected((prev) => {
      const exists = prev.includes(item);
      const next = exists ? prev.filter((entry) => entry !== item) : [...prev, item];
      return next;
    });
  };

  useEffect(() => {
    if (!target || status !== 'playing') return;
    if (selected.length !== target.correctItems.length) return;

    const isCorrect = target.correctItems.every((item) => selected.includes(item));
    if (isCorrect) {
      const bonus = timeLeft * 5 + streak * 15;
      setScore((prev) => prev + 100 + bonus);
      setStreak((prev) => prev + 1);
      setStatus('success');
      const nextRound = round + 1;
      const timer = setTimeout(() => startRound(nextRound), 900);
      return () => clearTimeout(timer);
    }

    setStatus('error');
    setStreak(0);
    const penaltyTimer = setTimeout(() => {
      setSelected([]);
      setTimeLeft((prev) => Math.max(prev - 5, 0));
      setStatus('playing');
    }, 700);
    return () => clearTimeout(penaltyTimer);
  }, [round, selected, startRound, status, streak, target, timeLeft]);

  const shuffleDeck = () => {
    if (!deck.length) return;
    setDeck((prev) => shuffle(prev));
    setSelected([]);
    setStatus('playing');
  };

  const skipRound = () => {
    setStreak(0);
    startRound(round + 1);
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    startRound(1);
  };

  const progress = target ? Math.min(selected.length / target.correctItems.length, 1) : 0;

  return (
    <div className="min-h-screen bg-suntory-teal text-white flex flex-col pt-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.suntoryglobalspirits.com/sites/default/files/styles/style_20_9/public/2025-02/MakersMark_Loretto_Distillery_2023_header%20%281%29.jpg.webp?itok=fstYXnnp"
          alt=""
          className="h-full w-full object-cover"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-70"
          poster="https://www.suntoryglobalspirits.com/sites/default/files/styles/style_20_9/public/2025-02/MakersMark_Loretto_Distillery_2023_header%20%281%29.jpg.webp?itok=fstYXnnp"
        >
          <source src="https://www.suntoryglobalspirits.com/sites/default/files/2024-03/Home%20Page%20compressed%20%281%29.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-black/35 z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-suntory-teal-light/60 via-suntory-teal/60 to-suntory-dark/80 z-10"></div>
      <motion.div
        className="absolute -top-40 -left-24 h-80 w-80 rounded-full bg-suntory-gold/20 blur-3xl z-20"
        animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-120px] right-[-60px] h-96 w-96 rounded-full bg-suntory-sky/20 blur-3xl z-20"
        animate={{ y: [0, -25, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 right-20 h-56 w-56 rounded-full bg-white/10 blur-2xl z-20"
        animate={{ x: [0, -18, 0], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="fixed top-0 left-0 w-full h-16 bg-white px-4 sm:px-8 flex items-center justify-between z-30 shadow-sm text-suntory-teal">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:text-suntory-sky transition-colors uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} /> Home
        </button>
        <img
          src="https://www.suntoryglobalspirits.com/themes/custom/bsi_tokens_theme/bsi_tokens_subtheme/logo.svg"
          alt="Suntory Global Spirits"
          className="h-8 hidden md:block"
        />
        <div className="font-serif italic text-lg bg-gradient-to-r from-[#f7c46c] via-[#69d2e7] to-[#f3a36b] bg-clip-text text-transparent">
          Mixology Rush
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-30">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3"
          >
            Mixology Rush
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-xs sm:text-sm md:text-base max-w-2xl mx-auto"
          >
            Build the target cocktail before the timer hits zero. Tap the right ingredients, keep your streak alive, and climb the score.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-xs uppercase tracking-widest">
                Round {round}
              </div>
              <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-xs uppercase tracking-widest flex items-center gap-2">
                <Timer size={14} /> {timeLeft}s
              </div>
              <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-xs uppercase tracking-widest">
                Score {score}
              </div>
              <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-xs uppercase tracking-widest flex items-center gap-2">
                <Flame size={14} className="text-suntory-gold" /> {streak}
              </div>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <button
                  onClick={shuffleDeck}
                  className="px-4 py-2 rounded-full border border-white/30 text-white text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <Shuffle size={14} /> Shuffle
                </button>
                <button
                  onClick={skipRound}
                  className="px-4 py-2 rounded-full border border-white/30 text-white text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <RefreshCw size={14} /> Skip
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.4)]"
              style={{ backgroundColor: target?.palette?.base }}
            >
              <div className="absolute inset-0">
                <img src={target?.image} alt="Cocktail selection" className="h-[260px] sm:h-[320px] md:h-[360px] w-full object-cover" />
              </div>
              <div className="absolute inset-0" style={{ backgroundImage: target?.palette?.overlay }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative p-5 sm:p-6 min-h-[260px] sm:min-h-[320px] md:min-h-[360px] flex flex-col">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/70">
                  <span>{getSpiritLabel(target?.categoryName)}</span>
                  <span>{target?.glass}</span>
                </div>
                <div className="mt-auto">
                  <div className="text-xs uppercase tracking-widest text-white/70">Target Cocktail</div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mt-2">
                    {target?.name || 'Loading'}
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-white/15 text-[10px] uppercase tracking-widest">
                      Garnish: {target?.garnish || 'None'}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/15 text-[10px] uppercase tracking-widest">
                      Ingredients: {target?.correctItems?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/60 mb-3">
                <span>Shaker Progress</span>
                <span>{selected.length}/{target?.correctItems?.length || 0}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-suntory-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.length === 0 && (
                  <div className="text-sm text-white/60">Select ingredients from the deck to fill the shaker.</div>
                )}
                {selected.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleIngredient(item)}
                    className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest bg-white/15 hover:bg-white/25 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deck.map((item) => {
                const isSelected = selected.includes(item);
                return (
                  <motion.button
                    key={item}
                    type="button"
                    whileHover={{ scale: 1.02, y: -2 }}
                    animate={status === 'error' && isSelected ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                    className={`rounded-2xl border w-full px-4 py-4 text-left transition-all duration-300 bg-white/5 ${
                      isSelected ? 'border-suntory-gold ring-2 ring-suntory-gold/60 bg-white/15' : 'border-white/15'
                    }`}
                    onClick={() => toggleIngredient(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base sm:text-lg font-serif font-semibold text-white">{item}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 mt-1">Ingredient</div>
                      </div>
                      <Droplets size={18} className={isSelected ? 'text-suntory-gold' : 'text-white/50'} />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="bg-white text-suntory-teal rounded-3xl p-7 shadow-2xl border border-white/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-suntory-mist flex items-center justify-center">
                  <Beaker size={18} className="text-suntory-gold" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-suntory-teal/60">How to play</div>
                  <div className="text-2xl font-serif font-bold">Mix fast, mix clean</div>
                </div>
              </div>
              <div className="text-sm text-suntory-teal/70 space-y-2">
                <p>Select the correct ingredients for the highlighted cocktail before the timer hits zero.</p>
                <p>Wrong mix? You lose 5 seconds and your streak resets.</p>
                <p>Finish fast for bonus points and keep the streak alive.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-full shadow-lg text-xs uppercase tracking-widest flex items-center gap-2 z-40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <XCircle size={14} /> Wrong mix -5s
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-white px-4 py-2 rounded-full shadow-lg text-xs uppercase tracking-widest flex items-center gap-2 z-40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <CheckCircle2 size={14} /> Perfect mix!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === 'timeout' && (
          <motion.div
            className="fixed inset-0 bg-black/65 z-40 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-suntory-teal rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-suntory-mist flex items-center justify-center">
                  <Sparkles size={20} className="text-suntory-gold" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-suntory-teal/60">Time is up</div>
                  <div className="text-2xl font-serif font-bold">Mixology Rush Over</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className="bg-suntory-mist rounded-lg p-3">
                  <div className="uppercase tracking-widest text-suntory-teal/50 mb-1">Score</div>
                  <div className="text-suntory-teal/80">{score}</div>
                </div>
                <div className="bg-suntory-mist rounded-lg p-3">
                  <div className="uppercase tracking-widest text-suntory-teal/50 mb-1">Best Streak</div>
                  <div className="text-suntory-teal/80">{streak}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={resetGame}
                  className="flex-1 px-4 py-3 rounded-full bg-suntory-gold text-suntory-teal font-semibold uppercase tracking-widest text-xs hover:brightness-110 transition-all"
                >
                  Play Again
                </button>
                <button
                  onClick={skipRound}
                  className="flex-1 px-4 py-3 rounded-full border border-suntory-teal/30 text-suntory-teal text-xs uppercase tracking-widest hover:bg-suntory-mist transition-colors"
                >
                  New Cocktail
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CocktailFinderGame;
