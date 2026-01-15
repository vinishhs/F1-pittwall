/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    850: '#151e2e',
                    900: '#0f172a',
                    950: '#020617',
                },
                brand: {
                    red: '#ef4444',
                    cyan: '#06b6d4',
                }
            },
        },
    },
    plugins: [],
}
