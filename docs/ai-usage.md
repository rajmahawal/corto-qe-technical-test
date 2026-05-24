# AI Usage

This document explains how AI assistance was used during the CORTO QE technical assessment.

AI was used as a productivity accelerator, but the framework architecture, test strategy, scope, and final quality decisions were driven by quality engineering judgement and the assessment requirements.

## Summary

AI assistance was used for:

- Reviewing completed code for maintainability and robustness
- Improving assertion quality
- Improving failure messages
- Helping draft and refine project documentation
- Supporting Task 2 (PartB) by generating an initial endpoint automation draft

AI-generated output was not accepted directly without review. Every change was checked, corrected where required and validated by running the test suite.

## Framework Architecture

AI did not define the framework architecture.

The architecture was planned based on the technical assessment requirements and the goal of creating a maintainable automation foundation.

Key design decisions were made manually, including:

- Using Playwright for both API and UI automation
- Using TypeScript for type safety
- Keeping API and UI layers separate
- Using API clients for endpoint interactions
- Using Page Object Model for UI automation
- Keeping test data in JSON files
- Splitting assertions by responsibility
- Keeping UI E2E coverage focused on critical user journeys

AI was used to speed up implementation and continious review after the direction was already decided.

## Task 2 Part B

For Task 2 (PartB), the assessment asked to use an AI tool to automate one endpoint and include the output in the repository with corrections or improvements.

The selected endpoint was:

```text
POST /auth
```

The AI-generated output, review notes, corrections and improvements are documented here:

```text
ai-assisted-endpoint/create-token.md
```

## How the AI Output Was Improved

The initial AI output was useful as a starting point, but it did not fully meet the framework quality bar.

Improvements included:

- Moving direct request logic into `RestfulBookerClient`
- Using shared JSON test data instead of hardcoded credentials
- Adding TypeScript response typing
- Replacing weak assertions such as `toBeTruthy()`
- Adding full response contract validation
- Validating both success and error response shapes
- Adding clearer assertion messages
- Reusing shared response and authentication assertion helpers
- Aligning the code with the project structure

## AI Use During Code Review

AI was also used after implementation to review the code and suggest improvements.

Examples of review areas included:

- Assertion strength
- Naming clarity
- Unused or redundant test data
- API response validation
- UI locator quality
- Page Object method naming
- Failure diagnostics
- Documentation clarity

The suggestions were reviewed manually before being applied.

Some suggestions were accepted, such as:

- Improving API assertion failure diagnostics
- Splitting API assertions by responsibility
- Strengthening response contract validation
- Improving UI page object method names
- Adding clearer documentation

Some suggestions were rejected or adjusted when they did not match actual application behaviour.

For example, one suggestion assumed the DemoQA book details URL used `/books?book=`, but the actual site navigated to `/books?search=<isbn>`. The implementation was corrected based on observed application behaviour.

## AI Use for Documentation

AI was also used to help draft and refine documentation, including:

- README content
- Setup guide
- Test execution guide
- Test reporting guide
- Framework design notes
- Test strategy notes
- AI usage notes

The documentation was reviewed and adjusted to reflect the actual project structure and implementation.

## Validation Performed

All AI-assisted code and documentation changes were validated through local checks.

The main validation commands used were:

```bash
npm run lint
npm run typecheck
npm run test:api
npm run test:ui
npm test
```

These checks were used to confirm:

- Code style passes
- TypeScript compilation passes
- API tests pass
- UI tests pass
- The full suite passes

## Quality Bar

AI-generated output was only accepted when it met the project quality bar.

The expected quality bar included:

- Clear test intent
- Maintainable structure
- Strong assertions
- No unnecessary duplication
- Type-safe implementation
- Reusable framework components
- Reliable test execution
- Clear failure messages
- Alignment with the test strategy

## Final Note

AI was used to speed up development, but not to replace understanding or ownership of the framework.

The final implementation was reviewed, corrected and validated manually to ensure it remained reliable, maintainable, and suitable for the assessment.
