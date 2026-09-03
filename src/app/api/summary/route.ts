import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { generateSummary } from "@/lib/llm";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const bookingId = body.bookingId as string;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { customer: true, provider: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const summary = await generateSummary(
    booking.title,
    booking.notes ?? "None provided.",
    booking.customer.name,
    booking.provider.name,
    booking.status
  );

  return NextResponse.json({ summary });
}
