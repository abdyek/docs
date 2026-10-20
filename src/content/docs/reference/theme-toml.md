---
title: theme.toml
description: The keys of theme.toml, the manifest of a theme project.
---

`theme.toml` is at the root of a theme project. `umono theme create` writes its first version, and the CLI reads it in `dev` and `build`. It does not go into the package: the build turns it into `built.toml`.

| | |
| --- | --- |
| Schema | `https://umono.dev/schemas/theme-manifest/v1` |
| Format | TOML v1.0.0, UTF-8 |
| Checked by | `umono theme build` |

```toml
schema = "https://umono.dev/schemas/theme-manifest/v1"
id = "acme/minimal"
contract = "umono/blog@v0.1"
name = "Minimal Blog"
version = "0.1.0"
description = "Clean blog theme for Umono."
license = "MIT"
homepage = "https://example.com/minimal"
repository = "https://example.com/minimal.git"

[[authors]]
name = "Acme"
url = "https://example.com"
```

## Keys

| Key | Type | Required | Rule |
| --- | --- | --- | --- |
| `schema` | string | Yes | Exactly `https://umono.dev/schemas/theme-manifest/v1` |
| `id` | string | Yes | `org/id`. Both parts are kebab case: `[a-z0-9]+(-[a-z0-9]+)*`. Cannot be `dev/dev` |
| `contract` | string | Yes | `org/id@vMAJOR.MINOR`, for example `umono/page@v0.1`. `MAJOR` and `MINOR` have no leading zeros |
| `name` | string | Yes | Not empty, at most 64 characters |
| `version` | string | Yes | `MAJOR.MINOR.PATCH` with no leading zeros, no `v`, no pre-release and no build metadata |
| `description` | string | No | At most 280 characters |
| `license` | string | No | An SPDX expression, such as `MIT`, `MIT OR Apache-2.0` or `LicenseRef-Acme`. Only its syntax is checked |
| `homepage` | string | No | An absolute `https://` URL, at most 2048 bytes |
| `repository` | string | No | An absolute `https://` URL, at most 2048 bytes |
| `authors` | array of tables | No | At least one entry |

### `authors`

| Key | Type | Required | Rule |
| --- | --- | --- | --- |
| `name` | string | Yes | Not empty, at most 64 characters |
| `url` | string | No | An absolute `https://` URL, at most 2048 bytes |

## General rules

These hold for every file of the theme system:

- An unknown key is an error, at every level. It is never ignored.
- Text values are a single line: no control characters, and no whitespace at the start or the end.
- How the TOML is written (tables, dotted keys, inline tables) does not matter.
- The schema URL serves a JSON Schema for editor support, for example with Taplo. A few rules, like the grammar of SPDX expressions, are checked only by the CLI.

## What it becomes

`umono theme build` writes `built.toml` into the package. It has the same keys, with the schema `https://umono.dev/schemas/theme-built/v1`, plus:

| Key | |
| --- | --- |
| `theme-api-version` | The Theme API version the build detected |
| `built-at` | The time of the build |
