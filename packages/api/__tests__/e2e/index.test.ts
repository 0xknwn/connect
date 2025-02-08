import { describe, it, expect } from "vitest";

describe("something truthy and falsy", () => {
  it("true to be true", () => {
    const meta = import.meta as ImportMeta;
    expect(meta.env.VITE_API_BASE_URL).toContain("http");
  });
});
