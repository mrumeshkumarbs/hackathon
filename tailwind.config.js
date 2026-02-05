/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                suntory: {
                    // New Gemba-inspired palette
                    teal: '#00262B', // Deep background teal
                    'teal-light': '#003840', // Slightly lighter for cards/gradients
                    sky: '#0097DA', // Brand cyan/blue
                    dark: '#001E22', // Replaced the old black with deep teal
                    mist: '#E6F4F1', // Very light teal-white
                    white: '#FFFFFF',
                    gold: '#C5A059', // Kept for accents, though used sparingly
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
