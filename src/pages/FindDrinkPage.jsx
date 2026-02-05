import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wine, Martini, GlassWater, ArrowLeft, RefreshCw, X, Check, Sparkles } from 'lucide-react';
import { useCocktailRecommendation } from '../hooks/useCocktailRecommendation';
 
const FindDrinkPage = () => {
    const navigate = useNavigate();
    const { getRecommendations } = useCocktailRecommendation();
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState({ mood: null, base: null, occasion: null, glass: null });
    const [result, setResult] = useState(null);
 
    const moods = [
        {
            id: 'refreshing',
            label: 'Refreshing & Crisp',
            icon: <GlassWater />,
            aura: 'Glacier Aura',
            glow: 'shadow-[0_0_28px_rgba(56,189,248,0.35)]',
            gradient: 'from-cyan-300/30 via-sky-400/20 to-suntory-teal/20',
        },
        {
            id: 'strong',
            label: 'Spirit Forward',
            icon: <Martini />,
            aura: 'Ember Aura',
            glow: 'shadow-[0_0_28px_rgba(245,158,11,0.35)]',
            gradient: 'from-amber-300/30 via-orange-400/20 to-suntory-teal/20',
        },
        {
            id: 'fruity',
            label: 'Sweet & Fruity',
            icon: <Wine />,
            aura: 'Bloom Aura',
            glow: 'shadow-[0_0_28px_rgba(244,114,182,0.35)]',
            gradient: 'from-rose-300/30 via-pink-400/20 to-suntory-teal/20',
        },
        {
            id: 'surprise',
            label: 'Surprise Me',
            icon: <RefreshCw />,
            aura: 'Wildcard Aura',
            glow: 'shadow-[0_0_28px_rgba(147,197,253,0.35)]',
            gradient: 'from-indigo-300/30 via-sky-400/20 to-suntory-teal/20',
        },
    ];
 
    const bases = [
        { id: 'vodka', label: 'Vodka' },
        { id: 'gin', label: 'Gin' },
        { id: 'whisky', label: 'Whisky' },
        { id: 'agave', label: 'Tequila / Mezcal' },
        { id: 'rum', label: 'Rum' },
        { id: 'any', label: 'No Preference' },
    ];
 
    const occasions = [
        { id: 'chill', label: 'Chill Night' },
        { id: 'party', label: 'Party Mode' },
        { id: 'date', label: 'Date Night' },
        { id: 'celebration', label: 'Celebration' },
    ];
 
    const glassware = [
        { id: 'coupe', label: 'Coupe' },
        { id: 'rocks', label: 'Rocks' },
        { id: 'highball', label: 'Highball' },
        { id: 'any', label: 'Any Glass' },
    ];
 
    const handleMoodSelect = (moodId) => {
        setSelections(prev => ({ ...prev, mood: moodId }));
        setStep(1);
    };
 
    const handleBaseSelect = (baseId) => {
        setSelections(prev => ({ ...prev, base: baseId }));
        setStep(2);
    };
 
    const handleOccasionSelect = (occasionId) => {
        setSelections(prev => ({ ...prev, occasion: occasionId }));
        setStep(3);
    };
 
    const handleGlassSelect = (glassId) => {
        const finalSelections = { ...selections, glass: glassId };
        setSelections(finalSelections);
 
        // Calculate result
        const recs = getRecommendations(finalSelections);
        if (recs.length > 0) {
            const randomPick = recs[Math.floor(Math.random() * recs.length)];
            setResult(randomPick);
        } else {
            setResult('none');
        }
        setStep(4);
    };
 
    const resetQuiz = () => {
        setStep(0);
        setSelections({ mood: null, base: null, occasion: null, glass: null });
        setResult(null);
    };
 
    const steps = ['Vibe', 'Spirit', 'Occasion', 'Glass', 'Reward'];
    const rarityMap = {
        refreshing: { label: 'Uncommon', color: 'text-cyan-200', ring: 'ring-cyan-300/30' },
        strong: { label: 'Epic', color: 'text-amber-200', ring: 'ring-amber-300/30' },
        fruity: { label: 'Rare', color: 'text-rose-200', ring: 'ring-rose-300/30' },
        surprise: { label: 'Legendary', color: 'text-indigo-200', ring: 'ring-indigo-300/30' },
    };
 
    return (
        <div className="min-h-screen bg-suntory-dark text-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://www.suntoryglobalspirits.com/sites/default/files/styles/original/public/2024-04/James%20Beam%20Distilling%20_header%20banner.jpg.webp?itok=GgAl3pZw"
                    alt=""
                    className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black/35"></div>
            </div>
            {/* Ambient background */}
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,_rgba(0,151,218,0.18),_transparent_55%)]" />
            <div className="absolute -top-24 -left-20 z-10 w-80 h-80 bg-suntory-sky/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-24 -right-10 z-10 w-96 h-96 bg-amber-400/15 blur-3xl rounded-full" />
            <div className="absolute inset-0 z-10 opacity-20 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.12)_0,_rgba(255,255,255,0)_45%),_radial-gradient(circle_at_80%_10%,_rgba(255,255,255,0.1)_0,_rgba(255,255,255,0)_35%)]" />
 
            {/* Header Bar */}
            <div className="absolute top-0 left-0 w-full h-16 bg-white/90 backdrop-blur px-6 md:px-8 flex items-center justify-between z-30 shadow-sm">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-suntory-teal hover:text-suntory-teal-light transition-colors uppercase tracking-widest text-xs font-bold">
                    <ArrowLeft size={16} /> Home
                </button>
                <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-suntory-sky" />
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] bg-gradient-to-r from-[#f7c46c] via-[#69d2e7] to-[#f3a36b] bg-clip-text text-transparent">
                        Drink Quest
                    </span>
                </div>
                <div className="flex items-center gap-2 text-suntory-teal">
                    <span className="text-[10px] uppercase tracking-[0.2em]">XP</span>
                    <span className="font-bold">240</span>
                </div>
            </div>
 
            {/* Progress */}
            <div className="w-full max-w-2xl mt-20 md:mt-24 relative z-20">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60 mb-3">
                    <span>Quest Progress</span>
                    <span>Stage {step + 1} / 5</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full mb-5 relative overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-suntory-sky via-amber-300 to-rose-300"
                        animate={{ width: `${((step + 1) / 5) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                    />
                </div>
                <div className="flex items-center justify-between">
                    {steps.map((label, index) => {
                        const active = index <= step;
                        return (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${active ? 'bg-white text-suntory-teal border-white' : 'border-white/30 text-white/50'}`}>
                                    {index + 1}
                                </div>
                                <span className={`text-xs uppercase tracking-[0.2em] ${active ? 'text-white' : 'text-white/40'}`}>{label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
 
            <AnimatePresence mode="wait">
                {/* Step 1: Mood */}
                {step === 0 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-3xl text-center relative z-20"
                    >
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Stage 1</p>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Choose your vibe aura</h2>
                            <p className="text-white/70 mt-3">Unlock a cocktail that matches your mood.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {moods.map(mood => (
                                <motion.button
                                    key={mood.id}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleMoodSelect(mood.id)}
                                    className={`group relative p-6 rounded-3xl border border-white/15 bg-gradient-to-br ${mood.gradient} backdrop-blur-md overflow-hidden ${mood.glow}`}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.35),_transparent_55%)]" />
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="text-left">
                                            <p className="text-xs uppercase tracking-[0.25em] text-white/60">{mood.aura}</p>
                                            <h3 className="text-2xl font-serif font-bold text-white mt-2">{mood.label}</h3>
                                            <p className="text-sm text-white/70 mt-2">Tap to lock this aura</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white/80">
                                            {mood.icon}
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
 
                {/* Step 2: Base Spirit */}
                {step === 1 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-3xl text-center relative z-20"
                    >
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Stage 2</p>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Choose your spirit rune</h2>
                            <p className="text-white/70 mt-3">Your base spirit shapes the quest reward.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {bases.map(base => (
                                <motion.button
                                    key={base.id}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleBaseSelect(base.id)}
                                    className="relative p-4 md:p-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur flex flex-col gap-2 items-center justify-center text-center hover:bg-white/15 transition-all"
                                >
                                    <span className="text-xs uppercase tracking-[0.2em] text-white/60">Rune</span>
                                    <span className="text-lg font-semibold">{base.label}</span>
                                </motion.button>
                            ))}
                        </div>
                        <button onClick={resetQuiz} className="mt-6 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white/90 transition-colors">Reset Quest</button>
                    </motion.div>
                )}
 
                {step === 2 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-3xl text-center relative z-20"
                    >
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Stage 3</p>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Choose your occasion</h2>
                            <p className="text-white/70 mt-3">Set the vibe for your reward.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {occasions.map(occasion => (
                                <motion.button
                                    key={occasion.id}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleOccasionSelect(occasion.id)}
                                    className="relative p-4 md:p-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur flex flex-col gap-2 items-center justify-center text-center hover:bg-white/15 transition-all"
                                >
                                    <span className="text-xs uppercase tracking-[0.2em] text-white/60">Scene</span>
                                    <span className="text-lg font-semibold">{occasion.label}</span>
                                </motion.button>
                            ))}
                        </div>
                        <button onClick={resetQuiz} className="mt-6 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white/90 transition-colors">Reset Quest</button>
                    </motion.div>
                )}
 
                {step === 3 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-3xl text-center relative z-20"
                    >
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Stage 4</p>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Choose your glass</h2>
                            <p className="text-white/70 mt-3">Presentation matters.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {glassware.map(glass => (
                                <motion.button
                                    key={glass.id}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleGlassSelect(glass.id)}
                                    className="relative p-4 md:p-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur flex flex-col gap-2 items-center justify-center text-center hover:bg-white/15 transition-all"
                                >
                                    <span className="text-xs uppercase tracking-[0.2em] text-white/60">Vessel</span>
                                    <span className="text-lg font-semibold">{glass.label}</span>
                                </motion.button>
                            ))}
                        </div>
                        <button onClick={resetQuiz} className="mt-6 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white/90 transition-colors">Reset Quest</button>
                    </motion.div>
                )}
 
                {/* Step 3: Result */}
                {step === 4 && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl relative z-20"
                    >
                        {result === 'none' ? (
                            <div className="text-center">
                                <h3 className="text-2xl text-white mb-4">No match found.</h3>
                                <button onClick={resetQuiz} className="px-6 py-2 bg-white text-suntory-teal rounded-full font-medium">Try again</button>
                            </div>
                        ) : (
                            <div className="relative rounded-[32px] bg-white/95 text-suntory-teal p-6 md:p-8 shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,151,218,0.12),_transparent_60%)]" />
                                <button onClick={resetQuiz} className="absolute top-4 right-4 p-2 text-suntory-teal/50 hover:text-suntory-teal">
                                    <X size={20} />
                                </button>
 
                                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                                    <div>
                                        <span className="text-xs uppercase tracking-[0.2em] text-suntory-teal/60">Quest Reward</span>
                                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-suntory-teal mt-2">{result.name}</h2>
                                        <span className="text-sm text-suntory-sky font-medium">{result.categoryName}</span>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] ring-1 ${rarityMap[selections.mood]?.ring || 'ring-suntory-teal/20'} ${rarityMap[selections.mood]?.color || 'text-suntory-teal'}`}>
                                        {rarityMap[selections.mood]?.label || 'Special'}
                                    </div>
                                </div>
 
                                <div className="relative z-10 grid md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <h4 className="text-xs uppercase tracking-widest text-suntory-teal/50 mb-2 border-b border-suntory-teal/10 pb-1">Ingredients</h4>
                                        <ul className="text-sm space-y-2">
                                            {result.ingredients.map((ing, i) => (
                                                <li key={i} className="flex justify-between items-center bg-suntory-mist p-2 rounded-lg">
                                                    <span className="font-medium">{ing.item}</span>
                                                    <span className="text-suntory-teal/70">{ing.amount}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
 
                                    <div>
                                        <h4 className="text-xs uppercase tracking-widest text-suntory-teal/50 mb-2">Preparation</h4>
                                        <p className="text-sm leading-relaxed text-suntory-teal/80">{result.method}</p>
                                        {result.history && (
                                            <div className="mt-4">
                                                <h4 className="text-xs uppercase tracking-widest text-suntory-teal/50 mb-2 border-b border-suntory-teal/10 pb-1">Lore</h4>
                                                <ul className="text-sm space-y-2 mt-2">
                                                    {result.history.map((fact, i) => (
                                                        <li key={i} className="text-suntory-teal/80 italic text-xs bg-suntory-mist p-2 rounded-lg">
                                                            "{fact}"
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
 
                                <div className="relative z-10 flex flex-col md:flex-row gap-3">
                                    <button onClick={resetQuiz} className="flex-1 py-4 bg-suntory-teal text-white rounded-full font-medium uppercase tracking-widest hover:bg-suntory-teal-light transition-colors flex items-center justify-center gap-2">
                                        <RefreshCw size={16} /> Roll Again
                                    </button>
                                    <button onClick={() => navigate('/')} className="flex-1 py-4 bg-white border border-suntory-teal/20 text-suntory-teal rounded-full font-medium uppercase tracking-widest hover:bg-suntory-mist transition-colors flex items-center justify-center gap-2">
                                        <Check size={16} /> Claim & Exit
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
 
export default FindDrinkPage;
 
