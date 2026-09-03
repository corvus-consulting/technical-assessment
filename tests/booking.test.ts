import { describe, it, expect } from "vitest";
import { resolvers } from "@/graphql/resolvers";

describe("booking resolvers", () => {
  it("has a query resolver map", () => {
    expect(resolvers.Query).toBeDefined();
  });

  it("has a mutation resolver map", () => {
    expect(resolvers.Mutation).toBeDefined();
  });

  it("exposes providerBookings", () => {
    expect(resolvers.Query.providerBookings).toBeTruthy();
  });

  it("exposes acceptBooking", () => {
    expect(resolvers.Mutation.acceptBooking).toBeTruthy();
  });

  it("resolves booking fields", () => {
    expect(resolvers.Booking).toBeDefined();
    expect(typeof resolvers.Booking.provider).toBe("function");
  });
});
