---
title: attributes.toml
description: Give classes to the parts of a contract, and sizes to its images.
sidebar:
  order: 5
---

The HTML of a layout has no classes. When element selectors are not enough, for example to style two layouts differently or to tell the links of the menu from the links of the content, a theme gives classes to parts of the structure in `attributes.toml`. The file sits next to `theme.toml` and is optional.

```toml
schema = "https://umono.dev/schemas/theme-attributes/v1"

[address."post"]
class = "folio-post"

[address."post IMAGE"]
sizes = "(min-width: 48rem) 42rem, 100vw"

[address."post MAIN_MENU LINK"]
class = "menu-link"
```

Each key under `address` is an address, and its table holds the attributes for it. A theme can set two attributes: `class` and `sizes`.

## Addresses

An address always starts with the id of a layout. It has one of three forms:

| Address | Example | Gets the attributes |
| --- | --- | --- |
| `layout` | `post` | `<umono-root>`, on pages bound to the layout |
| `layout BUILTIN` | `post IMAGE` | Every `IMAGE` in the layout itself |
| `layout COMPONENT BUILTIN` | `post MAIN_MENU LINK` | Every `LINK` in the exposed component `MAIN_MENU` |

- **Built-ins are filters.** `LINK`, `IMAGE`, `NAV`, `LIST`, `DETAILS`, `HEADER`, `MAIN`, `FOOTER`, `ARTICLE` and `ASIDE` can end an address. The attributes go to every instance of that built-in in the scope, nested ones included.
- **Components are scopes.** Only components that the contract exposes can appear in an address. An exposed component is a scope of its own: `post LINK` matches the links of the layout but not the links inside `MAIN_MENU`, and `post MAIN_MENU LINK` matches only those.
- **Content belongs to the scope it is rendered in.** The content of a page, passed to the layout as a parameter, is in the scope where the layout renders it. In `umono/page@v0.1`, the content is rendered by the layout itself, so `page LINK` matches the links of the content. It also matches the site name in the header: `SITE_HEADER` is not exposed, so what it renders is in the scope of the layout too.
- **One address per layout.** When an exposed component is used by several layouts, write an address for each: `post MAIN_MENU LINK`, `post-list MAIN_MENU LINK` and `page MAIN_MENU LINK`.

Every element matches at most one address, so the order of the file does not matter and nothing is merged.

The build checks every name in an address against the contract. A name that does not exist is an error. An address that can never match, because the layout never uses the component, is a warning.

## Where the attributes go

| Built-in | Element |
| --- | --- |
| `LINK` | `a` |
| `IMAGE` | `picture` (and `sizes` on every element with a `srcset`) |
| `NAV` | `nav` |
| `LIST` | `ul` or `ol` |
| `DETAILS` | `details` |
| `HEADER`, `MAIN`, `FOOTER`, `ARTICLE`, `ASIDE` | `header`, `main`, `footer`, `article`, `aside` |

Elements inside a built-in, like the `li` of a list or the `img` of a picture, are reached with CSS from the element that has the class: `.menu > li`, `.cover img`.

## `class`

The value is a list of class names separated by single spaces. Names use printable ASCII, so the class syntax of CSS frameworks works: `w-1/2`, `bg-[#fff]`. A name cannot repeat or start with `umono-` or `compono-`, and the value is at most 1024 bytes.

A class given to a layout address is on `<umono-root>` itself. Select it with `:scope`:

```css
:scope.folio-post h1 { font-size: 2.5rem; }
```

`.folio-post h1` would look for `.folio-post` inside the root and never match. The build and the development server warn about it.

## `sizes`

`sizes` tells the browser how wide an image is displayed, so that it downloads the right file of its responsive variants. Without it, the browser assumes the full width of the viewport. It can only be set on an address that ends in `IMAGE`:

```toml
[address."page IMAGE"]
sizes = "(min-width: 48rem) 42rem, 100vw"
```

The value follows the HTML syntax of `sizes`, with the media features and units that the stylesheet allows. `auto` and percentages are not accepted.

## What cannot be set

Everything else on an element belongs to the content or to Umono: `id`, `style`, `href`, `src`, `alt`, `title`, `role`, `aria-*`, `data-*`, event handlers and the rest. A theme only gives the structure something to select.
