# SMARTECH — deployment notes

This repository is a Vite + React single-page app prepared for GitHub Pages.

Quick checklist to deploy to GitHub Pages

- The repository contains a GitHub Actions workflow `.github/workflows/deploy.yml` that builds the app and publishes `./dist` to GitHub Pages on push to `main`.
- Vite `base` is set to `./` in `vite.config.js` so assets work on Pages.

Custom domain (GoDaddy)

1. In GoDaddy DNS settings add a CNAME for `www` pointing to `moaddip100.github.io`.
2. Optionally add A records for the root (@) to GitHub Pages IPs if you want the apex to work:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
3. Add a `CNAME` file in the repository root containing your domain (one line) and push to `main`.
4. GitHub Pages will request an SSL certificate automatically; wait a few minutes and enable "Enforce HTTPS" in repository settings.

Environment variables

- The build can use translation API variables. Example env names:
  - `VITE_TRANSLATE_API_URL`
  - `VITE_TRANSLATE_API_KEY` (set as a secret)
- Add them to GitHub repository Settings → Secrets & variables → Actions.

Local build

```
npm ci
npm run build
```

If you want me to add the `CNAME` file and push it, tell me the exact domain (for example: `www.example.com`) and I'll create and push it for you.
