# OpenCase

A multi-story detective game platform built with Next.js 14+, TypeScript, Tailwind CSS, and App Router.

Terminal Velocity is installed as the first playable story pack.

## Beta Routes

- `/` - Story launcher
- `/game/terminal-velocity` - Playable Terminal Velocity beta
- `/debug` - Story debug tools
- `/stories` - Story catalog

## Developer Setup

Follow these steps to set up your development environment:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd mysterygame
   ```

2. **Set up Node.js version**:
   ```
   nvm use
   ```
   This will use the Node.js version specified in `.nvmrc` (20.10.0).

3. **Install dependencies**:
   ```
   npm ci
   ```
   This performs a clean install of all dependencies.

4. **Set up environment variables**:
   ```
   cp .env.example .env.local
   ```
   Supabase variables are optional for local single-player mode.
   Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable realtime co-op presence/sync.

5. **Run the development server**:
   ```
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Contributing

- Ensure you have the recommended VS Code extensions installed (see `.vscode/extensions.json`).
- Follow the project's coding standards and use Prettier for code formatting.
- Test your changes thoroughly before submitting a pull request.

## Architecture Docs

- `docs/ARCHITECTURE.md`
- `docs/ASSET_PLAN.md`
- `docs/ASSET_PIPELINE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/ANIMATION_SYSTEM.md`
- `docs/DATABASE.md`
- `docs/DEPLOYMENT.md`
- `docs/OBSERVABILITY.md`

## Quality Commands

- `npm run lint`
- `npm run assets:validate`
- `npm run build`
- `npm run smoke`