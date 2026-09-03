import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <main>
        <h1 className="text-xl font-semibold">My bookings</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Not signed in.{" "}
          <Link href="/" className="text-brand-600 underline">
            Pick a user
          </Link>
          .
        </p>
      </main>
    );
  }

  const bookings = await prisma.booking.findMany({
    where: { OR: [{ customerId: user.id }, { providerId: user.id }] },
    orderBy: { createdAt: "desc" },
    include: { customer: true, provider: true },
    take: 25,
  });

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My bookings</h1>
        <Link href="/" className="text-sm text-brand-600 underline">
          Switch user
        </Link>
      </div>

      <p className="mt-1 text-sm text-ink-muted">
        {user.name} ({user.role})
      </p>

      <div className="mt-6 grid gap-3">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="rounded-[10px] border border-border-subtle bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{b.title}</div>
                <div className="mt-1 text-sm text-ink-muted">
                  {b.customer.name} to {b.provider.name}
                </div>
                {b.notes && (
                  <div className="mt-2 text-sm text-ink-muted">{b.notes}</div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={b.status} />
                <div className="text-sm font-medium">
                  ${b.price.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <p className="mt-6 text-sm text-ink-muted">No bookings.</p>
      )}
    </main>
  );
}
