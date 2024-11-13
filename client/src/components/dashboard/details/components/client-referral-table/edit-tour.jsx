import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import RefferrelTableEdit from "../forms/referrel-table-update";
import { useState } from "react";

const EditTour = ({ bookingId }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-2 py-1 text-sm hover:bg-slate-100 w-full text-start rounded-lg">
        Edit Tour
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <RefferrelTableEdit bookingId={bookingId} setOpen={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditTour;
