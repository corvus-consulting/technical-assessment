import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

type SearchParams = { status?: string; sort?: string };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    return (
      <main>
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Admins only.{" "}
          <Link href="/" className="text-brand-600 underline">
            Switch user
          </Link>
          .
        </p>
      </main>
    );
  }

  const all = await prisma.booking.findMany({
    include: { customer: true, provider: true },
  });

  let rows = all;

  if (params.status) {
    rows = rows.filter((b) => b.status === params.status);
  }

  if (params.sort === "price") {
    rows = rows.sort((a, b) => b.price - a.price);
  } else {
    rows = rows.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  const page = rows.slice(0, 50);

  const revenue = all
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin</h1>
        <Link href="/" className="text-sm text-brand-600 underline">
          Switch user
        </Link>
      </div>

      <p className="mt-1 text-sm text-ink-muted">
        {all.length} bookings, ${revenue.toFixed(2)} completed revenue
      </p>

      <div className="mt-4 flex gap-3 text-sm">
        <Link href="/admin" className="text-brand-600 underline">
          All
        </Link>
        <Link href="/admin?status=PENDING" className="text-brand-600 underline">
          Pending
        </Link>
        <Link
          href="/admin?status=COMPLETED"
          className="text-brand-600 underline"
        >
          Completed
        </Link>
        <Link href="/admin?sort=price" className="text-brand-600 underline">
          By price
        </Link>
      </div>

      <table className="mt-6 w-full text-left text-sm">
        <thead className="text-ink-muted">
          <tr>
            <th className="py-2">Booking</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Provider</th>
            <th className="py-2">Status</th>
            <th className="py-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {page.map((b) => (
            <tr key={b.id} className="border-t border-border-subtle">
              <td className="py-2">{b.title}</td>
              <td className="py-2">{b.customer.name}</td>
              <td className="py-2">{b.provider.name}</td>
              <td className="py-2">
                <StatusBadge status={b.status} />
              </td>
              <td className="py-2 text-right">${b.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
