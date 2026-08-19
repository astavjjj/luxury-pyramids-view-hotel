/**
 * Runs a data query and returns a fallback value if the database is
 * unavailable. This keeps pages renderable during build/deploy before a
 * production DATABASE_URL is configured, and they render live data as soon
 * as the database is reachable.
 */
export async function withFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}