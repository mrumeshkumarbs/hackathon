import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Sparkles, Check, X, Timer, RefreshCw } from 'lucide-react';
import cocktailsData from '../data/recipe-cocktails.json';

const gameImages = [
  {
    imageUrl: 'https://house.suntory.com/sites/default/files/styles/card_9_16/public/2025-02/CDP_Haku_Lychee_Product.jpg.webp?itok=7Piv2iib',
    targetName: 'Classic Vodka Martini',
    displayName: 'Haku Lychee Martini'
  },
  {
    imageUrl: 'https://house.suntory.com/sites/default/files/styles/card_9_16/public/2025-04/New%20Project%20%282%29.png.webp?itok=emCCghoC',
    targetName: 'Lemondrop Martini',
    displayName: 'Yuzu Martin-ish with Haku'
  },
  {
    imageUrl: 'https://house.suntory.com/sites/default/files/2024-03/ROKU_SAKURA_APERITIF_LTO_SERVE_sRGB_0.jpg',
    targetName: 'French 75',
    displayName: 'Roku Sakura Aperitif'
  },
  {
    imageUrl: 'https://house.suntory.com/sites/default/files/2022-09/SDP_OntheRocks.jpg',
    targetName: 'Japanese Highball',
    displayName: 'Japanese Whisky on the Rocks'
  }
];

const ROUND_DURATION = 12;

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

const buildRounds = (cocktails) => {
  const optionPool = gameImages.map((entry) => entry.displayName);
  return gameImages.map((entry, index) => {
    const target =
      cocktails.find((item) => item.name === entry.targetName) ||
      cocktails[Math.floor(Math.random() * cocktails.length)];
    const options = shuffle(optionPool);

    return {
      id: index + 1,
      imageUrl: entry.imageUrl,
      target,
      options,
      displayName: entry.displayName
    };
  });
};

const BottleWhispererPage = () => {
  const navigate = useNavigate();
  const cocktails = useMemo(() => {
    return cocktailsData.Recipe.flatMap((category) =>
      category.cocktails.map((cocktail) => ({
        ...cocktail,
        categoryName: category.category
      }))
    );
  }, []);

  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [xp, setXp] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameState, setGameState] = useState('playing');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Loading cocktail...');
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [timerActive, setTimerActive] = useState(false);

  const currentQuestion = rounds[currentRound];

  const startGame = useCallback(() => {
    if (!cocktails.length) return;
    setRounds(buildRounds(cocktails));
    setCurrentRound(0);
    setXp(0);
    setGameState('playing');
  }, [cocktails]);

  useEffect(() => {
    if (cocktails.length) {
      startGame();
    }
  }, [cocktails, startGame]);

  useEffect(() => {
    if (!currentQuestion) return;

    setImageLoaded(false);
    setImageError(false);
    setLoadingStatus('Loading cocktail...');
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(ROUND_DURATION);
    setTimerActive(false);

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setLoadingStatus('Ready');
      setTimerActive(true);
    };
    img.onerror = () => {
      setImageError(true);
      setLoadingStatus('Failed to load image.');
    };
    img.src = currentQuestion.imageUrl;
  }, [currentQuestion]);

  useEffect(() => {
    if (!timerActive || isAnswered) return undefined;
    if (timeLeft <= 0) {
      setTimerActive(false);
      setIsAnswered(true);
      return undefined;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, isAnswered, timeLeft]);

  const handleAnswer = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setTimerActive(false);

    const isCorrect = answer === currentQuestion.displayName;
    if (isCorrect) {
      const baseXP = 120;
      const timeBonus = Math.floor((timeLeft / ROUND_DURATION) * 100);
      setXp((prev) => prev + baseXP + timeBonus);
    }
  };

  const handleNextRound = () => {
    if (currentRound < rounds.length - 1) {
      setCurrentRound((prev) => prev + 1);
    } else {
      setGameState('completed');
    }
  };

  const restartGame = () => {
    startGame();
  };

  const target = currentQuestion?.target;
  const hintIngredients = target?.ingredients?.slice(0, 2).map((item) => item.item) || [];

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.suntoryglobalspirits.com/sites/default/files/styles/style_20_9/public/2024-03/A-bottle-and-glass-of-On-the-Rocks-cocktail_Header-new.jpg.webp?itok=jbPzSzqx"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35"></div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-suntory-teal-light/35 via-suntory-teal/45 to-suntory-dark/65 z-10"></div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:text-suntory-gold transition-colors uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} /> Home
        </button>
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-serif font-bold bg-gradient-to-r from-[#f7c46c] via-[#69d2e7] to-[#f3a36b] bg-clip-text text-transparent">
            Find the Cocktail
          </h1>
          <p className="text-xs text-white/60 uppercase tracking-wider">Image clue challenge</p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
          <Trophy size={18} className="text-suntory-gold" />
          <span className="font-bold text-suntory-gold">{xp} XP</span>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 py-8 sm:py-6 relative z-20">
        {gameState === 'completed' ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-white/20 max-w-md"
          >
            <Sparkles size={64} className="text-suntory-gold mx-auto mb-6" />
            <h2 className="text-4xl font-serif font-bold mb-4">Round Complete</h2>
            <p className="text-lg mb-6 opacity-80">You matched all cocktail images.</p>
            <div className="mb-8">
              <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Total Score</p>
              <div className="text-6xl font-bold text-suntory-gold mb-2">{xp} XP</div>
              <p className="text-sm text-white/60">Speed bonus included</p>
            </div>
            <button
              onClick={restartGame}
              className="px-8 py-3 bg-suntory-gold text-suntory-teal rounded-full font-bold hover:brightness-110 transition-all shadow-lg"
            >
              Play Again
            </button>
          </motion.div>
        ) : (
          <div className="w-full max-w-5xl grid lg:grid-cols-[1.05fr_0.95fr] gap-6 sm:gap-8 items-start">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-xs uppercase tracking-widest">
                  Round {currentRound + 1} of {rounds.length}
                </div>
                <div className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Timer size={14} /> {timeLeft}s
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="text-center mb-4">
                  <p className={`text-sm font-medium ${imageError ? 'text-red-400' : imageLoaded ? 'text-green-400' : 'text-suntory-gold'}`}>
                    {loadingStatus}
                  </p>
                </div>

                <div className="relative w-full aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-2xl bg-white/10">
                  {!imageLoaded && !imageError && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      style={{
                        animation: 'shimmer 2s infinite',
                        backgroundSize: '200% 100%'
                      }}
                    />
                  )}

                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                      <div>
                        <p className="text-red-400 mb-4">Image failed to load</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="mt-2 px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}

                  {imageLoaded && (
                    <motion.img
                      src={currentQuestion.imageUrl}
                      alt="Cocktail visual"
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.08, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#f7c46c]/20 via-white/10 to-[#69d2e7]/15 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_60%)] opacity-60"></div>
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[#f3a36b]/40 blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-white/70">Clue Board</div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">Find the cocktail</h3>
                    </div>
                    <div className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.25em] bg-white/10 text-white/80 border border-white/20">
                      Stage {currentRound + 1}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-white/80">
                    Image label: <span className="font-semibold text-suntory-gold">{currentQuestion?.displayName}</span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                      <div className="uppercase tracking-widest text-white/50 mb-1">Spirit</div>
                      <div className="text-white">{getSpiritLabel(target?.categoryName)}</div>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                      <div className="uppercase tracking-widest text-white/50 mb-1">Glass</div>
                      <div className="text-white">{target?.glass}</div>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                      <div className="uppercase tracking-widest text-white/50 mb-1">Garnish</div>
                      <div className="text-white">{target?.garnish || 'None'}</div>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                      <div className="uppercase tracking-widest text-white/50 mb-1">Ingredients</div>
                      <div className="text-white">{target?.ingredients?.length || 0}</div>
                    </div>
                  </div>

                  {hintIngredients.length > 0 && (
                    <div className="mt-5">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-white/70">Signature notes</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {hintIngredients.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] uppercase tracking-widest text-white/90"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {currentQuestion?.options.map((option) => {
                  const isCorrect = option === currentQuestion?.displayName;
                  const isSelected = option === selectedAnswer;

                  let buttonClass = 'w-full py-3 sm:py-4 px-4 sm:px-6 rounded-full border-2 font-medium text-sm sm:text-base transition-all ';

                  if (isAnswered) {
                    if (isCorrect) {
                      buttonClass += 'border-emerald-400 bg-emerald-400/10 text-emerald-100';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += 'border-red-500 bg-red-500/10 text-red-100';
                    } else {
                      buttonClass += 'border-white/10 text-white/30';
                    }
                  } else {
                    buttonClass += 'border-white/20 text-white hover:border-suntory-gold hover:bg-white/5 hover:scale-[1.01]';
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                      className={`${buttonClass} flex items-center justify-between`}
                    >
                      <span>{option}</span>
                      {isAnswered && (
                        <span>
                          {isCorrect ? <Check size={20} className="text-emerald-300" /> : null}
                          {!isCorrect && isSelected ? <X size={20} className="text-red-300" /> : null}
                        </span>
                      )}
                    </button>
                  );
                })}

                {isAnswered && (
                  <button
                    onClick={handleNextRound}
                    className="w-full mt-4 py-3 sm:py-4 px-4 sm:px-6 rounded-full bg-suntory-gold text-suntory-teal font-bold text-sm sm:text-base hover:brightness-110 transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                  >
                    {currentRound < rounds.length - 1 ? 'Next Cocktail' : 'Finish Game'}
                  </button>
                )}

                {!isAnswered && (
                  <button
                    onClick={() => setSelectedAnswer(null)}
                    className="w-full mt-2 py-3 px-4 sm:px-6 rounded-full border border-white/20 text-xs uppercase tracking-widest text-white/70 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} /> Clear Selection
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottleWhispererPage;
