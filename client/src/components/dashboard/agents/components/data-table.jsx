import React, { useEffect, useMemo } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DataTable = ({ columns, data, agent }) => {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((row) =>
      columns.some((column) => {
        const cellValue = row[column.accessorKey]?.toString().toLowerCase();
        return cellValue?.includes(globalFilter.toLowerCase());
      })
    );
  }, [data, globalFilter, columns]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  });

  React.useEffect(() => {
    if (searchParams.get("edit")) return;
    const debounceFilter = setTimeout(() => {
      if (globalFilter) {
        setSearchParams({ search: globalFilter });
      } else {
        setSearchParams({});
      }
    }, 300);
    return () => clearTimeout(debounceFilter);
  }, [globalFilter, setSearchParams, searchParams]);

  return (
    <div>
      <div className="flex items-center pb-4 w-96 gap-2">
        {searchParams.get("edit") && agent?.success && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearchParams({});
            }}
          >
            <ArrowLeft size={16} />
          </Button>
        )}
        <Input
          placeholder="Search..."
          onChange={(e) => setGlobalFilter(e.target.value)}
          defaultValue={globalFilter}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DataTable;
