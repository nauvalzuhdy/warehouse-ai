import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        'priority-critical': 'hsl(var(--priority-critical) / <alpha-value>)',
        'priority-critical-foreground': 'hsl(var(--priority-critical-foreground) / <alpha-value>)',
        'priority-high': 'hsl(var(--priority-high) / <alpha-value>)',
        'priority-high-foreground': 'hsl(var(--priority-high-foreground) / <alpha-value>)',
        'priority-medium': 'hsl(var(--priority-medium) / <alpha-value>)',
        'priority-medium-foreground': 'hsl(var(--priority-medium-foreground) / <alpha-value>)',
        'priority-low': 'hsl(var(--priority-low) / <alpha-value>)',
        'priority-low-foreground': 'hsl(var(--priority-low-foreground) / <alpha-value>)',
        'status-success': 'hsl(var(--status-success) / <alpha-value>)',
        'status-success-foreground': 'hsl(var(--status-success-foreground) / <alpha-value>)',
        'status-warning': 'hsl(var(--status-warning) / <alpha-value>)',
        'status-warning-foreground': 'hsl(var(--status-warning-foreground) / <alpha-value>)',
        'status-info': 'hsl(var(--status-info) / <alpha-value>)',
        'status-info-foreground': 'hsl(var(--status-info-foreground) / <alpha-value>)',
        'status-error': 'hsl(var(--status-error) / <alpha-value>)',
        'status-error-foreground': 'hsl(var(--status-error-foreground) / <alpha-value>)',
        'stock-critical': 'hsl(var(--stock-critical) / <alpha-value>)',
        'stock-critical-foreground': 'hsl(var(--stock-critical-foreground) / <alpha-value>)',
        'reorder-pending': 'hsl(var(--reorder-pending) / <alpha-value>)',
        'reorder-pending-foreground': 'hsl(var(--reorder-pending-foreground) / <alpha-value>)',
        'warehouse-full': 'hsl(var(--warehouse-full) / <alpha-value>)',
        'warehouse-full-foreground': 'hsl(var(--warehouse-full-foreground) / <alpha-value>)',
        'item-expired': 'hsl(var(--item-expired) / <alpha-value>)',
        'item-expired-foreground': 'hsl(var(--item-expired-foreground) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}

export default config
