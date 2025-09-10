import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("You have been logged out!");
        },
        onError: () => {
          toast.error("Failed to sign out. Please Try again.");
        },
      },
    });
  };

  return handleLogout;
}
