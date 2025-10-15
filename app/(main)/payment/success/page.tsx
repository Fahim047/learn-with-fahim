import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="mt-12 flex items-center justify-center min-h-[80vh]">
      <Card className="w-[400px]">
        <CardHeader className="flex flex-col items-center gap-2 justify-center">
          <CheckIcon className="size-12 text-green-500" />
          <CardTitle className="text-2xl font-bold">Payment Success</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Payment has been completed successfully.</p>
          <Link href="/" className={buttonVariants({ className: "w-full" })}>
            Go back to homepage
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
