import "server-only";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-server-session";

export async function requireUser() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/login");
  }
  return session.user;
}
