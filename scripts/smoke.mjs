const baseUrl = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000';
const routes = ['/', '/stories', '/game/terminal-velocity', '/room/SMOKE1?story=terminal-velocity&nick=Smoke&host=1', '/api/health'];

async function run() {
  for (const route of routes) {
    const res = await fetch(`${baseUrl}${route}`);
    if (!res.ok) {
      throw new Error(`Smoke check failed for ${route}: ${res.status}`);
    }
  }
  console.log(`Smoke checks passed for ${routes.length} routes on ${baseUrl}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
