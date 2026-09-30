# Project

MUY RICO web application bussiness card part (second).

## Stack

- Node.js 20
- TypeScript
- React 18
- Next.js 14 App Router
- next-intl
- styled-components

## General rules

- Preserve existing application behavior.
- Do not modify unrelated code.
- Prefer simple solutions over unnecessary abstractions.
- Do not add dependencies unless necessary.
- Do not change package versions without explaining why.
- Use named constants for repeated or semantically meaningful values instead of duplicating literals.
- Do not extract trivial values or widely accepted conventional literals into constants unless doing so improves readability or maintainability.

## TypeScript

- Keep strict typing.
- Avoid `any`.
- Prefer existing project types and helpers.

## Next.js

- This project uses App Router.
- Do not use Pages Router APIs.
- Clearly distinguish Server Components and Client Components.
- Do not move server-only APIs into client code.
- Be careful with static generation and dynamic rendering.

## Environment

Production runs on Ubuntu with:
- nginx
- systemd
- Node.js 20

## Verification

After modifications run:

npm run lint
npm run build

If tests exist, run them too.

## Important

Before making significant architectural changes:
1. explain the problem;
2. propose the solution;
3. wait for approval.

## Project state

Before starting work, read `PROJECT_STATUS.md`.

Use it to understand:
- current project state;
- work in progress;
- known issues;
- pending tasks;
- previous important decisions.

After completing a significant task:
1. update `PROJECT_STATUS.md`;
2. move completed items to `Recently completed`;
3. update `Known issues`;
4. update `Next tasks`;
5. record important architectural decisions.

Do not remove historical decisions that are still relevant.
