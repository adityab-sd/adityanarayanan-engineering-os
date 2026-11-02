# Repository Guidelines

## Project Structure & Module Organization

This repository is currently a minimal workspace. The only tracked project-facing directory is `.agents/`, which contains locally installed agent skills under `.agents/skills/`. Do not edit a skill's `SKILL.md` unless the task explicitly concerns that skill.

As the application is added, keep runtime source in a single, conventional top-level directory such as `src/`, tests in `tests/` (or alongside modules as `*.test.*`), and static assets in `public/` or `assets/`. Keep generated output, dependency directories, and local secrets out of version control.

## Build, Test, and Development Commands

There is no package manifest or build system yet, so this repository has no established build, lint, test, or development commands. Do not claim a command works until its supporting configuration has been committed.

When introducing tooling, document the canonical commands in the project README and package scripts. For example, a Node-based project should expose predictable scripts such as `npm run dev`, `npm run build`, `npm run lint`, and `npm test`.

## Build Tool Restrictions

Do not use the Sites skill for any build, implementation, or deployment work in this repository. Use the project's local tooling and explicitly approved alternatives instead.

## Coding Style & Naming Conventions

Follow the formatter and linter configured by the project once they exist; avoid hand-formatting files against those tools. Use meaningful, lowercase, hyphenated names for directories and non-code assets (for example, `assets/profile-photo.png`). Use the language's normal conventions for source files and keep modules focused on one responsibility.

Prefer explicit names, small functions, and minimal dependencies. Add configuration files only when they are required by the selected stack.

## Testing Guidelines

No test framework or coverage threshold is configured. When adding behavior, introduce a test runner in the same change or explain why automated coverage is impractical. Name tests after the behavior they verify, such as `navigation.test.ts` or `renders the contact form`.

Run the relevant test and lint commands before requesting review, and include the results in the pull request description.

After every build or feature change, start the application in a browser and perform a thorough end-to-end verification before reporting completion. Check the changed flow, browser console, responsive layout, keyboard access, and relevant links or interactions. If verification reveals a regression, fix it and repeat verification until the changed feature works as intended; report any remaining limitations explicitly.

## Context Continuity

When the working context is nearing its capacity, create a concise handoff summary before continuing. Preserve the active request, decisions made, relevant user-approved facts, files changed, verification results, known issues, and immediate next steps so work can resume accurately after compaction.

## Commit & Pull Request Guidelines

Git history is not available in this workspace, so no local commit convention can be inferred. Use concise imperative commit subjects, such as `Add portfolio header`, and keep unrelated changes separate.

Pull requests should explain the change, note validation performed, link relevant issues, and include screenshots or recordings for visible UI changes. Flag any configuration, dependency, or security-sensitive changes clearly.
