import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Filter, BookOpen, X } from 'lucide-react';
import cocktailsData from '../data/recipe-cocktails.json';

const hashString = (value) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

const categoryColor = (category) => {
    const hue = hashString(category) % 360;
    return `hsl(${hue} 70% 55%)`;
};

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const allCocktails = useMemo(() => {
        return cocktailsData.Recipe.flatMap(cat =>
            cat.cocktails.map(c => ({
                ...c,
                categoryName: cat.category,
                searchString: `
                ${c.name} 
                ${cat.category} 
                ${c.ingredients.map(i => i.item).join(' ')} 
                ${c.history ? c.history.join(' ') : ''}
            `.toLowerCase()
            }))
        );
    }, []);

    const categories = useMemo(() => {
        const cats = ['All', ...new Set(cocktailsData.Recipe.map(r => r.category))];
        return cats;
    }, []);

    const filteredCocktails = useMemo(() => {
        return allCocktails.filter(cocktail => {
            const matchesSearch = cocktail.searchString.includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || cocktail.categoryName === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, allCocktails]);

    return (
        <div className="min-h-screen bg-suntory-teal text-white flex flex-col pt-16 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-suntory-teal-light via-suntory-teal to-suntory-teal -z-10 fixed"></div>
            <div className="absolute -top-32 -left-20 h-64 w-64 rounded-full bg-[#f7c46c]/30 blur-3xl -z-10"></div>
            <div className="absolute top-40 right-[-80px] h-72 w-72 rounded-full bg-[#69d2e7]/25 blur-3xl -z-10"></div>
            <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#f3a36b]/20 blur-3xl -z-10"></div>

            {/* Header Bar */}
            <div className="fixed top-0 left-0 w-full h-16 bg-white px-4 sm:px-8 flex items-center justify-between z-30 shadow-sm text-suntory-teal">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-suntory-sky transition-colors uppercase tracking-widest text-xs font-bold">
                    <ArrowLeft size={16} /> Home
                </button>
                <img src="https://www.suntoryglobalspirits.com/themes/custom/bsi_tokens_theme/bsi_tokens_subtheme/logo.svg" alt="Suntory Global Spirits" className="h-8 hidden md:block" />
                <div className="font-serif italic text-lg bg-gradient-to-r from-[#f7c46c] via-[#69d2e7] to-[#f3a36b] bg-clip-text text-transparent">
                    Cocktail Finder
                </div>
            </div>

            {/* Search & Filter Header */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="text-center mb-12">
                    <div className="text-xs uppercase tracking-[0.35em] text-white/40 mb-3">Suntory Library</div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3 sm:mb-4">
                        <span className="bg-gradient-to-r from-[#f7c46c] via-white to-[#69d2e7] bg-clip-text text-transparent">
                            Cocktail Finder
                        </span>
                    </h2>
                    <p className="text-white/70 text-xs sm:text-sm max-w-2xl mx-auto">
                        Explore our premium collection.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-2xl sm:rounded-full border border-white/20 backdrop-blur-sm shadow-[0_0_40px_rgba(105,210,231,0.15)]">
                    {/* Search Input */}
                    <div className="relative w-full md:w-1/2 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-none py-2 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-0"
                        />
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-8 bg-white/20"></div>

                    {/* Category Filter */}
                    <div className="relative w-full md:w-1/3">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full appearance-none bg-transparent border-none py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-0 text-sm cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-suntory-teal text-white">
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-xs">
                            ▼
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                <AnimatePresence>
                    {filteredCocktails.map((cocktail) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={cocktail.name + cocktail.categoryName}
                            className="relative bg-white/10 text-white rounded-3xl overflow-hidden hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)] transition-all group flex flex-col h-full border border-white/10 backdrop-blur-xl"
                        >
                            <div
                                className="h-1 w-full"
                                style={{ background: `linear-gradient(90deg, ${categoryColor(cocktail.categoryName)}, transparent)` }}
                            />
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span
                                            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold mb-2 px-3 py-1 rounded-full border"
                                            style={{ borderColor: categoryColor(cocktail.categoryName), color: categoryColor(cocktail.categoryName) }}
                                        >
                                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: categoryColor(cocktail.categoryName) }}></span>
                                            {cocktail.categoryName.split(/\s*[-\u2013]\s*/)[0].trim()}
                                        </span>
                                        <h3 className="text-xl font-serif font-bold text-white group-hover:text-suntory-gold transition-colors">
                                            {cocktail.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Ingredients Preview */}
                                <div className="mb-4 flex-grow">
                                    <ul className="text-sm text-white/70 space-y-1">
                                        {cocktail.ingredients.slice(0, 3).map((ing, i) => (
                                            <li key={i} className="flex justify-between border-b border-white/10 pb-1">
                                                <span className="font-medium text-white">{ing.item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Expandable Details */}
                                <div className="pt-4 mt-auto">
                                    <details className="group/details">
                                        <summary className="cursor-pointer text-xs uppercase tracking-widest text-suntory-gold font-bold flex items-center gap-2 select-none hover:underline">
                                            View Full Recipe <span className="transition-transform group-open/details:rotate-180">▼</span>
                                        </summary>
                                        <div className="mt-4 space-y-4 text-sm text-white/80 animation-fade-in-down">
                                            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                                <p className="text-white/50 text-xs uppercase mb-2 font-bold">Method</p>
                                                <p>{cocktail.method}</p>
                                            </div>
                                            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                                <p className="text-white/50 text-xs uppercase mb-2 font-bold">Ingredients</p>
                                                <ul className="space-y-1">
                                                    {cocktail.ingredients.map((ing, i) => (
                                                        <li key={i} className="flex justify-between border-b border-white/10 pb-1">
                                                            <span>{ing.item}</span>
                                                            <span className="opacity-60">{ing.amount}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {cocktail.history && (
                                                <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                                    <p className="text-white/50 text-xs uppercase mb-2 font-bold flex items-center gap-2">
                                                        <BookOpen size={12} /> Fun Fact
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {cocktail.history.map((fact, i) => (
                                                            <li key={i} className="text-xs leading-relaxed opacity-90">{fact}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SearchPage;
