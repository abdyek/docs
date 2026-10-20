# Umono Docs

The source of [docs.umono.dev](https://docs.umono.dev), the documentation of [Umono](https://github.com/umono-cms/umono). It is built with [Starlight](https://starlight.astro.build).

## Licenses

| What | License | File |
| --- | --- | --- |
| The text: everything under `src/content/` | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [`LICENSE`](LICENSE) |
| The code of the site: configuration, styles, components and workflows | MIT | [`LICENSE-CODE`](LICENSE-CODE) |

You may copy, translate and adapt the text, as long as you credit it. Contracts and schemas quoted in the text keep their own license: everything published on [umono.dev](https://umono.dev) is MIT-0 ([umono.dev/license](https://umono.dev/license)).

The site serves the [Inter](https://github.com/rsms/inter) and [Iosevka](https://github.com/be5invis/Iosevka) fonts, both under the SIL Open Font License 1.1. They come from the `@fontsource-variable/inter` and `@fontsource/iosevka` packages, which carry the license texts.

## Development

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:4321. `npm run build` builds the site into `dist/` and fails on a broken internal link. `npm run preview` serves the build.

Astro collects anonymous telemetry by default. Turn it off once with `npx astro telemetry disable`, or set `ASTRO_TELEMETRY_DISABLED=1`.

### Privacy

docs.umono.dev keeps no IP address, sets no cookie and makes the browser request nothing from another site. The site keeps it that way:

- No analytics, no external font, no CDN, no external search. Fonts and the search index are served with the site.
- An image, a script or a stylesheet is never loaded from another origin. A link to another site is fine.

### Writing

- The text is English and describes the released version of Umono. A page about a feature that has no release yet waits in its pull request until the release.
- Compono examples are plain text blocks (`` ```text ``). Compono has no syntax highlighting yet.

## Deployment

Every push to `main` is built and deployed by the [`site`](.github/workflows/site.yml) workflow. Pull requests are only built. The workflow uploads the build over SSH to a new directory under `releases/` and points `current` at it, so a deploy never serves a half-uploaded site.

It reads these from *Settings → Secrets and variables → Actions*:

| Name | Kind | Value |
| --- | --- | --- |
| `DEPLOY_HOST` | secret | Host name or IP address of the server |
| `DEPLOY_USER` | secret | The deploy user |
| `DEPLOY_SSH_KEY` | secret | A private key of the deploy user, without a passphrase |
| `DEPLOY_KNOWN_HOSTS` | secret | The host key line(s) of the server: `ssh-keyscan -p <port> <host>` |
| `DEPLOY_PORT` | variable | SSH port. Optional, `22` by default |
| `DEPLOY_PATH` | variable | The directory of the site on the server. Optional, `/srv/docs.umono.dev` by default |
