---
title: Writing theme CSS
description: The rules of assets/theme.css, the single stylesheet of a theme.
sidebar:
  order: 3
---

A theme has one stylesheet, `assets/theme.css`. It is ordinary CSS with a few rules that keep a theme inside its own box. The build, the development server, `install` and activation all check them, and a stylesheet that breaks one is refused with the line of the mistake.

## Everything is inside `<umono-root>`

The build wraps every rule of your stylesheet in `@scope (umono-root)`. A rule can only match `<umono-root>` and the elements inside it. You do not write the scope yourself, and you cannot write another one.

- **`:scope` is `<umono-root>`.** Style the page background, the font of the whole page and the custom properties of the theme on `:scope`.
- **`html`, `body` and `:root` cannot be selected.** Umono sets the margin of `<body>` to zero and makes `<umono-root>` at least as tall as the viewport. Everything else about `<umono-root>`, `display` included, is yours to change.
- **A class on the root needs `:scope`.** Write `:scope.home h1`, not `.home h1`. A selector without `:scope` looks for its elements inside the root, so `.home h1` never matches. The build warns about it.
- **`:scope` comes first.** It can only appear in the first part of a selector, followed by a space, `>` or nothing: `:scope > header`, `:scope.home main`. `:scope ~ p` and `p :scope` are refused, and so is a selector that starts with a combinator, like `> h1`.

## Plain CSS

- **No nesting.** A rule contains declarations only: no `&`, no nested rules.
- **No `@import`.** The theme has a single stylesheet. If you use a CSS framework or a preprocessor, compile into `assets/theme.css` before the build.
- **These at-rules, and no others:** `@media`, `@supports`, `@layer`, `@font-face` and `@keyframes`. `@media`, `@supports` and `@layer` can be nested in each other. `@font-face`, `@keyframes` and a `@layer` statement stay at the top level. `@container`, `@property`, `@page` and the rest are refused.
- **Comments do not go into the package.** That includes `/*! … */`. License notes belong in the `LICENSE` file, and the build warns about such a comment.

## Closed lists

Selectors, media queries and functions are checked against closed lists. A name that is not on the list is refused, even if browsers support it. The lists grow with new Theme API versions.

- **Pseudo-classes:** `:scope`, `:hover`, `:active`, `:focus`, `:focus-visible`, `:focus-within`, `:link`, `:visited`, `:any-link`, `:is()`, `:where()`, `:not()`, `:has()`, `:empty`, `:first-child`, `:last-child`, `:only-child`, `:nth-child()`, `:nth-last-child()`, `:first-of-type`, `:last-of-type`, `:only-of-type`, `:nth-of-type()`, `:nth-last-of-type()`, `:lang()`, `:dir()` and `:open`.
- **Pseudo-elements:** `::before`, `::after`, `::marker`, `::first-line`, `::first-letter`, `::selection` and `::details-content`. Write them with two colons.
- **Media features:** `width`, `height`, `aspect-ratio`, `orientation`, `resolution`, `hover`, `any-hover`, `pointer`, `any-pointer`, `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast` and `forced-colors`, with the media types `all`, `screen` and `print`.
- **Functions:** the math functions (`calc()`, `min()`, `max()`, `clamp()` and the rest), `var()`, `counter()`, `counters()`, `attr()`, the color functions, gradients, `url()` and `image-set()`, transforms, filters, shapes, timing functions, `repeat()`, `minmax()` and `fit-content()`. `env()`, `if()`, `sibling-index()` and `sibling-count()` are not on the list.

A few rules keep a theme from looking outside its box:

- `:first-child`, `:nth-child()` and the other position pseudo-classes cannot be used on `:scope`. The position of `<umono-root>` among its siblings is Umono's.
- The selectors inside `:is()`, `:where()` and `:not()` cannot contain combinators. `:is(article, section) h1` is fine, `:is(nav a)` is not.
- `id` is closed to themes: no `#id` selector, no `[id]`, no `:target`. Umono puts no `id` on content.

## URLs point into the package

Every URL in the stylesheet is a relative path to a file under `assets/`, written from `assets/`:

```css
@font-face {
  font-family: "Inter";
  src: url(fonts/inter.woff2) format("woff2");
}
```

A URL with a scheme (`https:`, `data:`), an absolute path, `./`, `..`, a query or a fragment is refused, and so is a path to a file that is not in the package. [Fonts and images](/themes/fonts-and-images/) lists the files a package can hold.

## No words from CSS

The text of a page belongs to the site owner, in the language of the site. A theme cannot add words:

- A string in `content`, `quotes`, `list-style-type` or `list-style` cannot contain letters. Symbols, punctuation and emoji are fine.
- `content` with a string or an image needs an empty alternative text, so that screen readers skip it: `content: "·" / ""`.
- `var()` cannot be used in these properties.

```css
/* A separator between menu items */
nav li + li::before {
  content: "·" / "";
  margin-inline-end: 0.75rem;
}
```

`counter()`, `attr()`, `open-quote` and `close-quote` are allowed: they number or quote text, they do not write it.

## Reserved names

Names that start with `umono-` or `compono-` are Umono's. A theme cannot use them for custom properties, `@font-face` families, `@keyframes`, `@layer` names, or any identifier in a value.

## Layers

Umono's own rules for `<umono-root>` are in the lowest layer of the cascade, so every rule of a theme overrides them, with layers or without. A theme can use `@layer` freely, for example the layers of a CSS framework.

## Direction and language

Umono sets `lang` and `dir` on `<html>` from the language of the site, and they are inherited by everything inside `<umono-root>`. Use logical properties (`margin-inline-start`, `padding-block`, `inset-inline-end`) and, where needed, `:dir(rtl)` and `:lang()`. All languages Umono offers today are left to right, but a site can be switched to a right-to-left language without changing its theme.

## Browser support

The scope relies on `@scope`. A browser without `@scope` ignores the stylesheet of the theme entirely: the page shows its content unstyled, and nothing of the theme leaks outside `<umono-root>`. Newer CSS features are fine to use. A browser that does not know one ignores it as usual.

## All the rules

[Theme CSS](/reference/theme-css/) in the Reference lists every rule, with the complete lists of selectors, media features and functions.
