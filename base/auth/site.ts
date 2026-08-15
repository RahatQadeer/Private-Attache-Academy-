export const PRODUCTION_HOST = "private-attache-dun.vercel.app";

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || `https://${PRODUCTION_HOST}`;
}

export function requestOrigin(_request?: Request) {
  return siteUrl();
}
