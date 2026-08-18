"use client";

interface TablePaginationProps {
  page: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizes?: number[];
}

export function TablePagination({
  page,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizes = [10, 20, 30, 40],
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-neutral-500">
        <span>{totalItems === 0 ? "No records" : `${start}–${end} of ${totalItems}`}</span>
        <label className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(event) => {
              onPageSizeChange(Number(event.target.value));
              onPageChange(1);
            }}
            className="rounded-lg border bg-white px-2 py-1.5 text-neutral-900"
            aria-label="Rows per page"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
        <span>Page {safePage} of {totalPages}</span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={safePage === 1}
          onClick={() => onPageChange(safePage - 1)}
          className="rounded-lg border px-3 py-2 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={safePage === totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="rounded-lg border px-3 py-2 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
