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

## Shell completion

Since v0.4, the CLI completes its commands and arguments in bash, zsh and fish. `umono completion <shell>` prints the completion script of the shell. The install script does not set up completion and the CLI never edits your shell files: load the script yourself as below, then open a new terminal.

The script does not hold the list of commands. It asks the CLI on every completion, so it stays up to date when the CLI is updated and never needs to be generated again.

### bash

The script needs the `bash-completion` package. Without it, the script loads, but every completion fails with `_get_comp_words_by_ref: command not found`. Install it with your package manager, for example `sudo apt install bash-completion` or `sudo dnf install bash-completion`.

Then add this line to `~/.bashrc`:

```bash
source <(umono completion bash)
```

### zsh

Completion must be enabled in `~/.zshrc`. If it is not, add this line first:

```zsh
autoload -U compinit; compinit
```

Then add this line after it:

```zsh
source <(umono completion zsh)
```

zsh is the default shell of macOS, and these steps work there too.

### fish

Write the script to the completion directory of fish, which fish loads by itself:

```fish
mkdir -p ~/.config/fish/completions
umono completion fish > ~/.config/fish/completions/umono.fish
```

## Update the CLI

Run the install script again. It replaces the CLI with the latest release.

Each Umono release names the oldest CLI that can install it. When your CLI is older, `umono create` and `umono upgrade` stop before they download anything, with the error `CLI version incompatible` and the version they need. Update the CLI and run the command again.

## Next

[Create your first site](/getting-started/your-first-site/).
