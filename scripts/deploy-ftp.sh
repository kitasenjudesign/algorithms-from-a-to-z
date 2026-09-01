#!/usr/bin/env bash
#
# dist/ 以下を、任意のFTPサーバー・任意のリモートフォルダへアップロードする。
#
# 使い方:
#   ./scripts/deploy-ftp.sh <host> <remote-dir> [local-dir]
#
# 例:
#   ./scripts/deploy-ftp.sh ftp.example.com /public_html/algorithms
#   ./scripts/deploy-ftp.sh ftp.example.com /public_html/algorithms ./dist
#
# 認証情報は環境変数、または ~/.netrc から読み込む(コマンドライン引数には書かない):
#   FTP_USER=xxxx FTP_PASS=xxxx ./scripts/deploy-ftp.sh ftp.example.com /public_html/algorithms
#
# ~/.netrc を使う場合は FTP_USER/FTP_PASS を省略してよい。例:
#   machine ftp.example.com
#   login xxxx
#   password xxxx
# (chmod 600 ~/.netrc しておくこと)
#
# --dry-run を付けると、実際には転送せず変更点だけ確認できる。
#   ./scripts/deploy-ftp.sh ftp.example.com /public_html/algorithms --dry-run

set -euo pipefail

HOST="${1:-}"
REMOTE_DIR="${2:-}"
LOCAL_DIR="${3:-dist}"
DRY_RUN=""

for arg in "$@"; do
  if [ "$arg" = "--dry-run" ]; then
    DRY_RUN="--dry-run"
  fi
done

if [ -z "$HOST" ] || [ -z "$REMOTE_DIR" ]; then
  echo "使い方: $0 <host> <remote-dir> [local-dir] [--dry-run]" >&2
  exit 1
fi

if [ ! -d "$LOCAL_DIR" ]; then
  echo "ローカルディレクトリが見つかりません: $LOCAL_DIR" >&2
  exit 1
fi

if ! command -v lftp >/dev/null 2>&1; then
  echo "lftp が見つかりません。'brew install lftp' でインストールしてください。" >&2
  exit 1
fi

USER_OPT=()
if [ -n "${FTP_USER:-}" ] && [ -n "${FTP_PASS:-}" ]; then
  USER_OPT=(-u "${FTP_USER},${FTP_PASS}")
fi

echo "==> $LOCAL_DIR/ を ftp://$HOST$REMOTE_DIR へアップロードします${DRY_RUN:+ (dry-run)}"

lftp "${USER_OPT[@]}" "ftp://$HOST" <<EOF
set ftp:ssl-allow no
set mirror:parallel-transfer-count 3
mirror -R $DRY_RUN --verbose "$LOCAL_DIR" "$REMOTE_DIR"
quit
EOF

echo "==> 完了"
