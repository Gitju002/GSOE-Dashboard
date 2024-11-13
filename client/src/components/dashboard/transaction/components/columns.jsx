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
import ChangeTransactionStatus from "./change-status";
import { useToast } from "@/components/ui/use-toast";
import { useGetAuthenticatedUserQuery } from "@/store/services/users";
import RefundStatus from "./refund-status";

export const columns = [
  {
    accessorKey: "_id",
    header: "Transaction ID",
    cell: ({ row }) => row.original._id,
  },
  {
    accessorKey: "bookingId._id",
    header: "Booking ID",
    cell: ({ row }) => row.original.bookingId?._id || "N/A",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `₹${row.original.amount.toLocaleString()}`,
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => row.original.paymentMethod,
  },

  {
    accessorKey: "razorpayPaymentId",
    header: "Razorpay Payment ID",
    cell: ({ row }) => row.original.razorpayPaymentId || "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          className={
            row.original.status
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }
        >
          {row.original.status ? "Paid" : "Pending"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
    cell: ({ row }) => row.original.transactionType,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",

    cell: ({ row }) =>
      row.original.createdAt.split("T")[0].split("-").reverse().join("/"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { data, isLoading } = useGetAuthenticatedUserQuery();
      const { toast } = useToast();
      if (isLoading) return null;
      const allowedRoles = ["ADMIN", "ACCOUNTS"];
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
                navigator.clipboard.writeText(row.original._id);
                toast({
                  title: "Transaction ID copied",
                  description:
                    "The Transaction ID has been copied to the clipboard",
                  duration: 3000,
                });
              }}
            >
              Copy Transaction ID
            </DropdownMenuItem>
            {allowedRoles.includes(data?.data?.role) && (
              <>
                <DropdownMenuItem asChild>
                  <ChangeTransactionStatus
                    transactionId={row.original._id}
                    transactionEndDate={row.original.createdAt}
                  />
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem asChild>
              <RefundStatus
                transactionId={row.original._id}
                paidAmount={row.original.bookingId?.paidAmount || 0}
                usedNote={row.original.bookingId?.usedCreditNote || 0}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
