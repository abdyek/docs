---
title: attributes.toml
description: The format of attributes.toml, the attributes a theme sets on the structure of its contract.
---

`attributes.toml` is optional. It sits next to `theme.toml` and goes into the package unchanged. [attributes.toml](/themes/attributes/) in the Themes guide explains how to use it.

| | |
| --- | --- |
| Schema | `https://umono.dev/schemas/theme-attributes/v1` |
| Format | TOML v1.0.0, UTF-8 |
| Checked against | The contract in the package, by `build`, `install` and activation |

```toml
schema = "https://umono.dev/schemas/theme-attributes/v1"

[address."post"]
class = "folio-post"

[address."post IMAGE"]
sizes = "(min-width: 48rem) 41rem, 100vw"
```

## Keys

| Key | Type | Required | Rule |
| --- | --- | --- | --- |
| `schema` | string | Yes | Exactly `https://umono.dev/schemas/theme-attributes/v1` |
| `address` | table | Yes | At least one address |

No other top-level key is allowed.

## Addresses

Each key of `address` is an address, written with single spaces between its parts. Leading, trailing and repeated spaces are errors.

| Form | Example | Element |
| --- | --- | --- |
| `layout` | `post` | `<umono-root>` |
| `layout BUILTIN` | `post IMAGE` | The root element of every such built-in in the scope of the layout |
| `layout COMPONENT BUILTIN` | `post MAIN_MENU LINK` | The root element of every such built-in in the scope of the component |

- `layout` is a layout id of the contract.
- `COMPONENT` is a component the contract exposes (`expose = true`).
- `BUILTIN` is one of `LINK`, `IMAGE`, `NAV`, `LIST`, `DETAILS`, `HEADER`, `MAIN`, `FOOTER`, `ARTICLE` and `ASIDE`. A name the contract defines as a component is not a built-in.
- `layout COMPONENT` is not an address.
- A name that the contract does not have is an error. An address whose layout never uses its component is a warning.

| Built-in | Root element |
| --- | --- |
| `LINK` | `a` |
| `IMAGE` | `picture` |
| `NAV` | `nav` |
| `LIST` | `ul` or `ol` |
| `DETAILS` | `details` |
| `HEADER` | `header` |
| `MAIN` | `main` |
| `FOOTER` | `footer` |
| `ARTICLE` | `article` |
| `ASIDE` | `aside` |

## Attributes

The value of each address is a table with at least one attribute. Values are strings.

| Attribute | Addresses | Written to | Value |
| --- | --- | --- | --- |
| `class` | All | The element of the address | Class names separated by single spaces. Printable ASCII (U+0021–U+007E), no repeated name, no name starting with `umono-` or `compono-` (in any case), at most 1024 bytes |
| `sizes` | Ending in `IMAGE` | Every element with a `srcset` in the image | The HTML source size list, with the media features and length units of [Theme CSS](/reference/theme-css/#media-queries), and `calc()`, `min()`, `max()` and `clamp()`. No `auto`, no percentages, no media types |

The values are escaped in the HTML. Compono writes neither attribute on these elements itself, so the value of the theme is the only value.
