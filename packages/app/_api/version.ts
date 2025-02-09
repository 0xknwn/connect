// Should run on edge runtime
export const edge = true;

export default function handler(req: Request) {
  return new Response(`{"version": "dev"}`);
}
