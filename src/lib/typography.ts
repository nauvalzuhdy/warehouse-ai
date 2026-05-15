export const typography = {
  heading: {
    h1: "text-4xl font-bold tracking-tight text-foreground",
    h2: "text-2xl font-bold tracking-tight text-foreground",
    h3: "text-lg font-semibold text-foreground",
  },
  body: {
    default: "text-base text-foreground",
    sm: "text-sm text-foreground",
    muted: "text-sm text-muted-foreground",
  },
  label: {
    default: "text-sm font-medium text-foreground",
    sm: "text-xs font-medium text-foreground",
  },
} as const;

export type TextVariant =
  | `heading.${keyof typeof typography.heading}`
  | `body.${keyof typeof typography.body}`
  | `label.${keyof typeof typography.label}`;
