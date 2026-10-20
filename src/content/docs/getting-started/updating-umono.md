---
title: Updating Umono
description: Move a site to the latest Umono release with umono upgrade.
sidebar:
  order: 3
---

`umono upgrade` moves a site to the latest Umono release. Run it in the site directory:

```sh
umono upgrade
umono restart
```

The upgrade replaces the `umono` program and `umono.json`. Your content and settings stay where they are: `umono.db`, `.env`, `uploads/` and `themes/` are not touched. The running Umono keeps running the old version until it is restarted. On the next start, Umono updates the database to the new version by itself.

## Before the download

The upgrade checks two things first and stops when one fails, before anything is changed:

- **The CLI.** A release can require a newer CLI than yours. Then [update the CLI](/getting-started/installation/#update-the-cli) and run `umono upgrade` again.
- **The installed themes.** Every Umono release supports a range of Theme API versions, and every theme is built for one of them. The CLI does not know which of your themes are active, so it checks all of them under `themes/`. When a theme is outside the range of the new release, the upgrade stops and lists the themes and the reason.

`umono upgrade --allow-theme-break` upgrades anyway and only lists the themes. An active theme among them stops working after the restart: its pages keep their content and are rendered in Umono's default look until you activate a theme that works with the new release.
