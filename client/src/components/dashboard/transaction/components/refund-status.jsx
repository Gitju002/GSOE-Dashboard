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

const RefundStatus = ({ transactionId, usedNote, paidAmount }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-2 py-1 rounded-md hover:bg-slate-100 w-full text-start text-[14px]">
        Check Refund Status
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refunded Amount Status</DialogTitle>
          <DialogDescription className="space-y-2">
            <span className="block">
              You have used <b>{usedNote}</b> amount of Credit Note
            </span>
            <span className="block">
              Transaction ID: <b>{transactionId}</b>
            </span>
            <span className="block">
              Remaining refund amount: <b>{paidAmount}</b>
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RefundStatus;
