---
title: Installing a theme
description: Install, activate, switch, update and remove themes on a Umono site.
sidebar:
  order: 7
---

This page is for site owners. A theme comes as a `.umono-theme` file. It is installed with the CLI and activated in the admin panel.

## Install

Run in the site directory, the one with `umono.json`:

```sh
umono theme install ~/Downloads/umono_octavo_0.1.0.umono-theme
```

The CLI checks the package with the same checks Umono runs on activation, and installs it read-only under `themes/{org}/{id}/{version}/`. It needs no network and does not touch the database.

| Flag | |
| --- | --- |
| `--force` | Install a version that is already installed. The installed theme is not touched: the package waits in `themes-pending/` until you approve it in the admin panel |
| `--allow-incompatible-api` | Install a theme whose Theme API version this Umono does not support. It cannot be activated until Umono supports it |

When the theme needs a newer Theme API than the CLI knows, the CLI cannot check it and refuses it, with or without `--allow-incompatible-api`. Update the CLI.

## Activate

Open **Settings → Themes**. Installed themes are listed by contract group, for example `umono/page v0.1`, with the number of pages bound to the group. Click **Activate** next to a theme.

Umono checks the theme again before it activates it. The first time a contract version is activated on a site, Umono verifies it on [umono.dev](https://umono.dev) with a single request that carries no site address and no Umono version. After that, the contract is stored on the site and umono.dev is not asked again. A site that cannot reach umono.dev cannot activate a contract version it has not stored yet.

Each group has at most one active theme. Activating another theme of the group replaces the active one in one step. Every page bound to the group changes its look on the next page load, and no page changes its content.

## Bind pages

A page uses a theme when it is bound to a layout of the theme's contract. Choose the layout in the **Layout** field of the page editor. The field lists the parameters of the layout, and the content of the page becomes a single `UMONO_LAYOUT` call with them ([Your first site](/getting-started/your-first-site/#bind-the-page-to-a-layout)). The 404 page has the same field, under **Settings → 404 Page**.

A layout can only be chosen once its contract is stored on the site, which happens when a theme of the contract is first activated.

## Deactivate

**Deactivate** next to the active theme returns the group to Umono's default look. The theme stays installed, and the pages keep their bindings and content.

## Pages bound to newer versions

From v1 on, a newer minor version of a contract covers the older ones: a theme for `v1.3` renders pages bound to `v1.2`. The other way around does not work. When pages of a group are bound to a newer minor version than a theme's contract, that theme cannot be selected, and the list says how many pages are in the way. Each `v0` minor version, like `umono/page v0.1`, is a group of its own.

## When a theme breaks

On every start, Umono checks the files of the active themes again. If a theme was changed on disk, deleted, or is no longer supported after an upgrade with `--allow-theme-break`, Umono still starts. The theme is marked **Broken** with the reason, and its group is shown in the default look. **Retry** runs the checks again, **Deactivate** turns the theme off.

## Reinstall with `--force`

A reinstalled version waits in `themes-pending/`. The theme's row in the admin panel shows what changed, file by file. **Use the new content** runs the checks of activation on it and replaces the installed theme. **Reject** deletes it. Until then, the site keeps using the installed content.

## Remove

There is no remove command yet. Deactivate the theme if it is active, then delete its directory. The files are read-only, so make them writable first:

```sh
chmod -R u+w themes/acme/minimal/0.1.0 && rm -rf themes/acme/minimal/0.1.0
```

Deleting the directory of an active theme breaks it: its group falls back to the default look until you deactivate it or install it again.
