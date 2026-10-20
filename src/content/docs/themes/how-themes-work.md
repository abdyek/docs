---
title: How themes work
description: What a Umono theme is, what it styles, what it cannot touch and how it stays compatible.
sidebar:
  order: 1
---

A Umono theme changes how content looks, never what it says or does. It is a package of CSS, fonts and images, written for one contract. This page explains the pieces a theme author works with. [Your first theme](/themes/your-first-theme/) puts them to work.

## Contracts and layouts

A contract describes the structure of a kind of site. It is a TOML file published on [umono.dev](https://umono.dev) with:

- **Layouts.** A layout is the structure of a page, written in Compono. `umono/page@v0.1` has one layout, `page`: a header with the site name and a menu, the content, and a footer. `umono/blog@v0.1` has three: `post`, `post-list` and `page`.
- **Parameters.** Everything a layout shows comes from the site owner through its parameters: the site name, the menu, the title of a post, the content. A contract writes no text of its own, so it works in every language.
- **Components** that the layouts share. A component can be **exposed**, which lets a theme address it, like `MAIN_MENU` in the official contracts.

A theme picks one contract and cannot change it. A published contract is never edited or removed, so the structure a theme styles stays the same. A new structure comes as a new contract version, `v0.2` or `v1.0`, and a theme moves to it by changing the `contract` in its `theme.toml`.

The site owner binds each page to a layout and fills its parameters. The theme decides how that structure looks.

## What a theme styles

Umono renders every page into the same frame:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home</title>
  <link rel="stylesheet" href="/_umono/umono-shell.css">
  <link rel="stylesheet" href="/_theme/…/theme.css">
  <script nonce="…" src="/_umono/umono-root.js" defer></script>
</head>
<body>
  <umono-root>…</umono-root>
</body>
</html>
```

The frame is Umono's. A theme styles `<umono-root>` and everything inside it. Inside is the output of the layout. For the `page` layout of `umono/page@v0.1` it is:

```html
<umono-root>
  <header>
    <a href="/">My website</a>
    <nav aria-label="Main menu">
      <ul>
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <h1>Hello</h1>
    <p>This is my first page, written in <strong>Compono</strong>.</p>
  </main>
  <footer>
    <p>Made with Umono</p>
  </footer>
</umono-root>
```

This is plain, semantic HTML. Component names never appear in it, and Umono adds no classes of its own. The HTML that Compono produces is frozen: a theme written today keeps working because the same content produces the same elements in every Umono release until v1.

To target parts of the structure more precisely, a theme gives classes to them with [`attributes.toml`](/themes/attributes/).

## What a theme cannot touch

The limits are what lets a site owner switch themes safely. Umono checks them when a theme is built, installed and activated, and a theme that breaks one is refused.

- **The frame.** Everything outside `<umono-root>`, the `<head>` included. A theme cannot select `html`, `body` or `:root`.
- **Scripts and behavior.** A theme has no JavaScript and cannot add event handlers or change how anything works.
- **Content and meaning.** Text, link targets and accessibility attributes belong to the site owner. A theme cannot add words, even with CSS `content`. It can add separators and symbols, with an empty alternative text.
- **Other sites.** A theme loads nothing from another origin: no web fonts from a CDN, no remote images. Every font and image comes from the theme's own package, and the page's Content-Security-Policy enforces it.
- **The contract.** A theme picks a contract but cannot change its layouts.
- **Errors.** When part of a page has an error, it is left out of the page. A theme never sees an error and cannot style one.
- **Which page uses which layout.** That is the site owner's choice.

## Themes of a contract are interchangeable

Themes are grouped by contract: `umono/page v0.1` is one group, `umono/blog v0.1` another. Each group has at most one active theme, and every page bound to a layout of the group is rendered with it. Activating another theme of the group replaces the old one in one step, without touching a page.

A group with no active theme, and every page without a layout, is rendered with Umono's default look.

For contracts from v1 on, a newer minor version covers the older ones: a theme for `v1.3` can render pages bound to `v1.2`. Each `v0` minor version is a group of its own.

## The Theme API version

The Theme API is what themes rely on: the CSS rules, the frozen HTML, the files of a package. Its version is a single number, and Umono v0.9 brings version 1.

You never write the number by hand. `umono theme build` detects which features of the Theme API your theme uses, writes the version they need into the package and prints the reasons. Each Umono release states the range of versions it supports, and it activates only themes inside that range. Apart from security fixes, the Theme API does not break during Umono 0.x: a theme built for version 1 keeps working until Umono v1. [Theme API](/reference/theme-api/) lists the versions and their features.

## The files of a theme

| File | |
| --- | --- |
| `theme.toml` | The identity of the theme: its id, name, version and contract. Required |
| `assets/theme.css` | The stylesheet. Required, and the only CSS file |
| `assets/` | Fonts and images |
| `attributes.toml` | Classes for parts of the structure, and `sizes` for images. Optional |
| `LICENSE` | The license of the theme and of the fonts and code it uses. Optional |

`umono theme build` turns these into a single `.umono-theme` file that a site owner installs.

## Where to start

- [Your first theme](/themes/your-first-theme/) builds a small theme from start to finish.
- [Octavo and Folio](/themes/official-themes/), the official themes, are complete examples to read and fork.
