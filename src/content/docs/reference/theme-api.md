---
title: Theme API
description: Theme API versions, which Umono and CLI releases support them, and the features of Theme API 1.
---

The Theme API is everything a theme relies on: the rules of its files, the HTML it styles and the frame around it. Its version is a single, growing number.

- A theme declares the version it needs as `theme-api-version` in `built.toml`. The build detects it. It is never written by hand.
- A Umono release supports a range, `theme_api_min` to `theme_api_current` in its `umono.json`. It activates a theme when `theme_api_min ≤ theme-api-version ≤ theme_api_current`.
- Umono does not trust the number in a package. On install and activation it detects the features the theme uses again, and refuses a theme that declares less than it uses.
- Umono renders every theme it accepts the same way. The version is only a gate.

## Versions

| Theme API | Since | |
| --- | --- | --- |
| 1 | Umono v0.9.0, CLI v0.3.0 | The first Theme API |

| Umono | `theme_api_min` | `theme_api_current` |
| --- | --- | --- |
| v0.9.0 | 1 | 1 |

## How the version changes

- **A new feature** raises `theme_api_current`. Older themes keep working, and a theme that uses the feature needs the new version.
- **A breaking change** raises both numbers. Themes below the new minimum stop working on that release.

The Theme API breaks once, planned, with Umono v1. Until then, the only exception is a security fix that cannot be made otherwise. A security fix that can refuse just the themes using a dangerous construct does so, without changing the numbers. `umono upgrade` checks the installed themes before it upgrades.

Contract versions are separate from the Theme API. Publishing a contract does not change it.

## Features of Theme API 1

The build prints the features a theme uses, with the place it found each one:

```text
theme-api-version: 1
  ← attributes.toml                       pkg.attributes (API 1)
  ← page                                  attr.class (API 1)
  ← contract.toml:layouts[0].source:3     compono.builtin.main (API 1)
  ← theme_api_min                         1
```

| Feature | Detected from |
| --- | --- |
| `pkg.attributes` | `attributes.toml` in the package |
| `pkg.license` | `LICENSE` in the package |
| `attr.class`, `attr.sizes` | An attribute in `attributes.toml` |
| `attr.address.layout`, `attr.address.layout-builtin`, `attr.address.layout-component-builtin` | An address form in `attributes.toml` |
| `assets.woff2`, `assets.woff`, `assets.png`, `assets.jpeg`, `assets.jpg`, `assets.webp`, `assets.avif`, `assets.gif` | A file under `assets/` |
| `css.at.media`, `css.at.supports`, `css.at.layer`, `css.at.font-face`, `css.at.keyframes` | An at-rule in the stylesheet |
| `compono.builtin.link`, `.image`, `.nav`, `.list`, `.details`, `.header`, `.main`, `.footer`, `.article`, `.aside` | A built-in used by the contract, or filtered by an address |
| `compono.markdown.heading`, `.p`, `.br`, `.em`, `.strong`, `.link`, `.inline-code`, `.code-block`, `.list`, `.blockquote`, `.hr`, `.table` | A Markdown element used by the contract |

Everything a theme relies on without using it explicitly is the base of Theme API 1 and is not listed: the frame and `<umono-root>`, the [CSS rules](/reference/theme-css/), the package format and limits, the scope model of addresses, the frozen HTML of Compono, and the Content-Security-Policy.

## The frozen HTML

The HTML that Compono produces for a given content is part of the Theme API and does not change during Umono 0.x. Even where it deviates from Compono's specification, it stays as it is, so that themes can rely on what they see. Such deviations are fixed together in Umono v1 and listed in its migration notes.

Not part of the guarantee:

- What is inside a `<picture>`: the number, order and types of its `<source>` elements and their URLs come from the media library and can change between images and Umono releases. The `<img>` is always the last child of the `<picture>`.
- The look of a theme in right-to-left and other languages, which is the theme author's responsibility.
- Browsers without `@scope`, which do not apply the stylesheet of a theme.
