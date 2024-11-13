import {
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function DataTable({ columns, data, totalCount }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const debounce = setTimeout(() => {
      if (search) {
        params.set("ss", search);
      } else {
        params.delete("ss");
      }
      params.set("sp", page);
      setSearchParams(params);
    }, 150);
    return () => clearTimeout(debounce);
  }, [searchParams, search, page, setSearchParams]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    searchParams.set("sp", newPage.toString());
    setSearchParams(searchParams);
  };

  const currentPage = searchParams.get("sp")
    ? parseInt(searchParams.get("sp"), 10)
    : 1;

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search here..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchParams({ search });
            }
          }}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {totalCount &&
          new Array(Math.ceil(totalCount / 10)).fill(null).map((_, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(i + 1)}
              disabled={page === i + 1}
            >
              {i + 1}
            </Button>
          ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={currentPage === (Math.ceil(totalCount / 10) || 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
