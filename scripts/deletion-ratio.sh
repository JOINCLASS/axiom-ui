#!/bin/sh
# Deletion ratio per release (philosophy §6): lines deleted / lines added.
# Usage: pnpm deletion-ratio <from-ref> [to-ref]
set -e
FROM=${1:?usage: deletion-ratio.sh <from-ref> [to-ref]}
TO=${2:-HEAD}
git diff --numstat "$FROM".."$TO" -- ':!pnpm-lock.yaml' |
  awk '{ added += $1; deleted += $2 }
    END { printf "added %d, deleted %d, deletion ratio %.2f\n", added, deleted, added ? deleted / added : 0 }'
