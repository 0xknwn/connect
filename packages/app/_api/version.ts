// file: _api/version.ts
import { geolocation } from "@vercel/edge";

// Should run on edge runtime
export const edge = true;

export default function handler(req: Request) {
  let { city } = geolocation(req);
  if (!city) {
    city = "San Francisco";
  }
  return new Response(
    `{"version": "dev", "city": "${city}", "env": "${process.env.API_BASE_URL}"}`
  );
}
