import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/session";

export type Context = {
  user: SessionUser | null;
};

function requireUser(ctx: Context): SessionUser {
  if (!ctx.user) throw new Error("Not authenticated");
  return ctx.user;
}

export const resolvers = {
  Query: {
    me: (_p: unknown, _a: unknown, ctx: Context) => {
      if (!ctx.user) return null;
      return prisma.user.findUnique({ where: { id: ctx.user.id } });
    },

    myBookings: (_p: unknown, _a: unknown, ctx: Context) => {
      const user = requireUser(ctx);
      return prisma.booking.findMany({
        where: {
          OR: [{ customerId: user.id }, { providerId: user.id }],
        },
        orderBy: { createdAt: "desc" },
      });
    },

    providerBookings: (
      _p: unknown,
      args: { providerId: string },
      ctx: Context
    ) => {
      requireUser(ctx);
      return prisma.booking.findMany({
        where: { providerId: args.providerId },
        orderBy: { createdAt: "desc" },
      });
    },

    allBookings: (_p: unknown, _a: unknown, ctx: Context) => {
      const user = requireUser(ctx);
      if (user.role !== "ADMIN") throw new Error("Forbidden");
      return prisma.booking.findMany();
    },

    booking: (_p: unknown, args: { id: string }, ctx: Context) => {
      requireUser(ctx);
      return prisma.booking.findUnique({ where: { id: args.id } });
    },
  },

  Booking: {
    customer: (parent: { customerId: string }) =>
      prisma.user.findUnique({ where: { id: parent.customerId } }),

    provider: (parent: { providerId: string }) =>
      prisma.user.findUnique({ where: { id: parent.providerId } }),

    events: (parent: { id: string }) =>
      prisma.bookingEvent.findMany({
        where: { bookingId: parent.id },
        orderBy: { createdAt: "asc" },
      }),

    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
  },

  BookingEvent: {
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
  },

  Mutation: {
    createBooking: async (
      _p: unknown,
      args: {
        input: {
          title: string;
          notes?: string;
          price: number;
          providerId: string;
        };
      },
      ctx: Context
    ) => {
      const user = requireUser(ctx);

      const booking = await prisma.booking.create({
        data: {
          title: args.input.title,
          notes: args.input.notes,
          price: args.input.price,
          customerId: user.id,
          providerId: args.input.providerId,
        },
      });

      await prisma.bookingEvent.create({
        data: {
          bookingId: booking.id,
          type: "CREATED",
          actorId: user.id,
        },
      });

      return booking;
    },

    acceptBooking: async (
      _p: unknown,
      args: { id: string },
      ctx: Context
    ) => {
      const user = requireUser(ctx);

      const booking = await prisma.booking.findUnique({
        where: { id: args.id },
      });
      if (!booking) throw new Error("Booking not found");
      if (booking.status !== "PENDING") {
        throw new Error("Booking is no longer pending");
      }

      const updated = await prisma.booking.update({
        where: { id: args.id },
        data: { status: "ACCEPTED", providerId: user.id },
      });

      await prisma.bookingEvent.create({
        data: {
          bookingId: updated.id,
          type: "ACCEPTED",
          actorId: user.id,
        },
      });

      return updated;
    },

    declineBooking: async (
      _p: unknown,
      args: { id: string },
      ctx: Context
    ) => {
      const user = requireUser(ctx);

      const booking = await prisma.booking.findUnique({
        where: { id: args.id },
      });
      if (!booking) throw new Error("Booking not found");
      if (booking.providerId !== user.id) throw new Error("Forbidden");

      const updated = await prisma.booking.update({
        where: { id: args.id },
        data: { status: "DECLINED" },
      });

      await prisma.bookingEvent.create({
        data: {
          bookingId: updated.id,
          type: "DECLINED",
          actorId: user.id,
        },
      });

      return updated;
    },

    completeBooking: async (
      _p: unknown,
      args: { id: string },
      ctx: Context
    ) => {
      const user = requireUser(ctx);

      const booking = await prisma.booking.findUnique({
        where: { id: args.id },
      });
      if (!booking) throw new Error("Booking not found");
      if (booking.providerId !== user.id) throw new Error("Forbidden");
      if (booking.status !== "ACCEPTED") {
        throw new Error("Only accepted bookings can be completed");
      }

      const updated = await prisma.booking.update({
        where: { id: args.id },
        data: { status: "COMPLETED" },
      });

      await prisma.bookingEvent.create({
        data: {
          bookingId: updated.id,
          type: "COMPLETED",
          actorId: user.id,
        },
      });

      return updated;
    },
  },
};
