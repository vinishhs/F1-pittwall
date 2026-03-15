/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                terminal: {
                    base: '#0a0e17',
                    surface: '#0d1117',
                    elevated: '#151c28',
                    border: '#1a2332',
                },
                brand: {
                    cyan: '#00f0ff',
                    crimson: '#e53935',
                },
            },
            fontFamily: {
                mono: ['"Share Tech Mono"', 'monospace'],
            },
            boxShadow: {
                'cyan-glow': '0 0 15px rgba(0, 240, 255, 0.15), 0 0 30px rgba(0, 240, 255, 0.05)',
                'crimson-glow': '0 0 15px rgba(229, 57, 53, 0.15), 0 0 30px rgba(229, 57, 53, 0.05)',
            },
        },
    },
    plugins: [],
}
