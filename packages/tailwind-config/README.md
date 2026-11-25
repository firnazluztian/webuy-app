# `@webuy/tailwind-config`

Shared Tailwind **v4** theme for WeBuy apps — mirrors `@kiichan/design-system` `@theme` tokens and General Sans.

## Usage

```css
@import "tailwindcss";
@import "@webuy/tailwind-config/theme.css";
@source "../../node_modules/@kiichan/design-system/dist";
```

Keep `theme.css` in sync when bumping the kiichan catalog pin (see [ADR-0002](../../docs/adr/0002-shared-kiichan-catalog-pin.md)).
