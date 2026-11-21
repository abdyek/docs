---
title: Using a mirror
description: Serve the contracts of umono.dev from your own server, point Umono at it with UMONO_REGISTRY and verify the files with the public key.
sidebar:
  order: 9
---

This page is for site owners. A mirror is a server of your own that serves the files of [umono.dev](https://umono.dev) at the same paths. Use one when your site cannot or should not reach umono.dev, for example on a network that is closed to the internet. Since Umono v0.10.

A mirror only serves contracts. Contracts are still published only on umono.dev, and the mirror cannot change them: every contract is signed, and Umono verifies the signature with a key it already has.

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

Serve them at the same paths under the root of your mirror, for example `https://registry.example.lan/registry/v1/contracts/umono/page/v0.1.minisig`. Any static file server works. There is no index file: copy only the contracts you use. Umono itself requests only the `.minisig`, but keep the contract next to it so the pair can be checked at any time.

The mirror must answer `200` with the signature, or `404` when it does not have it. Umono reads `404` as a contract that is not published. Any other answer, or no answer, is a registry that cannot be reached.

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
