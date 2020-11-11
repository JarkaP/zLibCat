const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    future: {
        purgeLayersByDefault: true,
        removeDeprecatedGapUtilities: true,
    },
    purge: ['./src/**/*.html', './src/**/*.vue'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    variants: {
        backgroundColor: [
            'responsive',
            'first',
            'last',
            'even',
            'odd',
            'hover',
            'focus',
        ],
    },
    plugins: [],
}
