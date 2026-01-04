/**
 * Parses an environment variable as a number with validation.
 * @param envName - The name of the environment variable
 * @param defaultVal - The default value to use if env var is undefined or invalid
 * @param options - Validation options
 * @returns The parsed and validated number
 */
function parseExpiry(
  envName: string,
  defaultVal: number,
  {
    min,
    max,
    allowZero = false,
  }: { min: number; max: number; allowZero?: boolean }
): number {
  const envValue = process.env[envName];
  if (envValue === undefined) {
    return defaultVal;
  }

  const parsed = Number(envValue);
  if (!isFinite(parsed) || isNaN(parsed)) {
    console.error(
      `Invalid ${envName}: "${envValue}" is not a valid number. Using default: ${defaultVal}`
    );
    return defaultVal;
  }

  if (!allowZero && parsed === 0) {
    console.error(
      `Invalid ${envName}: 0 is not allowed. Using default: ${defaultVal}`
    );
    return defaultVal;
  }

  if (parsed < min || parsed > max) {
    console.error(
      `Invalid ${envName}: ${parsed} is out of range (${min} to ${max}). Using default: ${defaultVal}`
    );
    return defaultVal;
  }

  return parsed;
}

export const ACCESS_TOKEN_EXPIRY = parseExpiry("ACCESS_TOKEN_EXPIRY", 15 * 60, {
  min: 1,
  max: 24 * 60 * 60, // 1 day max
  allowZero: false,
}); // 15 minutes

export const REFRESH_TOKEN_EXPIRY = parseExpiry(
  "REFRESH_TOKEN_EXPIRY",
  7 * 24 * 60 * 60,
  {
    min: 1,
    max: 365 * 24 * 60 * 60, // 1 year max
    allowZero: false,
  }
); // 7 days
