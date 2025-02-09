// file: _api/rpc.ts

// Should run on edge runtime
export const edge = true;

export default async function handler(request: Request) {
  const url = process.env.API_BASE_URL as string;
  const output = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request.body),
  });
  const body = await output.json();
  if (body) {
    return new Response(JSON.stringify(body), { status: output.status });
  }
  return new Response(`{"statusText": "Not Found"}`, { status: output.status });
}
