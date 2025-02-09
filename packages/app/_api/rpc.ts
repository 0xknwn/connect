// file: _api/rpc.ts

// Should run on edge runtime
export const edge = true;

export default async function handler(request: Request) {
  const url = process.env.API_BASE_URL as string;
  const requestBody = await request.json();
  console.log(requestBody);
  const output = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request.body),
  });
  const responseBody = await output.json();
  console.log(responseBody);
  if (responseBody) {
    return new Response(JSON.stringify(responseBody), {
      status: output.status,
    });
  }
  return new Response(`{"statusText": "Not Found"}`, { status: output.status });
}
