---
title: umono/blog v0.1
description: The official contract of a blog, with post, post list and free content pages.
---

A blog with posts, lists of posts and pages of free content. Its official theme is [Folio](/themes/official-themes/#folio).

| | |
| --- | --- |
| Reference | `umono/blog@v0.1` |
| Registry | [`https://umono.dev/registry/v1/contracts/umono/blog/v0.1`](https://umono.dev/registry/v1/contracts/umono/blog/v0.1) |
| License | [MIT-0](https://umono.dev/license) |
| Layouts | `post`, `post-list`, `page` |
| Exposed components | `MAIN_MENU` |

Every page of a group is rendered with the active theme of that group. That is why the blog has its own `page` layout for pages outside the blog, such as About or the 404 page: bound to `umono/page`, they would be rendered with another theme.

## Shared parameters

Every layout has the site header and the footer of [`umono/page v0.1`](/reference/contracts/umono-page-v0-1/#page), with the same parameters: `site-name`, `home-url`, `menu-label`, `menu` and `footer`. Every parameter of every layout is required. An empty value is still a valid value.

## `post`

A single post with its cover and related posts.

| Parameter | Type | Meaning |
| --- | --- | --- |
| `title` | string | The title of the post, the `h1` in its `header` |
| `published-at` | string | The publication date, in the format you choose. Empty writes no paragraph |
| `cover` | record | The cover image, a media record such as `context(media-by-alias/cover)` |
| `cover-alt` | string | The alternative text of the cover. A decorative cover is written explicitly as `""` |
| `content` | component | The body of the post. Its headings start at `##`, since `h1` is the title |
| `related-label` | string | The heading of the related posts |
| `related` | array | The related posts. Every entry has `title` and `url` |

```html
<umono-root>
  <header>…</header>
  <main>
    <article>
      <header>
        <h1>Title</h1>
        <p>20 October 2026</p>
      </header>
      <picture>…<img alt="…"></picture>
      …content…
    </article>
    <aside>
      <h2>Related posts</h2>
      <ul>
        <li><a href="/a-post">A post</a></li>
      </ul>
    </aside>
  </main>
  <footer>…</footer>
</umono-root>
```

## `post-list`

A list of post summaries.

| Parameter | Type | Meaning |
| --- | --- | --- |
| `title` | string | The heading of the list |
| `posts` | array | The summaries. Every entry has `title`, `url` and `summary` |
| `more-label` | string | The text of the link at the end of every summary |

```html
<main>
  <h1>Blog</h1>
  <ul>
    <li>
      <article>
        <h2><a href="/a-post">A post</a></h2>
        <p>The summary.</p>
        <a href="/a-post">Read more</a>
      </article>
    </li>
  </ul>
</main>
```

## `page`

Free content between the site header and the footer, the same as the `page` layout of `umono/page v0.1`.

## Addresses

The layouts are `post`, `post-list` and `page`, and the exposed component is `MAIN_MENU`. Every address starts with the layout: the links of the menu are `post MAIN_MENU LINK`, `post-list MAIN_MENU LINK` and `page MAIN_MENU LINK`. Everything else, the post with its cover, the related posts and the summaries included, is in the scope of its layout: `post IMAGE` matches the cover and the images of the content.

## Source

The published file, under MIT-0:

```toml
schema      = "https://umono.dev/schemas/theme-contract/v1"
id          = "umono/blog"
version     = "v0.1"
description = "A blog with post, post list and free content pages"

[[layouts]]
id          = "post"
description = "A single post with its cover and related posts"
source = '''
~ site-name! = "" home-url! = "" menu-label! = "" menu! = [] title! = "" published-at! = "" cover! = {} cover-alt! = "" content! = NO_MATTER related-label! = "" related! = [] footer! = NO_MATTER
{{ SITE_HEADER site-name = site-name home-url = home-url menu-label = menu-label menu = menu }}
{{ MAIN content = POST(title = title published-at = published-at cover = cover cover-alt = cover-alt content = content related-label = related-label related = related) }}
{{ FOOTER content = footer }}

~ POST title! = "" published-at! = "" cover! = {} cover-alt! = "" content! = NO_MATTER related-label! = "" related! = []
{{ ARTICLE content = POST_BODY(title = title published-at = published-at cover = cover cover-alt = cover-alt content = content) }}
{{ ASIDE content = RELATED(related-label = related-label related = related) }}

~ POST_BODY title! = "" published-at! = "" cover! = {} cover-alt! = "" content! = NO_MATTER
{{ HEADER content = POST_HEADER(title = title published-at = published-at) }}
{{ IMAGE media = cover alt = cover-alt }}
{{ content }}

~ POST_HEADER title! = "" published-at! = ""
# {{ title }}
{{ published-at }}

~ RELATED related-label! = "" related! = []
## {{ related-label }}
{{ LIST items = related item = RELATED_ITEM }}

~ RELATED_ITEM item! = {}
{{ LINK text = item.title url = item.url }}
'''

[[layouts]]
id          = "post-list"
description = "A list of post summaries"
source = '''
~ site-name! = "" home-url! = "" menu-label! = "" menu! = [] title! = "" posts! = [] more-label! = "" footer! = NO_MATTER
{{ SITE_HEADER site-name = site-name home-url = home-url menu-label = menu-label menu = menu }}
{{ MAIN content = POST_LIST(title = title posts = posts more-label = more-label) }}
{{ FOOTER content = footer }}

~ POST_LIST title! = "" posts! = [] more-label! = ""
# {{ title }}
{{ LIST items = posts item = POST_SUMMARY(more-label = more-label) }}

~ POST_SUMMARY item! = {} more-label! = ""
{{ ARTICLE content = SUMMARY(item = item more-label = more-label) }}

~ SUMMARY item! = {} more-label! = ""
## {{ LINK text = item.title url = item.url }}
{{ item.summary }}
{{ LINK text = more-label url = item.url }}
'''

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
