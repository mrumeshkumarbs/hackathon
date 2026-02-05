import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trophy, Heart } from 'lucide-react';
import rawQuestions from '../data/expert_questions.json';

const ExpertGamePage = () => {
    const navigate = useNavigate();

    // Normalize data keys
    const questions = useMemo(() => {
        return rawQuestions.map(q => ({
            question: q["Question "] || q.Question,
            answer: q.Answer.toUpperCase()
        }));
    }, []);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, won_level, game_over, completed

    const maxWrongGuesses = 5;
    const currentQuestion = questions[currentQuestionIndex];

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    // Check win/loss conditions
    useEffect(() => {
        if (gameState !== 'playing') return;

        const isProblemSolved = currentQuestion.answer.split('').every(char => {
            return !/[A-Z]/.test(char) || guessedLetters.has(char);
        });

        if (isProblemSolved) {
            setGameState('won_level');
            setScore(s => s + 100 + (maxWrongGuesses - wrongGuesses) * 20); // Bonus for lives left
        } else if (wrongGuesses >= maxWrongGuesses) {
            setGameState('game_over');
        }
    }, [guessedLetters, wrongGuesses, currentQuestion, gameState]);

    const handleGuess = (letter) => {
        if (gameState !== 'playing' || guessedLetters.has(letter)) return;

        const newSet = new Set(guessedLetters);
        newSet.add(letter);
        setGuessedLetters(newSet);

        if (!currentQuestion.answer.includes(letter)) {
            setWrongGuesses(prev => prev + 1);
        }
    };

    const nextLevel = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setGuessedLetters(new Set());
            setWrongGuesses(0);
            setGameState('playing');
        } else {
            setGameState('completed');
        }
    };

    const restartGame = () => {
        setCurrentQuestionIndex(0);
        setGuessedLetters(new Set());
        setWrongGuesses(0);
        setScore(0);
        setGameState('playing');
    };

    return (
        <div className="min-h-screen bg-suntory-teal text-white flex flex-col items-center px-4 sm:px-6 py-8 sm:py-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#004b55] via-suntory-teal to-suntory-dark -z-10"></div>

            {/* Header */}
            <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 z-20 text-center sm:text-left">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-suntory-sky transition-colors uppercase tracking-widest text-xs font-bold">
                    <ArrowLeft size={16} /> Home
                </button>
                <div className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-[#f7c46c] via-[#69d2e7] to-[#f3a36b] bg-clip-text text-transparent">
                    GUESS THE COCKTAIL
                </div>
                <div className="flex items-center gap-2 text-suntory-gold font-bold">
                    <Trophy size={18} /> {score}
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-grow w-full max-w-4xl flex flex-col items-center justify-center relative z-20">

                {gameState === 'completed' ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-white/20"
                    >
                        <Trophy size={64} className="text-suntory-gold mx-auto mb-6" />
                        <h2 className="text-4xl font-serif font-bold mb-4">Cocktail Master!</h2>
                        <p className="text-xl mb-8 opacity-80">You've completed all challenges.</p>
                        <div className="text-6xl font-bold text-suntory-sky mb-8">{score}</div>
                        <button onClick={restartGame} className="px-8 py-3 bg-white text-suntory-teal rounded-full font-bold hover:bg-suntory-sky hover:text-white transition-colors">
                            Play Again
                        </button>
                    </motion.div>
                ) : gameState === 'game_over' ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center bg-red-900/20 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-red-500/20"
                    >
                        <h2 className="text-4xl font-serif font-bold mb-4 text-red-400">Out of Lives</h2>
                        <p className="text-lg mb-4">The answer was:</p>
                        <p className="text-3xl font-bold text-white mb-8 tracking-widest">{currentQuestion.answer}</p>
                        <p className="mb-8">Final Score: {score}</p>
                        <button onClick={restartGame} className="px-8 py-3 bg-white text-suntory-teal rounded-full font-bold hover:bg-suntory-sky hover:text-white transition-colors">
                            Try Again
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Progress */}
                        <div className="flex flex-col sm:flex-row justify-between w-full mb-6 sm:mb-8 px-2 sm:px-4 opacity-60 text-xs uppercase tracking-widest gap-3 sm:gap-0">
                            <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
                            <div className="flex gap-1">
                                {[...Array(maxWrongGuesses)].map((_, i) => (
                                    <Heart key={i} size={16} className={i < (maxWrongGuesses - wrongGuesses) ? "text-red-400 fill-red-400" : "text-white/20"} />
                                ))}
                            </div>
                        </div>

                        {/* Question */}
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 w-full mb-8 sm:mb-12 text-center"
                        >
                            <h3 className="text-lg sm:text-xl md:text-2xl font-serif leading-relaxed text-white/90">
                                "{currentQuestion.question}"
                            </h3>
                        </motion.div>

                        {/* Word Display */}
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12">
                            {currentQuestion.answer.split('').map((char, index) => (
                                <div key={index} className={`w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 flex items-center justify-center text-2xl sm:text-3xl font-bold border-b-4 ${guessedLetters.has(char) || !/[A-Z]/.test(char) ? 'border-white/50 text-white' : 'border-white/20 text-transparent'}`}>
                                    {!/[A-Z]/.test(char) ? char : (guessedLetters.has(char) || gameState === 'won_level' ? char : '_')}
                                </div>
                            ))}
                        </div>

                        {/* Keyboard */}
                        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mb-8">
                            {alphabet.map(letter => {
                                const isGuessed = guessedLetters.has(letter);
                                const isCorrect = isGuessed && currentQuestion.answer.includes(letter);
                                const isWrong = isGuessed && !currentQuestion.answer.includes(letter);

                                return (
                                    <button
                                        key={letter}
                                        onClick={() => handleGuess(letter)}
                                        disabled={isGuessed || gameState !== 'playing'}
                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-bold transition-all
                                            ${isCorrect ? 'bg-suntory-sky text-white opacity-50' :
                                                isWrong ? 'bg-red-500/20 text-red-400 opacity-40' :
                                                    'bg-white text-suntory-teal hover:bg-suntory-sky hover:text-white'}
                                            ${(isGuessed) ? 'cursor-not-allowed transform scale-95' : 'hover:-translate-y-1 shadow-lg'}
                                        `}
                                    >
                                        {letter}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Level Overlay */}
                        <AnimatePresence>
                            {gameState === 'won_level' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 z-50 flex items-center justify-center bg-suntory-teal/90 backdrop-blur-sm rounded-3xl"
                                >
                                    <div className="text-center">
                                        <h3 className="text-4xl font-serif font-bold text-suntory-gold mb-4">Correct!</h3>
                                        <p className="text-2xl mb-8">{currentQuestion.answer}</p>
                                        <button onClick={nextLevel} className="px-8 py-3 bg-white text-suntory-teal rounded-full font-bold hover:scale-105 transition-transform">
                                            Next Challenge
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
};

export default ExpertGamePage;
