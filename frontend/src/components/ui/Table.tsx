import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found',
  onRowClick,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="w-full py-10 text-center text-xs text-[#A1A1A1] border border-[#2A2A2A] rounded-xl bg-[#181818]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#2A2A2A] bg-[#181818]">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-[#2A2A2A] bg-[#141414]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3 px-4 font-medium text-[11px] text-[#A1A1A1] ${
                  col.className || ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2A2A2A]">
          {data.map((item) => {
            const key = keyExtractor(item);
            return (
              <tr
                key={key}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors ${
                  onRowClick
                    ? 'hover:bg-white/[0.03] cursor-pointer'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className={`py-3 px-4 text-[#F5F5F0] ${col.className || ''}`}>
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? '')
                      : null}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
