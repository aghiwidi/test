# Build Validation

- TypeScript/TSX syntax transpilation: passed for all 17 source files.
- Translation call-site coverage: passed; every `t('...')` key is present in the translation dictionary.
- SVG wrapper validation: passed for the custom logo and favicon.
- Vite production build: not completed in the authoring environment because npm package registry DNS/network access was unavailable (`EAI_AGAIN` while resolving `registry.npmjs.org`).

Run `npm install`, `npm run typecheck`, and `npm run build` in an environment with npm registry access before deployment. A GitHub Actions workflow is included to run typecheck and build on pushes and pull requests.
