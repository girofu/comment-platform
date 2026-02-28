#!/bin/bash
set -e

echo "Verifying project tooling..."

# Node.js
if command -v node &> /dev/null; then
  echo "✓ Node.js $(node -v)"
else
  echo "✗ Node.js not installed"
  exit 1
fi

# pnpm
if command -v pnpm &> /dev/null; then
  echo "✓ pnpm $(pnpm -v)"
else
  echo "✗ pnpm not installed. Run: npm install -g pnpm"
  exit 1
fi

# GitHub CLI
if command -v gh &> /dev/null; then
  if gh auth status &> /dev/null; then
    echo "✓ GitHub CLI authenticated"
  else
    echo "✗ GitHub CLI not authenticated. Run: gh auth login"
  fi
else
  echo "⚠ GitHub CLI not installed. Run: brew install gh"
fi

# Supabase CLI
if command -v supabase &> /dev/null; then
  echo "✓ Supabase CLI installed"
else
  echo "⚠ Supabase CLI not installed. Run: brew install supabase/tap/supabase"
fi

echo ""
echo "Tooling verification complete!"
