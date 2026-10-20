---
title: Fonts and images
description: The files a theme can carry under assets/, and how to use a font of your own.
sidebar:
  order: 4
---

A page loads fonts and images only from the site itself, so a theme brings its own. Everything under `assets/` goes into the package and is served with the theme.

## Allowed files

| Kind | Extensions |
| --- | --- |
| The stylesheet | `theme.css`, exactly once, directly under `assets/` |
| Fonts | `.woff2`, `.woff` |
| Images | `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif` |

No other file is accepted, and a file must really be what its extension says: the build checks the first bytes of every file. SVG is not accepted yet.

Directories are free, for example `assets/fonts/` and `assets/images/`. Every file and directory name uses lowercase letters, digits, `.`, `_` and `-`, starts with a letter or a digit and is at most 64 bytes long. Hidden files such as `.DS_Store` are refused, so is a symbolic link. Empty directories are skipped by the build.

Keep sources, such as uncompiled CSS or a design file, outside `assets/`, for example in `src/`. A file under `assets/` that is not allowed stops the build. It is never left out silently.

## Size limits

| | Limit |
| --- | --- |
| The package | 64 MB, packed and unpacked |
| A single file under `assets/` | 16 MB |
| `assets/theme.css` | 2 MB |
| `LICENSE` | 256 KB |
| Files in the package | 1,000 |
| Directory depth | 8, `assets` included |
| A path | 256 bytes |

The limits are the same on every site.

## Use a font

Put the font files under `assets/fonts/` and declare them with `@font-face`. URLs are relative to `assets/`:

```css
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(fonts/inter-latin.woff2) format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

:scope {
  font-family: "Inter", system-ui, sans-serif;
}
```

- **Subset the font.** A font split by script, with `unicode-range`, lets the browser download only what a page needs. Octavo carries Inter and Folio carries Literata as Latin and Latin Extended subsets.
- **`local()` is allowed** in `src`. It loads nothing from the network.
- **Generic families stay generic.** Write `system-ui`, `sans-serif` and `monospace` without quotes.
- **Record the license.** Most web fonts are under the SIL Open Font License. Put its text, with the copyright of the font, into the `LICENSE` file of the theme ([Building and sharing](/themes/building-and-sharing/#license)).

## Use an image

Images are for decoration: backgrounds, textures, icons.

```css
:scope {
  background-image: url(images/paper.webp);
}

nav li + li::before {
  content: url(images/dot.png) / "";
}
```

An image cannot carry words that the page does not have. Text belongs to the content, in the language of the site, and an image with text in it would bypass that.

## How assets are served

The files are served under an address that changes with every build of the theme, for example `/_theme/3f2a…/fonts/inter-latin.woff2`, and browsers keep them for a year without asking again. After an update of the theme, visitors get the new files on their next page load. You never add `?v=` to a URL, and you could not: a URL with a query is refused.
