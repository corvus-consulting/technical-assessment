import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSessionUser();
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  return (
    <main>
      <h1 className="text-xl font-semibold">Booking Platform</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Development environment. Pick a user to sign in as.
      </p>

      {user && (
        <p className="mt-4 text-sm">
          Signed in as <strong>{user.name}</strong> ({user.role}){" "}
          <Link href="/api/dev-login" className="text-brand-600 underline">
            sign out
          </Link>
        </p>
      )}

      <div className="mt-6 flex gap-3 text-sm">
        <Link href="/bookings" className="text-brand-600 underline">
          My bookings
        </Link>
        <Link href="/admin" className="text-brand-600 underline">
          Admin
        </Link>
        <Link href="/api/graphql" className="text-brand-600 underline">
          GraphQL
        </Link>
      </div>

      <div className="mt-8 grid gap-2">
        {users.map((u) => (
          <a
            key={u.id}
            href={`/api/dev-login?userId=${u.id}`}
            className="flex items-center justify-between rounded-[10px] border border-border-subtle bg-surface px-4 py-2 text-sm"
          >
            <span>
              {u.name} <span className="text-ink-muted">{u.email}</span>
            </span>
            <span className="text-xs text-ink-muted">{u.role}</span>
          </a>
        ))}
      </div>
    </main>
  );
}
