# OpenCase

A web-based detective game built with Next.js 14+, TypeScript, Tailwind CSS, and App Router.

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
   Edit `.env.local` and replace the placeholder values with your actual Supabase credentials and game version.

5. **Run the development server**:
   ```
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Contributing

- Ensure you have the recommended VS Code extensions installed (see `.vscode/extensions.json`).
- Follow the project's coding standards and use Prettier for code formatting.
- Test your changes thoroughly before submitting a pull request.