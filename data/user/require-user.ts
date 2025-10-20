import "server-only";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-server-session";
import { cache } from "react";

export const requireUser = cache(async () => {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/login");
  }
  return session.user;
});
