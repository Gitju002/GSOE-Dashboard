import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Pencil } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import DeleteAgent from "./delete-agent";

const getRandomColor = () => {
  const colors = [
    { color: "bg-red-500", textColor: "text-white" },
    { color: "bg-green-500", textColor: "text-white" },
    { color: "bg-blue-500", textColor: "text-white" },
    { color: "bg-yellow-500", textColor: "text-black" },
    { color: "bg-purple-500", textColor: "text-white" },
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const letterColorMap = new Map();

const getColorForLetter = (letter) => {
  if (!letterColorMap.has(letter)) {
    letterColorMap.set(letter, getRandomColor());
  }
  return letterColorMap.get(letter);
};

const Actions = ({ row }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        disabled={searchParams.get("edit") === row.original._id}
        onClick={() => {
          setSearchParams({ edit: row.original._id });
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <DeleteAgent id={row.original._id} />
    </div>
  );
};

export const columns = [
  {
    accessorKey: "_id",
    header: "Agent ID",
    cell: ({ row }) => (
      <div className="flex items-center justify-center text-nowrap text-ellipsis">
        <div>{row.original._id}</div>
      </div>
    ),
  },
  {
    accessorKey: "avatarUrl",
    header: "Image",
    cell: ({ row }) => {
      const firstLetter = row.original.fullName.charAt(0).toUpperCase();
      const { color, textColor } = getColorForLetter(firstLetter);
      return (
        <div className="flex items-center justify-center">
          {row.original.avatarUrl ? (
            <img
              src={row.original.avatarUrl}
              alt="Agent Image"
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-full flex items-center justify-center w-6 h-6 aspect-square"
            />
          ) : (
            <div
              className={cn(
                "rounded-full flex items-center justify-center w-6 h-6 aspect-square",
                color,
                textColor
              )}
            >
              {firstLetter}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Full Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center text-nowrap text-ellipsis">
        <div>{row.original.fullName}</div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center text-nowrap text-ellipsis">
        <div>{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "N/A",
  },
  {
    accessorKey: "coins",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Coins
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center text-nowrap text-ellipsis">
        <div>{row.original.coins}</div>
      </div>
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

export default columns;
