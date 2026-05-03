#!/usr/bin/env bash
# Create three worktrees off main for parallel agent sessions.
# Run from repo root. Idempotent — safe to re-run.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
PARENT="$(cd "$REPO_ROOT/.." && pwd)"

if ! git -C "$REPO_ROOT" rev-parse --verify HEAD >/dev/null 2>&1; then
  echo "Error: main has no commits. Make an initial commit first." >&2
  exit 1
fi

create_tree() {
  local name="$1"
  local branch="$2"
  local path="$PARENT/ClaudeHacks-$name"

  if [ -d "$path" ]; then
    echo "  [skip]    $path already exists"
    return
  fi

  if git -C "$REPO_ROOT" show-ref --verify --quiet "refs/heads/$branch"; then
    git -C "$REPO_ROOT" worktree add "$path" "$branch"
  else
    git -C "$REPO_ROOT" worktree add -b "$branch" "$path" main
  fi
  echo "  [created] $path on $branch"
}

create_tree "ui"     "feature/ui"
create_tree "data"   "feature/data"
create_tree "agents" "feature/agents"

echo
echo "Worktrees:"
git -C "$REPO_ROOT" worktree list
