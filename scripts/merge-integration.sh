#!/usr/bin/env bash
# Merge all three feature branches into feature/integration for the demo.
# Run from repo root after the three build agents have committed their work.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo "==> Switching to feature/integration"
git checkout feature/integration

echo "==> Catching integration up to main"
git merge --no-ff -m "sync integration with main" main || true

for branch in feature/data feature/agents feature/ui; do
  echo
  echo "==> Merging $branch"
  if ! git merge --no-ff -m "merge $branch into integration" "$branch"; then
    echo
    echo "MERGE CONFLICT in $branch."
    echo "Files:"
    git status --short | grep '^UU\|^AA\|^DD'
    echo
    echo "Resolve, then run:  git commit && bash scripts/merge-integration.sh"
    exit 1
  fi
done

echo
echo "==> All branches merged."
echo "==> Refreshing node_modules symlink for trees/integration use cases (no-op if not present)."
echo "==> Done. Run: npm run dev"
