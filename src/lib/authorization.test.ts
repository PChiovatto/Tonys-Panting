import { describe, expect, it } from "vitest";
import { hasServiceAuthorization, hasSharedSecret } from "../../supabase/functions/_shared/authorization";

describe("notification authorization", () => {
  const request = (headers = {}) => new Request("https://example.com", { headers });
  it("fails closed when secrets are absent or credentials are partial", () => {
    expect(hasServiceAuthorization(request(), undefined)).toBe(false);
    expect(hasServiceAuthorization(request({ authorization: "Bearer secret-extra" }), "secret")).toBe(false);
    expect(hasSharedSecret(request(), "x-cron-secret", undefined)).toBe(false);
    expect(hasSharedSecret(request(), "x-cron-secret", "")).toBe(false);
  });
  it("accepts only matching credentials", () => {
    expect(hasServiceAuthorization(request({ authorization: "Bearer secret" }), "secret")).toBe(true);
    expect(hasSharedSecret(request({ "x-cron-secret": "secret" }), "x-cron-secret", "secret")).toBe(true);
  });
});
