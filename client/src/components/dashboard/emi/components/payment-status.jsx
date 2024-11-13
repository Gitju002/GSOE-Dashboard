import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useCreateOrderMutation } from "@/store/services/payment";

const PaymentStatus = ({ emiID }) => {
  const { toast, dismiss } = useToast();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createOrder] = useCreateOrderMutation();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await createOrder({
        emiId: emiID,
        paymentMethod: status,
      });
      if (data) {
        window.open(data.data.short_url, "_blank");
      }
      if (error) {
        toast({
          title: "Error",
          message: error.data.message,
          type: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        message: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(dismiss, 3000);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Payment Method</DialogTitle>
        <DialogDescription>
          Select a payment method to continue the payment. Your EMI ID is{" "}
          {emiID}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Select onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">CASH</SelectItem>
            <SelectItem value="ONLINE">UPI</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Continue"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default PaymentStatus;
