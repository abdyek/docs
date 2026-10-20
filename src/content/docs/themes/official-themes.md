---
title: Official themes
description: Octavo and Folio, the official themes of umono/page and umono/blog, and what they show a theme author.
sidebar:
  order: 8
---

Every official contract has an official theme. Both are MIT licensed, live in their own public repository and are released as `.umono-theme` packages. They are complete examples of everything on these pages.

## Octavo

[Octavo](https://github.com/umono-cms/theme-octavo) is the theme of `umono/page@v0.1`, a site of pages with a header, a menu and a footer. It is modern and plain: a white page, a neutral sans serif, one column for the content, and a header and footer that span the page.

| | |
| --- | --- |
| Theme id | `umono/octavo` |
| Contract | `umono/page@v0.1` (the `page` layout) |
| Font | Inter, Latin and Latin Extended subsets |
| Download | [Latest release](https://github.com/umono-cms/theme-octavo/releases/latest) |

What to read in it:

- **Custom properties on the root.** Colors and sizes are defined on `:scope` (`--surface`, `--text`, `--accent`, `--column`), so the theme is changed in one place.
- **A menu without script.** Submenus open on hover and on keyboard focus where the pointer can hover, with `:hover`, `:focus-within` and `@media (hover: hover) and (pointer: fine)`. On touch screens they are shown under their item.
- **`sizes` for images.** Its `attributes.toml` has a single address, `page IMAGE`, which tells the browser the width of the content column.

## Folio

[Folio](https://github.com/umono-cms/theme-folio) is the theme of `umono/blog@v0.1`. It is made for reading long articles: a paper-toned page, a serif designed for long-form text, a measure of about 66 characters and a generous line height.

| | |
| --- | --- |
| Theme id | `umono/folio` |
| Contract | `umono/blog@v0.1` (`post`, `post-list` and `page` layouts) |
| Font | Literata, Latin and Latin Extended subsets |
| Download | [Latest release](https://github.com/umono-cms/theme-folio/releases/latest) |

What to read in it:

- **One theme, three layouts.** `attributes.toml` gives the `post` and `post-list` layouts a root class, `folio-post` and `folio-post-list`, and the stylesheet styles them with `:scope.folio-post` and `:scope.folio-post-list`. The `page` layout needs no class.
- **The same header and menu.** The site header and `MAIN_MENU` are the same in every official contract, and Folio's header rules have the same selectors as Octavo's. A theme written for both contracts designs the header once.
- **A symbol from CSS.** A horizontal rule is drawn as an asterism, `hr::after { content: "⁂" / ""; }`: a symbol with an empty alternative text, so screen readers skip it.

## Start from an official theme

Fork the repository of the theme for your contract and run `umono theme dev` in it. Before you release it, give it your own `id` and `name` in `theme.toml`, and keep the copyright notice of the official theme in `LICENSE`, as the MIT license requires.
