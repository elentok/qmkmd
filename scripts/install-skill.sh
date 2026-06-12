#!/usr/bin/env bash

set -euo pipefail

mode="${1:-}"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
skill_src="$(cd "$script_dir/.." && pwd)/skill"
skill_name="qmkmd"
skill_dest="${HOME}/.claude/skills/${skill_name}"

case $mode in
copy)
  rm -rf "$skill_dest"
  mkdir -p "$(dirname "$skill_dest")"
  cp -R "$skill_src" "$skill_dest"
  echo "Copied skill to $skill_dest"
  ;;
symlink)
  rm -rf "$skill_dest"
  mkdir -p "$(dirname "$skill_dest")"
  ln -s "$skill_src" "$skill_dest"
  echo "Symlinked $skill_dest -> $skill_src"
  ;;
*)
  echo "Usage: scripts/install-skill.sh [copy|symlink]"
  exit 1
  ;;
esac
