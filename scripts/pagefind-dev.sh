#!/usr/bin/env bash
set -euo pipefail

SITE_DIR="${SITE_DIR:-public}"
WATCH_INTERVAL="${WATCH_INTERVAL:-2}"
WATCH_PATHS=(content layouts assets static hugo.toml)
PAGEFIND_STATIC_DIR="static/pagefind"

current_fingerprint() {
  if stat -f "%m %N" hugo.toml >/dev/null 2>&1; then
    find "${WATCH_PATHS[@]}" -type f ! -path "${PAGEFIND_STATIC_DIR}/*" -print0 2>/dev/null \
      | sort -z \
      | xargs -0 stat -f "%m %N" 2>/dev/null \
      | shasum
  else
    find "${WATCH_PATHS[@]}" -type f ! -path "${PAGEFIND_STATIC_DIR}/*" -print0 2>/dev/null \
      | sort -z \
      | xargs -0 stat -c "%Y %n" 2>/dev/null \
      | sha1sum
  fi
}

build_search_index() {
  echo
  echo "[pagefind-dev] Building Hugo site..."
  hugo --destination "$SITE_DIR" --cleanDestinationDir

  echo
  echo "[pagefind-dev] Building Pagefind index..."
  npx --yes pagefind --site "$SITE_DIR" --output-subdir pagefind

  echo
  echo "[pagefind-dev] Copying Pagefind index to ${PAGEFIND_STATIC_DIR}/ for hugo server..."
  mkdir -p static
  rm -rf "$PAGEFIND_STATIC_DIR"
  cp -R "${SITE_DIR}/pagefind" "$PAGEFIND_STATIC_DIR"
}

build_search_index

echo
echo "[pagefind-dev] Pagefind is ready for hugo server."
echo "[pagefind-dev] Start or refresh: hugo server --renderToMemory --noBuildLock --disableFastRender"
echo "[pagefind-dev] Watching content/templates/assets. Press Ctrl+C to stop."

last_fingerprint="$(current_fingerprint)"

while true; do
  sleep "$WATCH_INTERVAL"
  next_fingerprint="$(current_fingerprint)"

  if [ "$next_fingerprint" != "$last_fingerprint" ]; then
    last_fingerprint="$next_fingerprint"
    build_search_index
  fi
done
