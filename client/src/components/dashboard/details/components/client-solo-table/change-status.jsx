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
  useChangeBookingStatusMutation,
  useGetBookingsDirectQuery,
} from "@/store/services/booking";
import { useToast } from "@/components/ui/use-toast";

const ChangeStatus = ({ bookingId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const { toast, dismiss } = useToast();
  const getBookingsDirect = useGetBookingsDirectQuery();
  const [changeBookingStatus] = useChangeBookingStatusMutation();

  const handleChangeStatus = async () => {
    if (!status) return;

    setLoading(true);
    try {
      const res = await changeBookingStatus({ bookingId, status }).unwrap();
      if (res.success) {
        toast({
          title: "Success",
          description: res.message,
          type: "success",
        });
        getBookingsDirect.refetch();
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.data.error,
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        dismiss();
      }, 5000);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-2 py-1 rounded-md hover:bg-slate-100 w-full text-start text-[14px]">
        Change status
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will change the status of the
            referral. Please select the new status.
          </DialogDescription>
          <Select onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CREATED">Created</SelectItem>
              <SelectItem value="STARTED">Started</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={handleChangeStatus}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Change status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeStatus;
