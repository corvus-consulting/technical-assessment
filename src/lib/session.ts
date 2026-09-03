import { cookies } from "next/headers";
import { prisma } from "./prisma";

/**
 * Session handling for this app.
 *
 * In production this is backed by a real auth provider. For local development
 * the signed-in user id is stored in a cookie, set from the home page.
 * The interface below is what the rest of the app depends on.
 */

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const userId = store.get("uid")?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}
