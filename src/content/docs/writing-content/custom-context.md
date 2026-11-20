---
title: Custom context
description: Values you define once in the admin panel and use on every page with context(site/…).
---

A custom context value is a named value that you define once and use on any page and in any global component with `context(site/…)`. The site name, the menu and the links of the footer are written in one place instead of on every page. Since v0.10.

## Add a value

Open **Context** in the admin panel and choose **New value**. A value has a key and the value itself:

| Key | Value |
| --- | --- |
| `site/name` | `"Umono"` |
| `site/menu` | `[ { text: "Home", url: "/" }, { text: "Blog", url: "/blog" } ]` |

A saved value is used by the next render. Umono does not need a restart. The preview, the published pages and the errors see the same values.

## Keys

- A key starts with `site/`, for example `site/menu` or `site/footer-links`.
- After `site/`, it has one or more parts separated by `/`. A part is lowercase letters, digits and hyphens: `site/footer/links` is a key, `site/Menu`, `site/` and `site//menu` are not.
- A key is unique.

Umono's own keys, such as `media-by-alias/…`, are outside `site/`, so your keys never clash with them.

## Values

A value is written like the value of an argument in a component call:

| Type | Example |
| --- | --- |
| string | `"Umono"`. A `"` inside the string is written twice: `"The ""quoted"" word"` |
| integer | `2026`, `-1` |
| bool | `true`, `false` |
| array | `[ "a", "b" ]` |
| record | `{ text: "Home", url: "/" }` |

Arrays and records can hold each other, and the value can span many lines. A value is data only: a component, a parameter or another `context(…)` is not allowed in it.

A value that does not parse is not saved. The editor marks where the error is, and the key keeps its last saved value.

## Use a value

On a page or in a global component, write the key in `context(…)`:

```text
Welcome to {{ context(site/name) }}.
```

A value is also an argument of a component call:

```text
{{ LINK text = context(site/name) url = "/" }}
```

Read a key of a record with `.` and an item of an array with `[ ]`, counted from `0`:

```text
{{ context(site/menu)[0].text }}
```

A string, an integer or a bool is rendered as it is. An array or a record is not: render one of its items or keys, or give it to a component.

## The menu

In [`umono/page v0.1`](/reference/contracts/umono-page-v0-1/), every page passes the site name and the menu to its `UMONO_LAYOUT` call. Keep both in custom context. `site/name` is `"Umono"` and `site/menu` is:

```text
[
  { text: "Home", url: "/", current: "__auto", children: [] },
  { text: "Blog", url: "/blog", current: "__auto", children: [] }
]
```

Every page then writes the same call:

```text
{{ UMONO_LAYOUT
  site-name = context(site/name) home-url = "/" menu-label = "Main menu"
  menu = context(site/menu) content = BODY footer = FOOTER_BODY
}}
```

`current: "__auto"` lets Umono mark the entry of the current page. On `/blog`, the second entry gets `aria-current="page"`, and on the home page the first one. Without `__auto`, the menu would have to be written on every page with `current: "page"` moved to the entry of that page. `current` and `children` are still required by `umono/page v0.1`, but they are written once.

Umono marks an entry when its `url` is the address of the page being rendered:

- The address of a page is `/` and its slug, for example `/blog`. The home page is `/`.
- The query and the fragment of `url` are ignored, and so is a trailing `/`: `/blog/`, `/blog?page=2` and `/blog#posts` all match `/blog`.
- A `url` with a scheme or a host, such as `https://example.com/blog`, never matches.
- No entry is marked on the not-found page.

In the page editor, the preview uses the saved slug of the page: a changed slug shows in the preview after you save. A new page that is not saved yet and the preview of a global component have no address, so no entry is marked there.

`__auto` works in any `current` of a `LINK`, not only in the menu.

## Rename or delete a value

A value can be renamed or deleted at any time, even when pages use it. The editor shows how many pages use the key, through a global component too. Check them first.

After a rename or a delete, every `context(…)` with the old key produces the error `unknown-key`. The published pages with the error are listed under **System → Errors**. Visitors do not see the error, but they miss what the key gave:

- Used on its own, as in `{{ context(site/name) }}`, only the value is missing.
- Used as an argument, the whole component call is left out. When the key is in the `UMONO_LAYOUT` call of a page, the page renders empty.

Add the key again, or change the pages to the new key, and the pages render as before.
