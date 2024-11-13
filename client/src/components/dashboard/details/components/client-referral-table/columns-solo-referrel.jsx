import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import ChangeStatus from "./change-status";
import DeleteSoloReferral from "./delete-solo-referral";
import EditTour from "./edit-tour";
import { Link } from "react-router-dom";
import RefeundFee from "../refund-fees";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export const columns = [
  {
    header: "Agent Name",
    cell: ({ row }) => row.original.agentId?.fullName || "N/A",
  },
  {
    header: "Traveler Name",
    cell: ({ row }) => row.original.travellerId?.fullName || "N/A",
  },
  {
    accessorKey: "_id",
    header: "Booking ID",
    cell: ({ row }) => row.original._id,
  },

  {
    accessorKey: "createdAt",
    header: "Booking Date",
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
  },

  {
    accessorKey: "startDate",
    header: "Journey Start",
    cell: ({ row }) => format(new Date(row.original.startDate), "PPP"),
  },
  {
    accessorKey: "endDate",
    header: "Journey End",
    cell: ({ row }) => format(new Date(row.original.endDate), "PPP"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <>
          {row.original.status === "STARTED" && (
            <Badge className="bg-yellow-500 text-nowrap">Started</Badge>
          )}
          {row.original.status === "CREATED" && (
            <Badge className="bg-gray-500 text-nowrap">Created</Badge>
          )}
          {row.original.status === "COMPLETED" && (
            <Badge className="bg-green-500 ">Completed</Badge>
          )}
          {row.original.status === "CANCELLED" && (
            <Badge variant={"destructive"}>Cancelled</Badge>
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(row.original.agentId._id);
                toast({
                  title: "Agent ID copied",
                  description: "The Agent ID has been copied to the clipboard",
                  duration: 3000,
                });
              }}
            >
              Copy Agent ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(row.original._id);
                toast({
                  title: "booking ID copied",
                  description:
                    "The booking ID has been copied to the clipboard",
                  duration: 3000,
                });
              }}
            >
              Copy booking ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(row.original.travellerId._id);
                toast({
                  title: "Traveler ID copied",
                  description:
                    "The traveler ID has been copied to the clipboard",
                  duration: 3000,
                });
              }}
            >
              Copy traveler ID
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {row.original.status !== "COMPLETED" &&
              row.original.status !== "CANCELLED" ? (
                <ChangeStatus bookingId={row.original._id} />
              ) : (
                <></>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {row.original.status === "STARTED" ||
              row.original.status === "CREATED" ? (
                <EditTour bookingId={row.original._id} />
              ) : (
                <></>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {row.original.status !== "COMPLETED" &&
              row.original.status !== "CANCELLED" ? (
                <Link to={`/dashboard/emi?bookingId=${row.original._id}`}>
                  Edit Payment Terms
                </Link>
              ) : (
                <></>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <RefeundFee id={row.original._id} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.status === "STARTED" ||
            row.original.status === "CREATED" ? (
              <DeleteSoloReferral id={row.original._id} />
            ) : (
              <></>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
