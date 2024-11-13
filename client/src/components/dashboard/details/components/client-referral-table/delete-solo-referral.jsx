import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useDeleteBookingMutation,
  useGetBookingsReferralQuery,
} from "@/store/services/booking";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const DeleteSoloReferral = ({ id }) => {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState("");
  const [deleteBooking] = useDeleteBookingMutation();
  const { toast, dismiss } = useToast();
  const getbooking = useGetBookingsReferralQuery();

  const handleDelete = async () => {
    try {
      const res = await deleteBooking(id).unwrap();

      if (res.success) {
        toast({
          title: "Success",
          description: res.message,
          status: "success",
        });
        getbooking.refetch();
      } else {
        toast({
          title: "Error",
          description: res.error.data.error,
          status: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.data?.error ||
          error.message ||
          "An error occurred while deleting the booking",
        status: "error",
      });
    } finally {
      setTimeout(() => {
        dismiss();
      }, 5000);
      setBookingId("");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"sm"} className="w-full h-8">
          Delete <Trash className="h-4 w-4 ml-2" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            referral. Please type the booking ID to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-600/80"
            onClick={handleDelete}
            disabled={bookingId !== id}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSoloReferral;
