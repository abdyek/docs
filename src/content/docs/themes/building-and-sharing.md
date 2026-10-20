---
title: Building and sharing
description: Build a theme into a package, version it, license it and publish it.
sidebar:
  order: 6
---

## Build

Run in the theme project:

```sh
umono theme build
```

The build:

1. Fetches the contract of `theme.toml` from umono.dev, unless it is already in `.dev/contracts/`.
2. Checks every file: `theme.toml`, the stylesheet, the assets, `attributes.toml` against the contract, and `LICENSE`. The first failed check stops the build and leaves `dist/` untouched.
3. Detects the Theme API version the theme needs and prints it with its reasons.
4. Prints warnings, for example a root class selected without `:scope`. Warnings do not stop the build.
5. Writes `dist/{org}_{id}_{version}.umono-theme`, for example `dist/acme_my-theme_0.1.0.umono-theme`.

The package is a zip file with:

| File | |
| --- | --- |
| `built.toml` | The values of `theme.toml`, with the detected `theme-api-version` and the build time |
| `contract.toml` | The contract the theme is built for |
| `assets/` | The stylesheet, rewritten into its checked form, and the other assets |
| `attributes.toml` | When the project has one |
| `LICENSE` | When the project has one |
| `checksums.json` | The SHA-256 of every file |

The stylesheet in the package is not your file. It is the checked form of it, wrapped in `@scope (umono-root)`, without comments. Umono checks it again on install and activation, so a package edited by hand is refused.

## Versions

`version` in `theme.toml` is `MAJOR.MINOR.PATCH`, with no `v` and no suffix. Raise it for every release: semantic versioning is recommended, and Umono treats every version as a theme of its own. A site can have several versions of a theme installed, and the site owner chooses which one is active.

An installed version cannot be changed. Installing the same version again needs `umono theme install --force`, and the new content waits until the site owner approves it in the admin panel. Release a new version instead.

## License

The license of a theme is your choice. Two places hold it:

- `license` in `theme.toml`, an SPDX expression such as `MIT` or `MIT OR Apache-2.0`.
- `LICENSE` at the root of the project. The build copies it into the package unchanged. Put the license of the theme there, and the notices of everything it includes: the SIL Open Font License of a font, the MIT notice of a CSS reset.

Notices in CSS comments are removed from the package, `/*! … */` included. The build warns when it finds one, so that you can move it to `LICENSE`. `LICENSE` is part of the package but is not served to visitors.

`umono theme create --license MIT` writes the `license` field but no `LICENSE` file, and reminds you to add one.

Contracts are published under MIT-0, so they put no condition on the license of a theme.

## Share it

There is no theme marketplace yet. Share the `.umono-theme` file directly. The official themes are released this way: each one has its own repository with the project, and every release carries the package as an asset. The tag is the version, `v0.1.0`.

Commit the project, not the package: `.gitignore` keeps `dist/` and `.dev/` out. Anyone who clones the repository gets the contract and the development server back with the first `umono theme dev`.

## Keep up with Umono

The development server in `.dev/server` is the latest Umono release at the time of the first `dev`, and it never updates by itself. When a newer Umono supports a different range of the Theme API than your CLI, `dev` warns at start. Then:

```sh
umono theme dev --update-server
```

This moves `.dev/server` to the latest release and keeps its pages. To start over with an empty site, delete `.dev/server`.

A CLI can only build for the Theme API versions it knows. When a new Umono release brings a new Theme API version, update the CLI to use its features.
