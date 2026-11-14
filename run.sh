#!/usr/bin/env bash
export PATH="/Users/hello/.local/bin:/Users/hello/.gemini/antigravity/scratch/node/bin:$PATH"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================="
echo "  Starting AURA ATELIER Luxury Store"
echo "  URL: http://localhost:3002"
echo "  URL: http://127.0.0.1:3002"
echo "=========================================="

./node_modules/.bin/next start -H 0.0.0.0 -p 3002
