---
title: CLI
description: Every command and flag of the Umono CLI.
---

The Umono CLI is installed with `curl -fsSL https://umono.io/install.sh | sh` ([Installation](/getting-started/installation/)). Every command exits with `0` on success and a non-zero code on an error.

## Sites

The site commands run in the directory of a site, except `create`.

### `umono create <name>`

Creates a site in the new directory `<name>` with the latest Umono release. Asks for the username and password of the admin account and the port (`8999` by default). Downloads the release for the platform, verifies its checksum and writes `.env`. Stops when the directory exists or when the release requires a newer CLI.

### `umono up`

Starts Umono in the foreground. Does nothing when it is already running.

| Flag | |
| --- | --- |
| `-d`, `--detach` | Run in the background |

### `umono down`

Stops Umono.

### `umono restart`

Stops and starts Umono.

| Flag | |
| --- | --- |
| `-d`, `--detach` | Start in the background |

### `umono status`

Shows whether Umono is running, with its process ID, port and address.

### `umono upgrade`

Moves the site to the latest Umono release ([Updating Umono](/getting-started/updating-umono/)). Replaces the `umono` program and `umono.json` and keeps `umono.db`, `.env`, `uploads/` and `themes/`. Stops before any change when the release requires a newer CLI or when an installed theme is outside the Theme API range of the release. Restart Umono afterwards.

| Flag | |
| --- | --- |
| `--allow-theme-break` | Upgrade even when an installed theme would not work with the new release. Lists the themes |

### `umono secret init`

Generates `UMONO_SECRET`, the key that encrypts stored secrets such as storage credentials, and adds it to `.env`, when it is not set yet. `umono create` already sets it. Umono must be stopped.

### `umono secret rotate`

Generates a new `UMONO_SECRET` and re-encrypts every stored secret with it. The old `.env` is kept as `.env.old` while the rotation runs and removed when it succeeds. Umono must be stopped.

### `umono version`

Prints the version of the CLI.

## Themes

### `umono theme create <name>`

Creates a theme project in the new directory `<name>` with `theme.toml`, `assets/theme.css` (Umono's default look), `.gitignore` and the contract in `.dev/contracts/`. Every value that is not given as a flag is asked. Nothing is written until every value is valid, and an existing file or directory is never overwritten.

| Flag | `theme.toml` key | Required |
| --- | --- | --- |
| `--id` | `id`, `org/id` | Yes |
| `--name` | `name` | Yes |
| `--contract` | `contract`, `org/id@vMAJOR.MINOR` | Yes |
| `--version` | `version`, `0.1.0` by default | No |
| `--description` | `description` | No |
| `--license` | `license`, an SPDX expression | No |
| `--homepage` | `homepage`, an `https://` URL | No |
| `--repository` | `repository`, an `https://` URL | No |
| `--author-name` | `[[authors]] name` | No |
| `--author-url` | `[[authors]] url`, an `https://` URL | No |
| `--no-input` | Ask nothing. A missing required flag is an error | — |

Nothing is asked either when standard input is not a terminal. When the contract cannot be fetched, the project is still created with a warning: `dev` and `build` fetch it later.

### `umono theme dev`

Runs in a theme project. Starts a Umono in `.dev/server` with the theme, behind a proxy at `http://localhost:8990`. The admin panel at `/admin` needs no login. The first run fetches the contract when it is missing and installs the latest Umono release into `.dev/server` with an empty database. After that, `dev` works offline.

- A change of `assets/theme.css` swaps the stylesheet without a reload. Other changes under `assets/` and changes of `attributes.toml` and `theme.toml` reload the page.
- The checks of `build` run on every change. Errors and warnings show in an overlay on the page.
- A new `contract` in `theme.toml` is fetched when missing, and the server restarts with it.
- `.dev/server` never updates by itself. `dev` warns at start when its Theme API range differs from the CLI's, and stops when no theme the CLI builds could run on it.

| Flag | |
| --- | --- |
| `--port` | Port of the proxy, `8990` by default |
| `--update-server` | Move `.dev/server` to the latest Umono release first, keeping its database |

### `umono theme build`

Runs in a theme project. Checks the theme, detects its Theme API version and writes `dist/{org}_{id}_{version}.umono-theme`. Prints the Theme API version with its reasons, and warnings. A failed check stops the build and leaves `dist/` untouched ([Building and sharing](/themes/building-and-sharing/)).

### `umono theme install <file>`

Runs in the directory of a site with Umono v0.9 or later. Checks the package with the checks of activation and installs it read-only under `themes/{org}/{id}/{version}/`. Works offline. A package larger than 64 MB is refused before it is read ([Installing a theme](/themes/installing-a-theme/)).

| Flag | |
| --- | --- |
| `--force` | Reinstall an installed version. The package waits in `themes-pending/{org}/{id}/{version}/` until it is approved in the admin panel |
| `--allow-incompatible-api` | Install a theme whose Theme API version is outside the range of this Umono. It cannot be activated until Umono supports it |

A theme with a Theme API version newer than the CLI knows is refused even with `--allow-incompatible-api`.
