# Setup Guide

This guide explains how to set up the CORTO QE technical test project locally.

## Prerequisites

Use Node.js 22.

The project supports the following Node engine range in `package.json`:

```text
>=22 <26
```

Check your local Node version:

```bash
node -v
```

Expected:

```text
v22.x.x
```

If you use `nvm`, switch to Node 22:

```bash
nvm use 22
```

If Node 22 is not installed:

```bash
nvm install 22
nvm use 22
```

## Install Dependencies

From the project root, install dependencies:

```bash
npm install
```

For CI or a clean install from `package-lock.json`, use:

```bash
npm ci
```

## Install Playwright Browsers

Install the required Playwright browsers:

```bash
npx playwright install
```

For CI or Linux environments, install browsers with system dependencies:

```bash
npx playwright install --with-deps
```

## Verify Setup

Run the following checks:

```bash
npm run lint
npm run typecheck
npm test
```

Expected result:

```text
lint passes
typecheck passes
API tests pass
UI tests pass
```

## Environment Variables

The framework supports environment-based URLs.

These values have defaults in `playwright.config.ts`, so they are optional for local execution.

### API Base URL

```bash
API_BASE_URL=https://restful-booker.herokuapp.com
```

### UI Base URL

```bash
UI_BASE_URL=https://demoqa.com
```

Example usage:

```bash
API_BASE_URL=https://restful-booker.herokuapp.com npm run test:api
```

```bash
UI_BASE_URL=https://demoqa.com npm run test:ui
```

## Recommended Fresh Checkout Flow

For a fresh local checkout, run:

```bash
npm install
npx playwright install
npm run lint
npm run typecheck
npm test
```

## Troubleshooting

### Node version issue

If you see Node or Playwright compatibility warnings, confirm you are using Node 22:

```bash
node -v
```

### Dependency issue after changing Node version

If you switched Node versions, reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
npx playwright install
```

### Missing Playwright browser

If tests fail because a browser is missing, reinstall Playwright browsers:

```bash
npx playwright install
```

### Linux or CI dependency issue

If browser dependencies are missing in Linux or CI, run:

```bash
npx playwright install --with-deps
```
