import { describe, expect, it } from "vitest";
import { isValidPixelId } from "./metaPixel";

describe("Meta Pixel ID", () => {
  it("accepts a numeric Meta Pixel ID", () => {
    expect(isValidPixelId("123456789012345")).toBe(true);
  });
  it("treats an empty field as no tracking", () => {
    expect(isValidPixelId("")).toBe(false);
  });
  it("rejects non-numeric input", () => {
    expect(isValidPixelId("abc123")).toBe(false);
  });
});
