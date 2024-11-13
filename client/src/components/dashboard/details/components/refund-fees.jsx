import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRefundPaymentMutation } from "@/store/services/payment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const RefundFee = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(null);
  const [refundPayment] = useRefundPaymentMutation();
  const { toast, dismiss } = useToast();

  const handleChangeFee = async () => {
    setLoading(true);
    try {
      const { data, message } = await refundPayment({
        bookingId: id,
        amount: Number(amount),
        paymentMethod: method,
      }).unwrap();
      toast({
        title: "Success",
        description: message,
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error?.data?.error || "Something went wrong",
        status: "error",
      });
    } finally {
      setLoading(false);
      setOpen(false);
      setTimeout(dismiss, 3000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-2 py-1 rounded-md hover:bg-slate-100 w-full text-start text-[14px]">
        Refund Payment
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will refund the fees. Please
            enter the amount to refund.
          </DialogDescription>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter refund amount"
          />
          {amount && isNaN(amount) && (
            <span className="text-red-400 block text-xs">
              Please enter a valid amount
            </span>
          )}
          <Select onValueChange={(value) => setMethod(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CREDIT_NOTE">Credit Note</SelectItem>
              <SelectItem value="NEFT">NEFT</SelectItem>
            </SelectContent>
          </Select>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={handleChangeFee}
            disabled={loading || !amount || !method || isNaN(amount)} // Ensure valid amount and method
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundFee;
