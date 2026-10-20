---
title: What is Umono?
description: Umono is an open-source CMS that keeps your content, its presentation and the platform apart, so that none of them locks in the others.
sidebar:
  label: Introduction
---

Umono is an open-source content management system. It runs as a single program, keeps its data in one SQLite file, and is built so that your content, the theme that presents it and Umono itself never lock each other in.

## How a Umono site is made

A Umono site has three layers, and each one does a single job.

**Content is yours.** Pages are written in Compono, a language made for Umono. It is Markdown for text, plus components: built-in ones such as `LINK`, `IMAGE`, `LIST` and `DETAILS`, and components you define yourself and reuse across pages. Compono says what the content is, not how it looks. There is no raw HTML, no inline style and no script in content.

**Layouts give pages a structure.** A layout is a header, a menu, the content and a footer, or a blog post with its title and date. Layouts come from contracts. A contract is a published description of a kind of site, such as `umono/page` for a site of pages or `umono/blog` for a blog. You bind a page to a layout of a contract and give it your text, your menu and your content.

**Themes give the structure a look.** A theme is CSS, fonts and images written for one contract. Every theme of a contract styles the same structure, so you can replace a theme with another one for the same contract without changing a page.

## What Umono keeps

- **A theme cannot change your content.** It only styles it. A theme cannot run a script, add or change text, change a link or load anything from another site. Umono checks a theme when it is built, when it is installed and when it is activated.
- **Pages load only from places you chose.** Styles, scripts and fonts come only from your site. Images come from your site, the storage you configured or an address you wrote in your content. Every page is served with a strict Content-Security-Policy that enforces this.
- **Visitors never see an error.** When a part of a page cannot be rendered, it is left out of the page, and the error is listed in the admin panel with its place in the content.
- **Contracts never change.** A contract is published once on [umono.dev](https://umono.dev) and is never edited or removed. A theme written for it today keeps the same structure to style tomorrow.
- **Updates do not break themes silently.** Each Umono release states which Theme API versions it supports. `umono upgrade` stops when an installed theme would not work with the new release, and tells you which one.

## What it runs on

Umono runs on Linux and macOS, on amd64 and arm64. The Umono CLI creates, starts and updates a site, and it is also the tool to develop themes.

A site comes with an admin panel in twelve languages, a media library for PNG, JPEG and WebP images on local or S3-compatible storage with responsive variants, a sitemap, `robots.txt` and a customizable 404 page.

Modules, to extend what a site can do, are planned. They will be documented here when they arrive.

## Get started

[Install the CLI](/getting-started/installation/) and [create your first site](/getting-started/your-first-site/).
