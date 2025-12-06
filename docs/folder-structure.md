1. Folder Structure & Monorepo

   - Root: Acts as the workspace root. It manages global dependencies (like Playwright), CI/CD configurations, and the
     project's "BMad" workflow.
     - package.json (Root): Defines the workspace app and the E2E test scripts.
   - `app/`: Contains the actual Next.js application.
     - app/package.json: Manages the Next.js app's specific dependencies (React, Tailwind, etc.) and scripts (build, dev,
       lint, test).
     - Why the duplicate files?: package.json and package-lock.json exist in both places because the root manages the
       workspace and E2E tests, while app/ acts as an independent package for the frontend application.

2. Testing Strategy
   The testing is split into two layers:

- End-to-End (E2E):
  - Tool: Playwright.
  - Location: Configured in playwright.config.ts (Root). Tests are located in tests/e2e.
  - Execution: The config is set to automatically start the Next.js server (npm run dev inside app/) before running
    tests.
- Unit & Integration:
  - Tool: Vitest.
  - Location: Configured in app/vitest.config.ts. Tests are located in app/**tests**.
  - Execution: Run via npm run test inside the app/ directory.

3. Development Workflow (BMad Method)
   The .bmad/ folder and the structured docs/ indicate this project uses the BMad Method, an AI-driven agile framework.

- Phases: The docs/ folder is organized into phases (fase-1-analysis, fase-2-plan, etc.), reflecting the BMad lifecycle.
- Agents: The .bmad configuration defines specialized AI personas (like PM, Architect, Dev).
- Docs: docs/gemini-instructions.md suggests you can "activate" these agents using triggers like *dev or *architect
  (though I am currently operating as your standard Gemini assistant).

4. Infrastructure

- Backend: Supabase (indicated by the supabase/ folder).
- Deployment: Vercel (indicated by vercel.json in the root).
- CI/CD: GitHub Actions (.github/workflows/ci.yml) orchestrates the entire pipeline:
  1.  Installs dependencies.
  2.  Runs Lint & Unit tests in app/.
  3.  Runs E2E tests from the root.
