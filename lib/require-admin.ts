import "server-only";
import { getServerSession } from "./get-server-session";
import { redirect } from "next/navigation";
import { cache } from "react";

export const requireAdmin = cache(async () => {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/login");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }
  return session;
});
