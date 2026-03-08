type EnvValidationResult = {
  ok: boolean;
  missing: string[];
};

function getMissing(keys: string[]) {
  return keys.filter((key) => !process.env[key]);
}

export function validateClientEnv(): EnvValidationResult {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const missing = getMissing(required);
  return { ok: missing.length === 0, missing };
}

export function validateServerEnv(): EnvValidationResult {
  const required = ['SUPABASE_SERVICE_ROLE_KEY'];
  const missing = getMissing(required);
  return { ok: missing.length === 0, missing };
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}
