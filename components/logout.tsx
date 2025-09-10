"use client";

import { Button } from "./ui/button";
import { useSignOut } from "@/hooks/use-signout";

export function Logout() {
  const handleLogout = useSignOut();

  return (
    <Button variant={"destructive"} onClick={handleLogout}>
      Logout
    </Button>
  );
}
