import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="mt-12 flex items-center justify-center min-h-[80vh]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Payment has been cancelled.</p>
          <Link href="/" className={buttonVariants({ className: "w-full" })}>
            Go back to homepage
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
