"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Search, Pencil, Trash2 } from "lucide-react";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  searchable?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  onEdit,
  onDelete,
  searchable = true,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredData = data.filter((row) =>
    columns.some((col) => {
      const value = row[col.key];
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="app-surface overflow-hidden">
      {searchable && (
        <div className="border-b border-slate-100 bg-slate-50/70 p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="app-input w-full pl-9 pr-3"
            />
          </div>
        </div>
      )}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                    className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${
                    column.sortable ? "cursor-pointer hover:bg-slate-100 transition-colors" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      sortDirection === "asc" ? (
                        <ChevronUp size={16} className="text-blue-600" />
                      ) : (
                        <ChevronDown size={16} className="text-blue-600" />
                      )
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors cursor-pointer ${
                  onRowClick ? "group" : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3 text-xs">
                    {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          aria-label="Edit row"
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          aria-label="Delete row"
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {sortedData.map((row, index) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="space-y-3 p-3"
            onClick={() => onRowClick?.(row)}
          >
            <div className="space-y-2">
              {columns.slice(0, 4).map((column) => (
                <div key={String(column.key)} className="flex items-start justify-between gap-4 text-xs">
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400">{column.label}</span>
                  <span className="min-w-0 text-right font-medium text-slate-700">{column.render ? column.render(row[column.key], row) : String(row[column.key])}</span>
                </div>
              ))}
            </div>
            {(onEdit || onDelete) && <div className="flex justify-end gap-2 border-t border-slate-100 pt-2">{onEdit && <button aria-label="Edit row" onClick={() => onEdit(row)} className="rounded-lg bg-blue-50 p-2 text-blue-600"><Pencil size={14} /></button>}{onDelete && <button aria-label="Delete row" onClick={() => onDelete(row)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 size={14} /></button>}</div>}
          </motion.div>
        ))}
      </div>

      {sortedData.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-slate-500">No data found</p>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <p className="text-[11px] text-slate-500">
          Showing {sortedData.length} of {data.length} results
        </p>
        <div className="flex gap-2 sm:justify-end">
          <button disabled className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-400">
            Previous
          </button>
          <button className="rounded-lg bg-[#0a2342] px-3 py-2 text-[11px] font-bold text-white">
            1
          </button>
          <button disabled className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-400">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
