"use client";
import { authClient } from "@/lib/auth-client";
import type { Session } from "@/lib/auth";
import { ReactNode } from "react";
import GlobalLoader from "../global-loader";

interface AuthProviderProps {
  children: ReactNode;
  initialSession: Session | null;
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const { isPending } = authClient.useSession();

  if (!initialSession && isPending) {
    return <GlobalLoader />;
  }

  return children;
}
