# pixmith-page

The website for [Pixmith](https://github.com/azdharsyahputra/pixmith), the pixel art editor wired to your game.
Next.js + React, exported as a static site.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # writes out/
```

Hosting: `out/` is plain static files. GitHub Pages (the manual `Website` workflow, served from
`/pixmith-page`), Cloudflare Pages or Netlify (build command `npx next build`, output `out`) all work.
`NEXT_PUBLIC_BASE_PATH` sets the sub-path when the site is not served from the domain root.

The download buttons ask GitHub for the newest Pixmith release and pick the file for the visitor's system.
Design notes: `DESIGN.md`.
