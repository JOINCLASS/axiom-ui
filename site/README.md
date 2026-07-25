# Axiom UI — Official Site

The documentation site for https://axiom-ui.joinclass.jp (Astro + React + Tailwind CSS 4).
All content is generated at build time from the library itself: component pages come from
the `manifest` export and raw source of `../src/components/*.tsx`.

## Develop

```sh
cd site
pnpm install
pnpm dev        # http://localhost:4321
```

## Build

```sh
pnpm build      # outputs static files to site/dist/
pnpm preview    # verify the production build locally
```

The output is fully static (36 HTML pages + assets). No Node.js is required on the server.

## Deploy — お名前.com レンタルサーバー

```sh
cd site && pnpm deploy   # = sh deploy.sh: build して dist/ を lftp でミラーリング
```

- 認証情報は `site/.env`（gitignore 済み）に置く：

  ```sh
  FTP_HOST=...
  FTP_USER=...
  FTP_PASS=...
  FTP_TARGET=/axiom-ui.joinclass.jp
  ```

- サーバーはルート直下の「ドメイン名フォルダ」を公開する構成。
  `axiom-ui.joinclass.jp` フォルダへミラーリングする（`--delete` 付き）。
- **初回のみ**: お名前.com のコントロールパネルで `joinclass.jp` に
  サブドメイン `axiom-ui` を追加し、フォルダ `axiom-ui.joinclass.jp/` を割り当てる
  （DNS レコードもここで設定される）。lftp は Homebrew: `brew install lftp`。

すべての URL はディレクトリ + `index.html` 形式で出力されるため、
`.htaccess` やリライト設定は不要。
