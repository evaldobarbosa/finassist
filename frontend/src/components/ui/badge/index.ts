import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-white',
        secondary: 'border-transparent bg-secondary text-white',
        destructive: 'border-transparent bg-tertiary text-white',
        outline: 'text-on-surface border-outline-variant',
        success: 'border-transparent bg-primary-fixed text-primary',
        warning: 'border-transparent bg-yellow-100 text-yellow-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
