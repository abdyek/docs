---
title: Theme CSS
description: The complete rules of assets/theme.css in Theme API 1.
---

The rules of `assets/theme.css` in Theme API 1. [Writing theme CSS](/themes/writing-theme-css/) explains them in learning order. The build, the development server, `install` and activation check them all. Anything not allowed here is an error, never ignored.

## The file

- `assets/theme.css` is the only stylesheet, at most 2 MB, UTF-8. A leading BOM and `@charset "UTF-8";` are accepted and dropped. Any other `@charset` is an error.
- The stylesheet is parsed strictly. A construct the parser would recover from, such as an unclosed block or a bad string, is an error.
- A comment cannot join two tokens: `umono/**/-root` is an error.
- Comments are removed from the package.

## Structure

| Where | Allowed |
| --- | --- |
| Top level | Style rules, `@media`, `@supports`, `@layer` blocks and statements, `@font-face`, `@keyframes` |
| Inside `@media`, `@supports`, `@layer` | Style rules, `@media`, `@supports`, `@layer` blocks |
| Inside a style rule | Declarations only. No nested rules |

Every other at-rule is an error, including `@import`, `@namespace`, `@scope`, `@container`, `@starting-style`, `@property`, `@page`, `@counter-style`, `@font-palette-values`, `@position-try` and `@view-transition`. Declarations in `@font-face` and `@keyframes` cannot use `!important`.

The build wraps every run of style rules in `@scope (umono-root)`, at the top level and inside every block, keeping their order.

## Selectors

Selectors follow Selectors Level 4 and are parsed completely.

- `:scope` is `<umono-root>`. It can only appear in the first compound of a selector, not inside a functional pseudo-class. The first combinator after it is a space or `>`, or there is none.
- A selector cannot start with a combinator.
- `html`, `body`, `:root`, the type selector `umono-root` and `&` cannot appear anywhere.
- No namespace prefix: `svg|a`, `*|*` and `[*|id]` are errors.
- The compound with `:scope` cannot use `:first-child`, `:last-child`, `:only-child`, `:nth-child()`, `:nth-last-child()`, `:first-of-type`, `:last-of-type`, `:only-of-type`, `:nth-of-type()` and `:nth-last-of-type()`, also inside its `:is()`, `:where()` and `:not()`, nor a `:has()` with a relative selector that starts with `+` or `~`.
- The arguments of `:is()`, `:where()`, `:not()` and the `of` list of `:nth-child()` and `:nth-last-child()` are compound selectors without combinators.
- `:defined` and `:state()` cannot appear anywhere.
- `id` cannot be selected: no `#id`, no attribute selector named `id` in any form, no `:target` and no `:target-within`, also inside functional pseudo-classes and `@supports selector()`.
- A root class from a layout address of `attributes.toml` that is required without `:scope` is a warning: `.home h1` never matches, `:scope.home h1` does.

### Pseudo-classes

| Name | Argument | Note |
| --- | --- | --- |
| `:scope` | — | The root only |
| `:hover`, `:active`, `:focus`, `:focus-visible`, `:focus-within` | — | |
| `:link`, `:visited`, `:any-link` | — | |
| `:is()`, `:where()`, `:not()` | Compound selector list | No `:scope`, no combinators |
| `:has()` | Relative selector list | No `:scope` |
| `:empty` | — | |
| `:first-child`, `:last-child`, `:only-child` | — | Not on `:scope` |
| `:nth-child()`, `:nth-last-child()` | `An+B`, optional `of` compound selector list | Not on `:scope` |
| `:first-of-type`, `:last-of-type`, `:only-of-type` | — | Not on `:scope` |
| `:nth-of-type()`, `:nth-last-of-type()` | `An+B` | Not on `:scope` |
| `:lang()` | Language ranges, identifiers or strings | |
| `:dir()` | `ltr` or `rtl` | |
| `:open` | — | An open `details` |

### Pseudo-elements

`::before`, `::after`, `::marker`, `::first-line`, `::first-letter`, `::selection` and `::details-content`. The single-colon forms `:before`, `:after`, `:first-line` and `:first-letter` are errors. Prefixed names, such as `::-webkit-details-marker`, are errors.

## Media queries

`@media` conditions, and the media conditions in `sizes` of `attributes.toml`, use:

| Media feature | Value |
| --- | --- |
| `width`, `height` | A length, with `min-`/`max-` and the range syntax: `(width >= 48rem)` |
| `aspect-ratio` | A ratio, `16/9`, with `min-`/`max-` and the range syntax |
| `orientation` | `portrait`, `landscape` |
| `resolution` | `dppx`, `dpi`, `x`, with `min-`/`max-` and the range syntax |
| `hover`, `any-hover` | `none`, `hover` |
| `pointer`, `any-pointer` | `none`, `coarse`, `fine` |
| `prefers-color-scheme` | `light`, `dark` |
| `prefers-reduced-motion` | `no-preference`, `reduce` |
| `prefers-contrast` | `no-preference`, `more`, `less`, `custom` |
| `forced-colors` | `none`, `active` |

- Media types: `all`, `screen`, `print`. `sizes` takes none.
- Keywords: `and`, `or`, `not`, `only`. A feature without a value, `(hover)`, is accepted.
- Length units: `px`, `em`, `rem`, `ch`, `ex`, `vw`, `vh`, `vi`, `vb`, `vmin`, `vmax` and their `sv*`, `lv*` and `dv*` forms.

`@supports` conditions are not restricted, except that `selector()` follows the selector rules and URLs follow the URL rule.

## Values

### Functions

| Group | Functions |
| --- | --- |
| Math | `calc()`, `min()`, `max()`, `clamp()`, `round()`, `mod()`, `rem()`, `abs()`, `sign()`, `sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`, `atan2()`, `pow()`, `sqrt()`, `hypot()`, `log()`, `exp()` |
| Variables and counters | `var()`, `counter()`, `counters()`, `attr()` |
| Color | `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()`, `lab()`, `lch()`, `oklab()`, `oklch()`, `color()`, `color-mix()`, `light-dark()` |
| Images | `url()`, `src()`, `image-set()`, `linear-gradient()`, `radial-gradient()`, `conic-gradient()`, `repeating-linear-gradient()`, `repeating-radial-gradient()`, `repeating-conic-gradient()` |
| Transforms | `translate()`, `translateX()`, `translateY()`, `translateZ()`, `translate3d()`, `scale()`, `scaleX()`, `scaleY()`, `scaleZ()`, `scale3d()`, `rotate()`, `rotateX()`, `rotateY()`, `rotateZ()`, `rotate3d()`, `skew()`, `skewX()`, `skewY()`, `matrix()`, `matrix3d()`, `perspective()` |
| Filters | `blur()`, `brightness()`, `contrast()`, `drop-shadow()`, `grayscale()`, `hue-rotate()`, `invert()`, `opacity()`, `saturate()`, `sepia()` |
| Shapes | `inset()`, `circle()`, `ellipse()`, `polygon()`, `path()` |
| Timing | `cubic-bezier()`, `steps()`, `linear()` |
| Grid and sizing | `repeat()`, `minmax()`, `fit-content()` |
| `@font-face` `src` | `local()`, `format()`, `tech()` |

Any other function is an error, also nested and in custom properties. Not on the list, for example: `env()`, `if()`, `sibling-index()`, `sibling-count()`, `element()`, `paint()`, `scroll()`, `view()`, `anchor()`, `expression()` and every prefixed function.

The first argument of `attr()` is a literal identifier other than `id`: `attr(data-lang)` is accepted, `attr(id)` and `attr(var(--a))` are not.

### Declarations

- `expression()`, `behavior` and `-moz-binding` are errors.
- A value cannot contain a `{}` block, `<!--`, `-->`, a bad string or a bad URL, custom properties included.
- Names are compared after resolving escapes and ignoring ASCII case: `@\69mport` is `@import`.

### URLs

`url()`, `src()` and the strings in `image-set()` are URLs, in every property and in custom properties. A URL is a path relative to `assets/` that names an allowed file of the package, such as `url(fonts/inter.woff2)`.

| Refused | Example |
| --- | --- |
| A scheme | `https://cdn.example.com/a.woff2`, `data:…`, `blob:…` |
| A host | `//cdn.example.com/a.woff2` |
| An absolute path | `/media/logo.png` |
| Leaving `assets/` | `../built.toml` |
| `./` | `./fonts/inter.woff2` |
| A query or a fragment | `fonts/inter.woff2?v=2`, `url(#mask)` |
| Percent-encoding | `fonts/inter%2Ewoff2` |
| An empty URL | `url()` |
| A missing file | `url(fonts/missing.woff2)` |

`local()` in `@font-face` is not a URL and is accepted.

### Generated text

In `content`, `quotes`, `list-style-type` and `list-style`, on any element or pseudo-element:

- A string cannot contain a letter (Unicode category `L`), after resolving escapes. Punctuation, symbols, emoji and private-use code points are accepted.
- `content` with a non-empty string or an image (`url()`, `image-set()`, a gradient) needs an alternative text after `/`, and the alternative text cannot contain a non-empty string: `"·" / ""` and `counter(n) ". " / counter(n)` are accepted, `"·"` and `"→" / "More"` are not.
- `var()` cannot be used.
- `content: ""`, `none`, `normal`, `attr()`, `counter()`, `counters()`, `open-quote`, `close-quote` and `quotes: auto` are accepted.

### Reserved names

Names starting with `umono-` or `compono-` (`--umono-` and `--compono-` for dashed identifiers) cannot be used for `@font-face` families, `@keyframes`, the first segment of `@layer` names, custom properties, or any identifier in a declaration value. Strings are not affected.
