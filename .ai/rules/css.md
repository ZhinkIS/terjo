---
paths:
  - resources/css/app.css
---

# Css

## Neumorphic design tokens are global
app.css defines --neu-bg/--neu-ink/--neu-muted/--neu-accent/--neu-shadow-dark/--neu-shadow-light for light and .dark plus neu-raised*/neu-inset* utilities and a themed body background. Use these tokens for all UI surfaces; do not reintroduce fixed gradients, hard black borders, or hardcoded white/dark backgrounds. ScratchReveal reads --scratch-cover/--scratch-ink.
