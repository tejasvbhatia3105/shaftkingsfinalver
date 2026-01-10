// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */

import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

export type TableColumn = {
  header: string | ReactNode;
  accessor: string | ((row: any, index: number) => React.ReactNode);
  headerContent?: () => React.ReactNode;
};

type TableProps = {
  data: Record<string, any>[];
  columns: TableColumn[];
  children?: ReactNode;
  hiddenTh?: boolean;
  rowAction?: (param: any) => void;
  className?: {
    thead?: string;
    tbody?: string;
    tr?: string | ((row: any, index: number) => string);
    th?: string;
    td?: string;
  };
  odd?: boolean;
};

export function Table({
  data,
  columns,
  className,
  children,
  odd,
  rowAction,
}: TableProps) {
  return (
    <table className="h-full min-w-full divide-y divide-[#E5E5E5] dark:divide-white/5">
      <thead
        className={cn(
          'border-t h-11 border-[#E5E5E5] dark:border-white/5',
          className?.thead
        )}
      >
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              scope="col"
              className={cn(
                'whitespace-nowrap px-6 py-3 text-left text-xs font-medium capitalize tracking-wider text-shaftkings-dark-100 dark:text-[#C0C0C0]',
                className?.th
              )}
            >
              {column.headerContent !== undefined
                ? column.headerContent()
                : column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={cn(className?.tbody)}>
        {children ? (
          <>{children}</>
        ) : (
          data?.map((row, rowIndex) => (
            <tr
              onClick={rowAction ? () => rowAction(row) : undefined}
              className={cn(
                'cursor-pointer lg:transition-all lg:duration-150 lg:ease-in-out dark:lg:hover:bg-shaftkings-dark-300',
                {
                  'dark:lg:odd:hover:bg-shaftkings-dark-350 dark:lg:even:hover:bg-shaftkings-dark-300':
                    odd,
                },
                typeof className?.tr === 'function'
                  ? className.tr(row, rowIndex)
                  : className?.tr
              )}
              key={rowIndex}
            >
              {columns.map((column, index) => (
                <td
                  key={index}
                  className={cn(
                    'px-5 py-4 text-sm text-shaftkings-gray-700 lg:px-6',
                    className?.td,
                    { 'py-5': odd }
                  )}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(row, rowIndex)
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
