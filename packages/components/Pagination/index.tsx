'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  className,
}: PaginationProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (isMobile && totalPages > 5) {
      const visiblePages = [];

      if (currentPage <= 3) {
        visiblePages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        visiblePages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        visiblePages.push(1, '...', currentPage, '...', totalPages);
      }

      for (const page of visiblePages) {
        if (page === '...') {
          pages.push(
            <span
              key={`ellipsis-${Math.random()}`}
              className="w-9 text-center text-sm text-white/60"
            >
              ...
            </span>
          );
        } else {
          pages.push(
            <button
              key={page}
              onClick={() => setCurrentPage(Number(page))}
              className={cn(
                'size-9 text-sm font-bold',
                currentPage === page
                  ? 'bg-[#F8E173] text-black'
                  : 'bg-white/[0.08] text-white'
              )}
            >
              {page}
            </button>
          );
        }
      }
    } else {
      // Desktop: todas as páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={cn(
              'size-9 text-sm font-bold',
              currentPage === i
                ? 'bg-[#F8E173] text-black'
                : 'bg-white/[0.08] text-white'
            )}
          >
            {i}
          </button>
        );
      }
    }

    return pages;
  };

  return (
    <div className={cn('flex items-center gap-x-[6px]', className)}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`flex items-center gap-x-2 px-3 py-2 text-sm font-medium text-white ${
          currentPage === 1
            ? 'cursor-not-allowed bg-white/[0.04] opacity-50'
            : 'bg-white/[0.08] hover:bg-white/[0.12]'
        }`}
      >
        <img
          className="rotate-180"
          width={8}
          height={4.8}
          src="/assets/svg/arrow-right.svg"
          alt="Previous"
        />
        Back
      </button>

      {renderPageNumbers()}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-x-2 px-3 py-2 text-sm font-medium text-white ${
          currentPage === totalPages
            ? 'cursor-not-allowed bg-white/[0.04] opacity-50'
            : 'bg-white/[0.08] hover:bg-white/[0.12]'
        }`}
      >
        Next
        <img
          width={8}
          height={4.8}
          src="/assets/svg/arrow-right.svg"
          alt="Next"
        />
      </button>
    </div>
  );
};

export default Pagination;
