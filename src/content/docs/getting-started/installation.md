---
title: Installation
description: Install the Umono CLI, the tool that creates, starts and updates Umono sites.
sidebar:
  order: 1
---

A Umono site is managed with the Umono CLI. It downloads Umono, creates a site, starts and stops it and updates it. It is also the tool to develop themes.

## Requirements

- Linux or macOS, on amd64 or arm64.
- `curl` or `wget`.

## Install the CLI

```sh
curl -fsSL https://umono.io/install.sh | sh
```

The script downloads the latest release of the CLI for your platform from [GitHub](https://github.com/umono-cms/cli/releases) and installs it as `~/.local/bin/umono`.

If `~/.local/bin` is not in your `PATH`, the script says so. Add this line to your shell configuration, for example `~/.bashrc` or `~/.zshrc`:

```sh
export PATH="$HOME/.local/bin:$PATH"
```

Open a new terminal and check the installation:

```sh
umono version
```

## Update the CLI

Run the install script again. It replaces the CLI with the latest release.

Each Umono release names the oldest CLI that can install it. When your CLI is older, `umono create` and `umono upgrade` stop before they download anything, with the error `CLI version incompatible` and the version they need. Update the CLI and run the command again.

## Next

[Create your first site](/getting-started/your-first-site/).
