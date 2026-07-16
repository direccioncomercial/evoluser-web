/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
        colors: {
            brandBlue: '#13293D',
            brandGreen: '#3E8E8E',
            brandGray: '#F7F9FC',
            brandText: '#1F2937',
        },
        fontFamily: {
            sans: ['Mulish', 'sans-serif'],
            heading: ['Montserrat', 'sans-serif'],
        },
        boxShadow: {
            'card': '0 4px 20px rgba(0,0,0,0.06)',
            'brand': '0 10px 40px rgba(62, 142, 142, 0.25)',
            'neon-light': '0 0 15px rgba(62, 142, 142, 0.5), 0 0 30px rgba(255, 255, 255, 0.4)',
            'hover': '0 20px 40px rgba(19, 41, 61, 0.12)'
        },
        animation: {
            'pop-in': 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            'slide-up-fade': 'slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            'float': 'float 6s ease-in-out infinite',
            'glow-latency': 'glowLatency 4s infinite ease-in-out',
        },
        keyframes: {
            popIn: { '0%': { opacity: 0, transform: 'scale(0.98)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
            slideUpFade: { '0%': { opacity: 0, transform: 'translateY(40px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
            float: {
                '0%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-10px)' },
                '100%': { transform: 'translateY(0px)' }
            },
            glowLatency: {
                '0%, 100%': {
                    filter: 'drop-shadow(0 0 5px rgba(62, 142, 142, 0.4))',
                    transform: 'scale(1)'
                },
                '50%': {
                    filter: 'drop-shadow(0 0 20px rgba(62, 142, 142, 0.7))',
                    transform: 'scale(1.03)'
                }
            }
        }
    }
  },
  plugins: [],
}
