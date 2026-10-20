---
title: umono/page v0.1
description: The official contract of a site of pages with a header, a menu, free content and a footer.
---

A site of pages with a header, a menu, free content and a footer, for a site owner who wants one look for every page. Its official theme is [Octavo](/themes/official-themes/#octavo).

| | |
| --- | --- |
| Reference | `umono/page@v0.1` |
| Registry | [`https://umono.dev/registry/v1/contracts/umono/page/v0.1`](https://umono.dev/registry/v1/contracts/umono/page/v0.1) |
| License | [MIT-0](https://umono.dev/license) |
| Layouts | `page` |
| Exposed components | `MAIN_MENU` |

A `v0` contract is where an official contract matures. Its minor versions do not have to be compatible with each other, and `v1.0` follows when it is stable.

## `page`

Free content between the site header and the footer. Every parameter is required. An empty value is still a valid value.

| Parameter | Type | Meaning |
| --- | --- | --- |
| `site-name` | string | The site name in the header, linked to `home-url` |
| `home-url` | string | The address of the home page |
| `menu-label` | string | The accessible name of the menu, the `aria-label` of its `nav` |
| `menu` | array | The menu entries |
| `content` | component | The content of the page, inside `main` |
| `footer` | component | The content of the footer |

Every entry of `menu` has all four keys:

| Key | Type | Meaning |
| --- | --- | --- |
| `text` | string | The text of the link |
| `url` | string | The address of the link |
| `current` | string | `"page"` on the entry of the current page, which gets `aria-current="page"`. `""` on the others |
| `children` | array | The entries of a submenu, with the same four keys. `[]` when there is none |

```text
{{ UMONO_LAYOUT
  site-name = "Umono" home-url = "/" menu-label = "Main menu"
  menu = [
    { text: "Home", url: "/", current: "page", children: [] },
    { text: "Release Notes", url: "/release-notes", current: "", children: [] }
  ]
  content = BODY footer = FOOTER_BODY
}}

~ BODY
# Umono

~ FOOTER_BODY
Made with Umono
```

## The HTML

```html
<umono-root>
  <header>
    <a href="/">Umono</a>
    <nav aria-label="Main menu">
      <ul>
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/release-notes">Release Notes</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <h1>Umono</h1>
  </main>
  <footer>
    <p>Made with Umono</p>
  </footer>
</umono-root>
```

A submenu is a `ul` inside the `li` of its entry. The site header and `MAIN_MENU` are the same in every official contract.

## Addresses

| Address | Matches |
| --- | --- |
| `page` | `<umono-root>` |
| `page LINK`, `page NAV`, `page IMAGE`, … | The built-ins in the scope of the layout: the site name and the `nav` of the header, the content and the footer |
| `page MAIN_MENU LINK` | The links of the menu |
| `page MAIN_MENU LIST` | The lists of the menu, submenus included |

## Source

The published file, under MIT-0:

```toml
schema      = "https://umono.dev/schemas/theme-contract/v1"
id          = "umono/page"
version     = "v0.1"
description = "A site with a header, a menu, free content and a footer"

[[layouts]]
id          = "page"
description = "Free content between the site header and footer"
source = '''
~ site-name! = "" home-url! = "" menu-label! = "" menu! = [] content! = NO_MATTER footer! = NO_MATTER
{{ SITE_HEADER site-name = site-name home-url = home-url menu-label = menu-label menu = menu }}
{{ MAIN content = content }}
{{ FOOTER content = footer }}
'''

[[components]]
name   = "SITE_HEADER"
source = '''
~ site-name! = "" home-url! = "" menu-label! = "" menu! = []
{{ HEADER content = SITE_HEADER_BODY(site-name = site-name home-url = home-url menu-label = menu-label menu = menu) }}

~ SITE_HEADER_BODY site-name! = "" home-url! = "" menu-label! = "" menu! = []
{{ LINK text = site-name url = home-url }}
{{ NAV label = menu-label content = MAIN_MENU(menu = menu) }}
'''

[[components]]
name   = "MAIN_MENU"
expose = true
source = '''
~ menu! = []
{{ LIST items = menu item = MENU_ITEM }}

~ MENU_ITEM item! = {}
{{ LINK text = item.text url = item.url current = item.current }}
{{ LIST items = item.children item = MENU_ITEM }}
'''
```
