import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatAmount } from "@/lib/utils";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({
    orderNumber: null,
    amount: null,
    date: null,
  });

  useEffect(() => {
    const orderNumber = searchParams.get("orderNumber");
    const amount = searchParams.get("amount");
    const date = searchParams.get("date");

    if (orderNumber && amount && date) {
      setData({
        orderNumber,
        amount,
        date: new Date(date).toLocaleDateString(),
      });
    }
  }, [searchParams]);

  return (
    <section className="min-h-screen flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Thank You for Your Payment!
          </CardTitle>
          <CardDescription>
            Your transaction has been successfully processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4">
            <h3 className="mb-2 font-semibold text-green-800">
              Order Details:
            </h3>
            <p className="text-sm text-green-700">
              Order : {data.orderNumber || "N/A"}
            </p>
            <p className="text-sm text-green-700">
              Amount : {formatAmount(data.amount) || "N/A"}
            </p>
            <p className="text-sm text-green-700">
              Date : {data.date || "N/A"}
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            A confirmation email has been sent to your registered email address.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default ThankYouPage;
