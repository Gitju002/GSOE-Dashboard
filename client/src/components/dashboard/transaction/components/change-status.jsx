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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  useVerifyTransactionMutation,
  useGetTransactionsQuery,
} from "@/store/services/transaction";
import { useToast } from "@/components/ui/use-toast";

const ChangeTransactionStatus = ({ transactionId, transactionEndDate }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [verifyTransaction] = useVerifyTransactionMutation();
  const getTransactions = useGetTransactionsQuery();
  const { toast, dismiss } = useToast();
  const handleChangeStatus = async () => {
    setLoading(true);
    try {
      const verify = status === "COMPLETED" ? true : false;
      const response = await verifyTransaction({
        transactionId,
        verify,
      });
      console.log("response", response);
      toast({
        title: "Success",
        description: response.data.message,
        status: "success",
      });
      getTransactions.refetch();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Success",
        description: error?.data?.error || "Something went wrong",
        status: "success",
      });
    } finally {
      setTimeout(dismiss, 3000);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-2 py-1 rounded-md hover:bg-slate-100 w-full text-start text-[14px]">
        Change Status
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will change the status of the
            transaction. Please select the new status.
          </DialogDescription>
          <Select onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Paid</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-red-400 block text-xs">
            You can&apos;t select completed status if the transaction end date
            has not passed.
          </span>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={handleChangeStatus}
            disabled={loading || status === null}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Change Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeTransactionStatus;
