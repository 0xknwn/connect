import express, {
  Request as ExpressRequest,
  Response as ExpessResponse,
} from "express";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 3000;
import handler from "../_api/version";

app.get(
  "/api/version",
  async (request: ExpressRequest, response: ExpessResponse) => {
    const req = new Request("https://example.com");
    const res = handler(req);
    response.status(res.status).send(await res.json());
  }
);

const pipe = [] as string[];

app.post(
  "/message",
  async (request: ExpressRequest, response: ExpessResponse) => {
    const req = new Request("https://example.com");
    const data = [] as string[];
    request.on("data", (chunk) => {
      data.push(chunk.toString());
    });
    request.on("end", () => {
      pipe.push(data.join(""));
    });
    const res = handler(req);
    response.status(200).send({ status: "OK" });
  }
);

app.get("/message", async (_: ExpressRequest, response: ExpessResponse) => {
  const out = pipe.shift();
  if (!out) {
    response.status(200).send(`{}`);
    return;
  }
  response.status(200).send(out);
});

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
