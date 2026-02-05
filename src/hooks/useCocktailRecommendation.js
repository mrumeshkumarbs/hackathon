import { useState, useMemo } from 'react';
import cocktailsData from '../data/recipe-cocktails.json';

// Helper to categorize cocktails based on ingredients
const analyzeProfile = (cocktail) => {
    const ingredients = cocktail.ingredients.map(i => i.item.toLowerCase());
    const strIngredients = ingredients.join(' ');
    const method = cocktail.method.toLowerCase();

    // Base Spirit
    let base = 'other';
    if (cocktail.category) {
        if (cocktail.category.toLowerCase().includes('vodka')) base = 'vodka';
        else if (cocktail.category.toLowerCase().includes('gin')) base = 'gin';
        else if (cocktail.category.toLowerCase().includes('tequila') || cocktail.category.toLowerCase().includes('mezcal')) base = 'agave';
        else if (cocktail.category.toLowerCase().includes('bourbon') || cocktail.category.toLowerCase().includes('whiskey') || cocktail.category.toLowerCase().includes('whisky') || cocktail.category.toLowerCase().includes('rye')) base = 'whisky';
        else if (cocktail.category.toLowerCase().includes('rum')) base = 'rum';
    }

    // Taste Profile
    let profiles = [];

    // Refreshing / Citrusy
    if (ingredients.some(i => i.includes('lime') || i.includes('lemon') || i.includes('soda') || i.includes('tonic') || i.includes('ginger beer'))) {
        profiles.push('refreshing');
    }

    // Sweet / Fruity
    if (ingredients.some(i => i.includes('juice') || i.includes('syrup') || i.includes('grenadine') || i.includes('cassis') || i.includes('cream'))) {
        profiles.push('fruity');
    }

    // Spirit Forward / Strong
    if ((ingredients.includes('vermouth') || ingredients.includes('bitters')) && !ingredients.some(i => i.includes('juice') && !i.includes('lime'))) {
        // Exclusion for sour builds handled loosely
        profiles.push('strong');
    }

    // A simple fallback if no profile detected (unlikely)
    if (profiles.length === 0) profiles.push('balanced');

    return { base, profiles };
};

export const useCocktailRecommendation = () => {
    const [answers, setAnswers] = useState({});

    const allCocktails = useMemo(() => {
        return cocktailsData.Recipe.flatMap(cat =>
            cat.cocktails.map(c => ({
                ...c,
                categoryName: cat.category,
                ...analyzeProfile({ ...c, category: cat.category })
            }))
        );
    }, []);

    const getRecommendations = (userPreferences) => {
        // userPreferences: { mood: 'refreshing' | 'strong' | 'fruity' | 'surprise', base: 'vodka' | 'gin' | 'whisky' | 'agave' | 'rum' | 'any' }

        return allCocktails.filter(c => {
            const matchBase = userPreferences.base === 'any' || c.base === userPreferences.base;
            const matchMood = userPreferences.mood === 'surprise' || c.profiles.includes(userPreferences.mood);
            return matchBase && matchMood;
        });
    };

    return {
        getRecommendations,
        allCocktails
    };
};
