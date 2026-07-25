#!/bin/sh
# Build the site and mirror dist/ to the お名前.com server via lftp.
# Credentials live in site/.env (gitignored) — see README.md.
set -eu
cd "$(dirname "$0")"

. ./.env

pnpm build

lftp -u "$FTP_USER,$FTP_PASS" "ftp://$FTP_HOST" <<EOF
set ssl:verify-certificate no
mkdir -pf $FTP_TARGET
mirror -R --delete --parallel=4 --verbose dist/ $FTP_TARGET
quit
EOF

echo "Deployed to $FTP_HOST$FTP_TARGET"
