---
title: Your first site
description: Create a Umono site, write its home page and give it a theme.
sidebar:
  order: 2
---

This page takes you from an empty directory to a site with a home page and a theme. It needs the [Umono CLI](/getting-started/installation/).

## Create the site

```sh
umono create my-website
```

The command asks for three things:

- **Username** and **Password** of the admin account. They are stored hashed in `.env`.
- **Port** the site listens on. Press Enter for `8999`.

It then downloads the latest Umono release for your platform, verifies its checksum and sets the site up in the new directory `my-website`:

| File | What it is |
| --- | --- |
| `umono` | The Umono program |
| `umono.json` | Which CLI and which themes this Umono release works with |
| `.env` | The configuration: the port, the database file, the admin account and the key that encrypts stored secrets |
| `.env.example` | The configuration keys with their defaults |

The database, `umono.db`, is created on the first start. Media you upload is stored under `uploads/`, and themes you install under `themes/`.

## Start it

```sh
cd my-website
umono up
```

Umono runs in the terminal until you stop it with <kbd>Ctrl</kbd>+<kbd>C</kbd>. To run it in the background, use `umono up -d`. The other commands work in the site directory as well:

| Command | What it does |
| --- | --- |
| `umono status` | Shows whether Umono is running, and its port and address |
| `umono down` | Stops Umono |
| `umono restart` | Stops and starts Umono. `-d` starts it in the background |

Open the admin panel at `http://127.0.0.1:8999/admin` and sign in with the account you chose.

## Write the home page

A new site has no pages, so its address answers with the 404 page. The admin panel opens on **Create Page**:

1. Enter `Home` as the **Name**.
2. Leave the **Slug** empty. The page with the empty slug is the home page, at `/`. Other pages are served at `/<slug>`.
3. Write the content:

   ```text
   # Hello

   This is my first page, written in **Compono**.

   {{ LINK text = "Umono on GitHub" url = "https://github.com/umono-cms/umono" }}
   ```

   Compono is Markdown with components. `LINK` is one of the built-in components, and the preview on the right renders the page while you type.
4. Turn on **Enabled**. A page is published only while it is enabled.
5. Click **Create**.

Open `http://127.0.0.1:8999/`. The page is there, in Umono's default look: no theme is active yet.

## Give it a theme

A theme gives a site its look. [Octavo](https://github.com/umono-cms/theme-octavo) is the official theme for sites made of pages with a header, a menu and a footer, the `umono/page` contract.

1. Download `umono_octavo_0.1.0.umono-theme` from the [latest Octavo release](https://github.com/umono-cms/theme-octavo/releases/latest).
2. Install it in the site directory:

   ```sh
   umono theme install ~/Downloads/umono_octavo_0.1.0.umono-theme
   ```

   The CLI checks the package and installs it under `themes/umono/octavo/0.1.0/`.
3. In the admin panel, open **Settings → Themes** and click **Activate** next to Octavo.

   Umono checks the theme again and verifies its contract on [umono.dev](https://umono.dev) with a single request that carries no site address. Each contract version is verified once per site. Later activations of themes for the same contract version do not ask umono.dev.

## Bind the page to a layout

Octavo styles the `page` layout of `umono/page v0.1`: the site header with a menu, the content, and a footer. A page gets that structure when it is bound to the layout.

1. Open the **Home** page.
2. Choose `umono/page v0.1 · page` in **Layout**. The field lists the parameters of the layout.
3. Replace the content with a call of the layout:

   ```text
   {{ UMONO_LAYOUT
     site-name = "My website" home-url = "/" menu-label = "Main menu"
     menu = [
       { text: "Home", url: "/", current: "page", children: [] }
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

   The content of a page with a layout is a single `UMONO_LAYOUT` call. Everything the layout shows comes from you through its parameters: the site name, the menu, the content and the footer. `BODY` and `FOOTER_BODY` are components defined below the call, so the page and the footer can hold any content.
4. Click **Save** and open `http://127.0.0.1:8999/` again. The preview in the editor shows the structure of the page but not the theme. **View page** opens the page as visitors see it.

The page now has Octavo's header, menu and footer. Every page bound to a layout of `umono/page v0.1` is rendered with the active theme of that contract. When you activate another theme for it, every such page changes its look, and none of them changes its content.

## Next

Keep the site current with [`umono upgrade`](/getting-started/updating-umono/).
