# Updating the upstream version

This package has a single upstream source: the `binwiederhier/ntfy` Docker image, which is published in lockstep with the [ntfy GitHub releases](https://github.com/binwiederhier/ntfy/releases).

## Determining the upstream version

- **ntfy** ([binwiederhier/ntfy](https://github.com/binwiederhier/ntfy)) — inspect tags and releases, selecting the newest stable version rather than relying on GitHub's Latest badge:

  ```sh
  gh api 'repos/binwiederhier/ntfy/tags?per_page=100' --jq '.[].name'
  gh api 'repos/binwiederhier/ntfy/releases?per_page=100' --jq '.[] | select(.draft == false and .prerelease == false) | .tag_name'
  ```

  Cross-check against Docker Hub ([binwiederhier/ntfy](https://hub.docker.com/r/binwiederhier/ntfy/tags)) to confirm the matching image tag has been published:

  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/binwiederhier/ntfy/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

  The current pin lives in `startos/manifest/index.ts` as the `dockerTag` on `images.main.source`.

## Applying the bump

- `startos/manifest/index.ts` — set `images.main.source.dockerTag` to `binwiederhier/ntfy:v<new version>`.
