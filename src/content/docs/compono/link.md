---
title: LINK
description: The LINK built-in component, its parameters, the current page with __auto and the allowed URL schemes.
---

`LINK` writes a link. Use it when a link opens in a new tab or marks the current page. Otherwise a markdown link, `[text](/url)`, writes the same `<a>`.

```text
{{ LINK text = "Visit us" url = "https://example.com" new-tab = true }}
```

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Visit us</a>
```

`LINK` can be written inside a sentence or on its own line. On its own line, it is not wrapped in a `<p>`.

## Parameters

| Parameter | Type | Required | Default | |
| --- | --- | --- | --- | --- |
| `text` | string | yes | | The visible text. It is written as plain text, and markdown in it is not read |
| `url` | string | yes | | The address. It must use an [allowed scheme](#allowed-url-schemes) |
| `new-tab` | bool | no | `false` | `true` opens the link in a new tab |
| `current` | string | no | `""` | Marks the link as the current item, for example the current page in a menu ([Current](#current)) |

`text` and `url` are trimmed, and neither can be empty.

The `<a>` has only these attributes, in this order:

- `href`, always.
- `target="_blank"` and `rel="noopener noreferrer"`, when `new-tab` is `true`.
- `aria-current`, when `current` is not empty.

## Current

`current` says that the link is where the visitor is now in a group of links: the current page in a menu, the last item of a breadcrumb or the current step of a form. Screen readers announce it. A theme styles it with `a[aria-current="page"]`.

```text
{{ LINK text = "Home" url = "/" current = "page" }}
```

```html
<a href="/" aria-current="page">Home</a>
```

The value is one of:

| Value | |
| --- | --- |
| `""` | Not the current item. `aria-current` is not written |
| `page`, `step`, `location`, `date`, `time`, `true` | Written as `aria-current`. Values are case-sensitive: `Page` is an error |
| `__auto` | Umono decides between `page` and `""` ([`__auto`](#__auto)). Since Umono v0.10 |

### `__auto`

With `current = "__auto"`, Umono marks the link when its `url` is the address of the page being rendered. The link then writes `aria-current="page"`, the same as `current = "page"`. Any other link writes nothing, the same as `current = ""`.

This lets a menu be one value that is the same on every page. A menu of [`umono/page v0.1`](/reference/contracts/umono-page-v0-1/) writes each entry with:

```text
{{ LINK text = item.text url = item.url current = item.current }}
```

With `__auto` in every entry, the menu is kept once in [custom context](/writing-content/custom-context/#the-menu):

```text
[
  { text: "Home", url: "/", current: "__auto", children: [] },
  { text: "Blog", url: "/blog", current: "__auto", children: [] }
]
```

On `/blog`, only the second link is marked:

```html
<a href="/">Home</a>
<a href="/blog" aria-current="page">Blog</a>
```

- `__auto` can be written directly in the call or come from a parameter, a record or `context(…)`.
- In a theme's contract, a `current = "__auto"` written directly in the call makes the theme need [Theme API 2](/reference/theme-api/#features-of-theme-api-2). An `__auto` from page data does not.
- The query, the fragment and a trailing `/` of `url` are ignored. A `url` with a scheme or a host never matches. The full rules are in [Custom context](/writing-content/custom-context/#the-menu).
- No link is marked on the not-found page, in the preview of a new page that is not saved yet or in the preview of a global component.
- A value that starts with `__` is never written to the HTML. `__auto` is the only one, and any other, such as `__current`, is an error. This is only for `current`: in other parameters and in text, `__` is plain text.

## Allowed URL schemes

`url` must use `http`, `https`, `mailto` or `tel`, or be a relative address: `/docs`, `docs`, `#part`, `?page=2` or `//cdn.example.com`. Any other scheme, such as `javascript:` or `data:`, is an error and the link is left out. The same rule applies to markdown links and to the addresses of `IMAGE`.

The scheme is read the way a browser reads it: spaces at the start and the end are trimmed, tabs and line breaks inside the address are removed, and the case does not matter. `JavaScript:` is rejected too.

A relative address whose first part has a `:`, such as `docs:intro`, is read as a scheme. Write it as `./docs:intro`.

## Errors

When a `LINK` has an error, the link is left out. The published pages with errors are listed under **System → Errors**.

| Error | When |
| --- | --- |
| `invalid-built-in-arguments` | `text` or `url` is missing |
| `empty-text` | `text` is empty |
| `empty-url` | `url` is empty |
| `disallowed-url-scheme` | `url` uses a scheme that is not [allowed](#allowed-url-schemes) |
| `invalid-current-value` | `current` is not one of the [values](#current) |
