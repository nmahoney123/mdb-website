#!/usr/bin/env bash
cd "$(dirname "$0")"

echo "============================================"
echo "  Mahoney Design & Build — Local Website"
echo "============================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed on this computer."
  echo ""
  echo "  1. Go to https://nodejs.org"
  echo "  2. Download the LTS version (v20 or newer)"
  echo "  3. Install it, then double-click this file again"
  echo ""
  read -r -p "Press Enter to close..."
  exit 1
fi

NODE_MAJOR=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node.js 20 or newer is required (you have $(node -v))."
  echo "Get the latest LTS from https://nodejs.org"
  read -r -p "Press Enter to close..."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies (first run only — takes a few minutes)..."
  npm install
  if [ $? -ne 0 ]; then echo "Install failed — check your internet connection and try again."; read -r -p "Press Enter to close..."; exit 1; fi
fi

if [ ! -d dist ]; then
  echo "Building the website..."
  npm run build
  if [ $? -ne 0 ]; then echo "Build failed."; read -r -p "Press Enter to close..."; exit 1; fi
fi

echo "Preparing the database..."
npx tsx db/seed.ts

echo ""
echo "============================================"
echo "  Website:   http://localhost:3000"
echo "  Admin:     http://localhost:3000/#/admin/login"
echo "  Password:  mahoney1985"
echo ""
echo "  Press Ctrl+C to stop the site."
echo "============================================"
echo ""

NODE_ENV=production node dist/boot.js

