export function getBaseUrl(path: string) {
  if (!process.env.SITE_URL)
    throw new Error(
      "Site Url is not present in the environment configuration."
    );
  return process.env.SITE_URL + path;
}
