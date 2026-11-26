---
title: Using a mirror
description: Serve the contracts of umono.dev from your own server, point Umono and the CLI at it with UMONO_REGISTRY and verify the files with the public key.
sidebar:
  order: 9
---

This page is for site owners and theme developers. A mirror is a server of your own that serves the files of [umono.dev](https://umono.dev) at the same paths. Use one when your site or your theme project cannot or should not reach umono.dev, for example on a network that is closed to the internet. Since Umono v0.10 and CLI v0.5.0.

A mirror only serves contracts. Contracts are still published only on umono.dev, and the mirror cannot change them: every contract is signed, and Umono and the CLI verify the signature with a key they already have.

## When Umono asks the registry

Umono asks the registry once per contract version, the first time a theme of that version is activated on the site ([Installing a theme](/themes/installing-a-theme/#activate)). It downloads only the signature of the contract and verifies the `contract.toml` in the theme's package with it. After that, the contract is stored on the site and the registry is not asked again.

So a mirror is needed only to activate a contract version the site has not stored yet.

## Files to copy

For every contract version your themes use, copy two files from umono.dev:

| File | Path |
| --- | --- |
| The contract | `/registry/v1/contracts/{org}/{id}/v{major}.{minor}` |
| Its signature | `/registry/v1/contracts/{org}/{id}/v{major}.{minor}.minisig` |

For `umono/page v0.1`:

```sh
curl -O https://umono.dev/registry/v1/contracts/umono/page/v0.1
curl -O https://umono.dev/registry/v1/contracts/umono/page/v0.1.minisig
```

Serve them at the same paths under the root of your mirror, for example `https://registry.example.lan/registry/v1/contracts/umono/page/v0.1.minisig`. Any static file server works. There is no index file: copy only the contracts you use. Umono requests only the `.minisig`. The CLI requests the contract and then its signature, so a mirror that theme developers use must serve both files. Either way, keep the contract next to its signature so the pair can be checked at any time.

The mirror must answer `200` with the file, or `404` when it does not have it. Umono and the CLI read `404` as a contract that is not published. Any other answer, or no answer, is a registry that cannot be reached.

## Point Umono at the mirror

Add `UMONO_REGISTRY` to the `.env` of the site and restart Umono:

```sh
UMONO_REGISTRY=https://registry.example.lan
```

- The value is the root URL of the mirror, with `http` or `https`. It cannot have a query, a fragment or a user name. A trailing `/` is ignored.
- When it is set, the mirror replaces umono.dev completely. Umono never falls back to umono.dev, so you always know which server is asked.
- With a value that is not valid, Umono does not start.
- Without the variable, Umono asks umono.dev.

`http` is enough, because the signature, not the connection, proves the contract. The request is the same as to umono.dev: a single `GET` with no site address, no Umono version, no query and no cookie.

The confirm of **Activate** in **Settings → Themes** names the host that will be asked, so you can check that it is your mirror.

## When the verification fails

Activation is refused and nothing is written when:

- **The mirror cannot be reached**, or answers with something other than `200` or `404`.
- **The mirror has no signature** for the contract (`404`): the contract counts as not published.
- **The signature does not verify:** "The contract in the theme's package is not the published contract." The package has a contract that was not published like this, or the mirror serves a wrong or damaged signature. Copy the signature from umono.dev again.

## Point the CLI at the mirror

For theme developers. The CLI reads `UMONO_REGISTRY` from the environment of the shell. Unlike Umono, it does not read a `.env` file, so writing the value into one changes nothing. Export it, or write it before the command:

```sh
export UMONO_REGISTRY=https://registry.example.lan
umono theme dev
```

```sh
UMONO_REGISTRY=https://registry.example.lan umono theme build
```

- `umono theme create`, `umono theme dev` and `umono theme build` use it. `umono theme install` does not ask the registry and does not read it.
- The value follows the [same rules](#point-umono-at-the-mirror) as for Umono. With a value that is not valid, the three commands stop at start, even when the contract is already in `.dev/contracts/`.
- When it is set, the mirror replaces umono.dev completely, as for Umono.

### When the CLI asks the registry

The CLI asks the registry when the contract of `theme.toml` is not in `.dev/contracts/` yet. It makes two `GET` requests, first for the contract and then for its signature, with the User-Agent `Umono`, no query and no cookie. It writes the contract into `.dev/contracts/` only when the signature verifies.

A contract that is already in `.dev/contracts/` is not fetched or verified again. To try a mirror with a contract you already have, delete its file, for example `.dev/contracts/umono/page/v0.1.toml`, and run `umono theme build`.

The check of the CLI is not what protects a site: Umono verifies the contract again when the theme is activated. The CLI's check shows a broken mirror before you build.

### When the CLI fails

The errors name the host that was asked:

| The error says | |
| --- | --- |
| `contract is not published on the registry (registry.example.lan)` | The mirror answered `404` for the contract or for its signature |
| `registry is unreachable (registry.example.lan)` | The mirror did not answer, or answered with something other than `200` or `404` |
| `the contract the registry serves is not the published contract (registry.example.lan)` | The signature does not verify. Nothing is written to `.dev/contracts/`. Copy both files from umono.dev again |
| `UMONO_REGISTRY must be an http or https root URL without a query or fragment` | The value of `UMONO_REGISTRY` is not valid |

### What the mirror does not cover

A mirror serves only contracts. `umono theme dev` downloads `.dev/server` from the GitHub release of Umono on its first run and with `--update-server`. On a network closed to the internet, a mirror does not solve that step.

CLI v0.4.0 and older do not read `UMONO_REGISTRY`. They always ask umono.dev and do not verify the signature.

## Verify a file with the public key

Anyone can verify a contract on a mirror, or on umono.dev, with [minisign](https://jedisct1.github.io/minisign/). This is the public key that Umono has built in, key ID `FF93F835DAA967E3`:

```text
untrusted comment: minisign public key FF93F835DAA967E3
RWTjZ6naNfiT/6JEdZFEcmm1K2n/xSsuLy9zcIaZ37Rxo2XVh1R3vs1d
```

Download the contract and its signature, then run `minisign -V` in the same directory:

```sh
curl -O https://registry.example.lan/registry/v1/contracts/umono/page/v0.1
curl -O https://registry.example.lan/registry/v1/contracts/umono/page/v0.1.minisig
minisign -V -P RWTjZ6naNfiT/6JEdZFEcmm1K2n/xSsuLy9zcIaZ37Rxo2XVh1R3vs1d -m v0.1
```

A good file prints:

```text
Signature and comment signature verified
Trusted comment: contract umono/page@v0.1
```

The trusted comment must name the contract you downloaded, here `umono/page@v0.1`. Umono checks it too, so a mirror cannot serve the signed file of one contract at the path of another. A changed file prints `Signature verification failed`.

The same key and commands are on the [home page of umono.dev](https://umono.dev).
