import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationControlProps) {
  // If there is only one page (or zero), don't render pagination
  if (totalPages <= 1) return null;

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* First Page (Always show page 1) */}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageChange(1)}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Ellipsis before current range */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Previous Page relative to current */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageChange(currentPage - 1)}
              className="cursor-pointer"
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Current Page */}
        <PaginationItem>
          <PaginationLink isActive className="cursor-pointer">
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* Next Page relative to current */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageChange(currentPage + 1)}
              className="cursor-pointer"
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Ellipsis after current range */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last Page (Always show last page) */}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageChange(totalPages)}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}