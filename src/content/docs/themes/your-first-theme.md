---
title: Your first theme
description: Build a small theme for umono/page from an empty directory to an installed package.
sidebar:
  order: 2
---

This tutorial builds a small theme for the `umono/page@v0.1` contract, the same contract as Octavo, and installs it on a site. It needs the [Umono CLI](/getting-started/installation/) and takes about fifteen minutes.

## Create the project

```sh
umono theme create my-theme --id acme/my-theme --name "My Theme" --contract umono/page@v0.1
cd my-theme
```

Without the flags, `create` asks for each value. The id is `org/id` in kebab case, and it names your theme everywhere: in the package file and in the directory it is installed into. The project starts with:

```text
my-theme/
  theme.toml
  assets/
    theme.css
  .gitignore
  .dev/
    contracts/
      umono/page/v0.1.toml
```

- `theme.toml` holds the values you gave, and `version = "0.1.0"`.
- `assets/theme.css` starts as Umono's default look, so the first preview is not a blank page.
- `.dev/contracts/umono/page/v0.1.toml` is the contract, fetched from umono.dev. Read it: its layouts are what your theme styles.
- `.gitignore` keeps `.dev/` and `dist/` out of version control. Both are recreated when needed.

## Start the development server

```sh
umono theme dev
```

The first run downloads the latest Umono into `.dev/server`, which takes a moment. After that, `dev` works offline. Open `http://localhost:8990`.

The site is empty: the development server starts with no pages. Open the admin panel at `http://localhost:8990/admin`, which needs no login, and create a page:

1. Name it `Home` and leave the slug empty.
2. Choose `umono/page v0.1 · page` as its **Layout**.
3. Write the content:

   ```text
   {{ UMONO_LAYOUT
     site-name = "My website" home-url = "/" menu-label = "Main menu"
     menu = [
       { text: "Home", url: "/", current: "page", children: [] },
       { text: "About", url: "/about", current: "", children: [] }
     ]
     content = BODY footer = FOOTER_BODY
   }}

   ~ BODY
   # Hello

   This is my first page, written in **Compono**.

   {{ LINK text = "Umono on GitHub" url = "https://github.com/umono-cms/umono" }}

   ~ FOOTER_BODY
   Made with Umono
   ```
4. Turn on **Enabled** and click **Create**.

Open `http://localhost:8990` again. The page has the structure of the `page` layout in Umono's default look. The pages you create are kept in `.dev/server` between runs, so create the pages your theme should be tested with once: a long page, a page with a table or a code block, a menu with a submenu.

## Write the stylesheet

Replace `assets/theme.css` with:

```css
:scope {
  --paper: #fdfcf8;
  --ink: #1f1d1a;
  --accent: #b4442c;

  display: flex;
  flex-direction: column;
  background-color: var(--paper);
  color: var(--ink);
  font-family: Georgia, serif;
  line-height: 1.7;
}

header,
footer {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem 1.5rem;
}

header {
  border-block-end: 1px solid #e5e1d8;
}

header > a {
  color: inherit;
  font-weight: bold;
  text-decoration: none;
}

nav ul {
  display: flex;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

main {
  flex: 1;
  width: 100%;
  max-width: 40rem;
  margin-inline: auto;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
}

a {
  color: var(--accent);
}

a[aria-current="page"] {
  text-decoration: none;
  font-weight: bold;
}

footer {
  border-block-start: 1px solid #e5e1d8;
  font-size: 0.9rem;
}
```

The page in the browser takes the new stylesheet as soon as you save. A few things to notice:

- **`:scope` is the root.** Every rule of a theme applies inside `<umono-root>`, and `:scope` is `<umono-root>` itself. Its background is the background of the page. It is at least as tall as the viewport, so a column flex layout with `flex: 1` on `main` keeps the footer at the bottom of short pages.
- **The selectors are plain elements.** `header`, `nav`, `main` and `footer` come from the layout. The current page in the menu has `aria-current="page"`, which the site owner sets in the menu.
- **Logical properties.** `border-block-end` and `margin-inline` work in right-to-left languages too. Do not assume that a site is left to right.

## See the errors

Add this line to the end of `theme.css`:

```css
body { margin: 0; }
```

The page loses its styles and an overlay lists the error:

```text
theme.css:63: body is not allowed
```

The development server runs the checks of the build on every change, and a stylesheet with an error is not applied. Remove the line, and the page comes back. [Writing theme CSS](/themes/writing-theme-css/) lists what a stylesheet may contain.

## Give the root a class

A contract can have several layouts, and a theme may want to style them differently. `attributes.toml` gives classes to parts of the structure. Create it next to `theme.toml`:

```toml
schema = "https://umono.dev/schemas/theme-attributes/v1"

[address."page"]
class = "home"

[address."page MAIN_MENU LINK"]
class = "menu-link"
```

The page reloads. `<umono-root>` now has `class="home"` on pages bound to the `page` layout, and every link of the main menu has `class="menu-link"`. A class on the root is selected with `:scope`:

```css
:scope.home h1 {
  font-size: 2.5rem;
}

.menu-link {
  text-underline-offset: 0.25em;
}
```

`.home h1` would never match, because `.home` is on the root and not inside it. The build warns about it. [attributes.toml](/themes/attributes/) explains addresses.

## Build the package

Stop the server with <kbd>Ctrl</kbd>+<kbd>C</kbd> and build:

```sh
umono theme build
```

```text
theme-api-version: 1
  ← attributes.toml                       pkg.attributes (API 1)
  ← page                                  attr.class (API 1)
  ← page                                  attr.address.layout (API 1)
  ← page MAIN_MENU LINK                   attr.address.layout-component-builtin (API 1)
  ← contract.toml:components[0].source:5  compono.builtin.link (API 1)
  …
  ← theme_api_min                         1
Built dist/acme_my-theme_0.1.0.umono-theme
```

The build runs every check again, detects the Theme API version your theme needs and prints why, and writes the package into `dist/`.

## Install it

Install the package on a site, in the site directory, and activate it under **Settings → Themes**:

```sh
umono theme install ~/my-theme/dist/acme_my-theme_0.1.0.umono-theme
```

On a site that already uses Octavo, your theme appears in the same `umono/page v0.1` group. Activating it replaces Octavo on every page of the group, and none of the pages changes.

## Next

- [Writing theme CSS](/themes/writing-theme-css/): the rules of the stylesheet.
- [Fonts and images](/themes/fonts-and-images/): add your own font.
- [Building and sharing](/themes/building-and-sharing/): versions, licenses and releases.
