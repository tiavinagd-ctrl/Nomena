#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Use the browser already installed in this cloud environment.
if [[ -z "${HYPERFRAMES_BROWSER_PATH:-}" ]] && command -v chromium >/dev/null 2>&1; then
  export HYPERFRAMES_BROWSER_PATH="$(command -v chromium)"
fi
export HYPERFRAMES_FONT_CACHE_DIR="${HYPERFRAMES_FONT_CACHE_DIR:-/tmp/digitalsub-font-cache}"
npx --yes hyperframes@0.8.149 render --fps 24 --quality delivery --workers 2 --output renders/DigitalSubMG-50s-4K.mp4 "$@"
