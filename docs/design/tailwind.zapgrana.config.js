/**
 * Zapgrana - Tailwind CSS Theme Configuration
 *
 * Este arquivo contém a configuração do tema Tailwind para o Zapgrana,
 * baseado nas diretrizes de design do projeto.
 *
 * Uso: Importe este arquivo no seu tailwind.config.js principal
 *
 * @example
 * // tailwind.config.js
 * import zapgranaTheme from './docs/design/tailwind.zapgrana.config.js'
 * export default {
 *   theme: {
 *     extend: zapgranaTheme.theme.extend
 *   }
 * }
 */

export default {
  theme: {
    extend: {
      // ======================
      // CORES
      // ======================
      colors: {
        // Cores Primárias (Verde - Confiança e Crescimento)
        primary: {
          DEFAULT: '#006b2c',
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#00873a',
          600: '#006b2c',
          700: '#005923',
          800: '#00471c',
          900: '#003614',
          950: '#002810',
        },

        // Cores Secundárias (Azul - Informação)
        secondary: {
          DEFAULT: '#0058be',
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#0058be',
          600: '#004a9e',
          700: '#003c7e',
          800: '#002e5e',
          900: '#00203e',
        },

        // Cores de Perigo/Alerta (Vermelho - Despesas, Erros)
        danger: {
          DEFAULT: '#bb0112',
          50: '#ffebee',
          100: '#ffcdd2',
          200: '#ef9a9a',
          300: '#e57373',
          400: '#ef5350',
          500: '#bb0112',
          600: '#a00010',
          700: '#85000e',
          800: '#6a000b',
          900: '#4f0008',
        },

        // Cores de Aviso (Amarelo/Laranja)
        warning: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },

        // Cores de Sucesso (Verde claro)
        success: {
          DEFAULT: '#7ffc97',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#7ffc97',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },

        // Cores de Superfície
        surface: {
          DEFAULT: '#f9f9ff',
          lowest: '#ffffff',
          low: '#f1f3ff',
          medium: '#e9edff',
          high: '#e1e8fd',
          highest: '#d5dcf5',
        },

        // Cores de Texto
        text: {
          primary: '#191c20',
          secondary: '#43474e',
          muted: '#73777f',
          disabled: '#9ca3af',
        },

        // Cores de Borda
        border: {
          DEFAULT: '#c3c6cf',
          strong: '#73777f',
          subtle: '#e5e7eb',
        },

        // Cores Funcionais
        income: '#00873a',      // Receitas
        expense: '#bb0112',     // Despesas
        whatsapp: '#25D366',    // WhatsApp
        installment: '#0058be', // Parcelas
      },

      // ======================
      // TIPOGRAFIA
      // ======================
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        // Headlines
        'display-1': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],    // 64px
        'display-2': ['3rem', { lineHeight: '1.15', fontWeight: '700' }],   // 48px
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],         // 40px
        'h2': ['2rem', { lineHeight: '1.25', fontWeight: '600' }],          // 32px
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],         // 24px
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],        // 20px

        // Body
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],  // 18px
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],         // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],  // 14px

        // Caption/Labels
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],   // 12px
        'overline': ['0.625rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }], // 10px
      },

      // ======================
      // ESPAÇAMENTO
      // ======================
      spacing: {
        '4.5': '1.125rem',  // 18px
        '13': '3.25rem',    // 52px
        '15': '3.75rem',    // 60px
        '18': '4.5rem',     // 72px
        '22': '5.5rem',     // 88px
        '26': '6.5rem',     // 104px
        '30': '7.5rem',     // 120px
      },

      // ======================
      // BORDER RADIUS
      // ======================
      borderRadius: {
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        '4xl': '2rem',      // 32px
      },

      // ======================
      // SOMBRAS
      // ======================
      boxShadow: {
        'card': '0px 4px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0px 8px 24px rgba(0, 0, 0, 0.12)',
        'elevated': '0px 16px 48px rgba(20, 27, 43, 0.16)',
        'editorial': '0px 24px 48px -12px rgba(20, 27, 43, 0.08)',
        'input-focus': '0 0 0 3px rgba(0, 107, 44, 0.1)',
        'input-error': '0 0 0 3px rgba(187, 1, 18, 0.1)',
        'button': '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },

      // ======================
      // GRADIENTES
      // ======================
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #f9f9ff 0%, #e8f5e9 50%, #f1f3ff 100%)',
        'card-gradient': 'linear-gradient(180deg, #ffffff 0%, #f1f3ff 100%)',
        'cta-gradient': 'linear-gradient(135deg, #006b2c 0%, #00873a 100%)',
        'success-gradient': 'linear-gradient(135deg, #7ffc97 0%, #22c55e 100%)',
        'danger-gradient': 'linear-gradient(135deg, #ef5350 0%, #bb0112 100%)',
      },

      // ======================
      // ANIMAÇÕES
      // ======================
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'fade-out': 'fadeOut 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },

      // ======================
      // TRANSIÇÕES
      // ======================
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },

      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ======================
      // BREAKPOINTS PERSONALIZADOS
      // ======================
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },

      // ======================
      // Z-INDEX
      // ======================
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // ======================
      // ASPECT RATIOS
      // ======================
      aspectRatio: {
        'card': '4 / 3',
        'hero': '16 / 9',
        'portrait': '3 / 4',
      },
    },
  },

  // ======================
  // PLUGINS
  // ======================
  plugins: [],
}
