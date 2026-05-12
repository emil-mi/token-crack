# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Browser-based tool that decodes ("cracks") various web tokens (JWT, Skype token, registration token, sync state, base64). Create React App project, deployed to GitHub Pages at https://emil-mi.github.io/token-crack/.

## Commands

- `npm start` — dev server at http://localhost:3000
- `npm test` — Jest in watch mode (CRA test runner). Run a single test: `npm test -- --testPathPattern=App`
- `npm run build` — production build to `build/`
- `npm run deploy` — builds and publishes to `gh-pages` branch via `gh-pages -d build`

No linter beyond CRA's built-in `react-app` ESLint config (warnings show in dev server console).

## Architecture

The decoder pipeline is the core abstraction:

- `src/App.js` holds the textarea, runs `cracker(token)` from `src/decoders/index.js` on every change, and renders the first non-null result (or "Don't know").
- `src/decoders/index.js` composes all per-format decoders with `lodash.over(...)`, then `_.compact`s the results. Each decoder module exports a `cracker(token)` function that returns either a React element (success) or `null` (doesn't match). Adding a new token type = create a new file under `src/decoders/`, export `cracker`, and add it to the `_.over(...)` list in `index.js`.
- `src/decoders/common.js` contains shared binary-parsing helpers (`readUint`, `readInt`, `readString`, `readByteFragment`, `crackJWT`) used by the non-JWT decoders that parse custom binary-over-base64 formats. The `readInt` helper uses `long.js` because some fields exceed JS safe-integer range.
- Each cracker is expected to swallow its own parsing errors and return `null` on mismatch — the pipeline relies on this to try the next decoder.

Stack: React 16 class components, CRA 3.2, lodash, base64-js, long, utf8, react-json-pretty. No TypeScript, no Redux, no router.
