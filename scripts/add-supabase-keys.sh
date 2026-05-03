#!/usr/bin/env bash
# scripts/add-supabase-keys.sh
#
# Prompts for the 3 Supabase keys and appends them to .env.local.
# Skips any that are already set. Hides the secret key as you paste.
# Safe to re-run.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env.local"

touch "$ENV_FILE"

ok()   { printf "\033[32m✓\033[0m %s\n" "$1"; }
warn() { printf "\033[33m!\033[0m %s\n" "$1"; }
hdr()  { printf "\n\033[1m%s\033[0m\n" "$1"; }

env_has() { grep -qE "^${1}=.+" "$ENV_FILE" 2>/dev/null; }

prompt_and_add() {
  local key="$1"
  local label="$2"
  local hide="${3:-no}"
  if env_has "$key"; then
    ok "$key already set — skipping"
    return
  fi
  echo
  echo "$label"
  local val=""
  if [ "$hide" = "yes" ]; then
    printf "  Paste, then press Enter (input hidden): "
    read -rs val
    echo
  else
    printf "  Paste, then press Enter: "
    read -r val
  fi
  if [ -z "$val" ]; then
    warn "Empty — skipped. Re-run when you have it."
    return
  fi
  printf "%s=%s\n" "$key" "$val" >> "$ENV_FILE"
  ok "$key saved"
}

hdr "Adding Supabase keys to .env.local"
echo "Get them from: Supabase → your project → Project Settings → API Keys"

prompt_and_add NEXT_PUBLIC_SUPABASE_URL \
  "1 of 3 — Project URL (looks like https://xxx.supabase.co — copy from the top of the API Keys page)" no

prompt_and_add NEXT_PUBLIC_SUPABASE_ANON_KEY \
  "2 of 3 — Publishable key (starts with sb_publishable_... — click the copy icon next to it)" no

prompt_and_add SUPABASE_SERVICE_ROLE_KEY \
  "3 of 3 — SECRET key (starts with sb_secret_... — click 'Reveal' first, then copy)" yes

hdr "Done."
echo "Run 'bash scripts/setup-portal.sh' or restart 'npm run dev' to pick up the new values."
