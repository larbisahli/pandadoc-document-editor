import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// --- Types
export type RowData = { id: string } & Record<string, string>;

type TableMeta = {
  updateCell: (rowIndex: number, columnId: string, value: string) => void;
};

// --- Helpers
const uid = () => Math.random().toString(36).slice(2, 9);

function makeTextColumn(
  key: string,
  header: string,
): ColumnDef<RowData, string> {
  return {
    id: key,
    accessorKey: key,
    header: header,
    cell: EditableCell,
    size: 200,
    enableSorting: false,
  };
}

// --- Editable Cell
function EditableCell({
  getValue,
  row,
  column,
  table,
}: {
  getValue: () => unknown;
  row: any;
  column: any;
  table: any;
}) {
  const initial = (getValue() ?? "") as string;
  const [value, setValue] = React.useState(initial);
  React.useEffect(() => setValue(initial), [initial]);

  const onBlur = () => {
    const next = value ?? "";
    (table.options.meta as TableMeta).updateCell(row.index, column.id, next);
  };

  return (
    <input
      className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      placeholder="—"
    />
  );
}

// --- Header with column actions
function ColumnHeader({
  header,
  onDelete,
}: {
  header: string;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-medium">{header}</span>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-red-50 hover:text-red-600"
          title="Delete column"
        >
          Delete
        </button>
      )}
    </div>
  );
}

// --- Main Component
export default function DynamicEditableTable() {
  const [columns, setColumns] = React.useState<ColumnDef<RowData, any>[]>(
    [
      makeTextColumn("name", "Name"),
      makeTextColumn("email", "Email"),
      makeTextColumn("role", "Role"),
    ].map((col) => ({
      ...col,
      header: (ctx: any) => (
        <ColumnHeader
          header={(col.header as string) ?? String(col.id)}
          onDelete={() => handleDeleteColumn(String(col.id))}
        />
      ),
    })),
  );

  const [data, setData] = React.useState<RowData[]>([
    { id: uid(), name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: uid(), name: "Bob", email: "bob@example.com", role: "Editor" },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateCell: (rowIndex, columnId, value) => {
        setData((old) => {
          const next = [...old];
          next[rowIndex] = { ...next[rowIndex], [columnId]: value };
          return next;
        });
      },
    } as TableMeta,
  });

  // --- Column CRUD
  function handleAddColumn(key: string, header: string) {
    key = key.trim();
    header = header.trim() || key;
    if (!key) return;

    // Prevent duplicates
    if (columns.some((c) => (c.id ?? c.accessorKey) === key)) return;

    const col = makeTextColumn(key, header);
    const colWithHeader: ColumnDef<RowData, any> = {
      ...col,
      header: () => (
        <ColumnHeader
          header={header}
          onDelete={() => handleDeleteColumn(key)}
        />
      ),
    };

    setColumns((cols) => [...cols, colWithHeader]);
    setData((rows) => rows.map((r) => ({ ...r, [key]: r[key] ?? "" })));
  }

  function handleDeleteColumn(columnId: string) {
    setColumns((cols) =>
      cols.filter((c) => (c.id ?? c.accessorKey) !== columnId),
    );
    setData((rows) =>
      rows.map(({ id, ...rest }) => {
        const { [columnId]: _omit, ...next } = rest as Record<string, string>;
        return { id, ...(next as Record<string, string>) } as RowData;
      }),
    );
  }

  // --- Row CRUD
  function handleAddRow() {
    const empty: RowData = { id: uid() };
    columns.forEach((c) => {
      const key = String(c.id ?? c.accessorKey);
      if (key !== "id") empty[key] = "";
    });
    setData((d) => [...d, empty]);
  }

  function handleDeleteRow(rowId: string) {
    setData((d) => d.filter((r) => r.id !== rowId));
  }

  // --- Simple controls state
  const [newKey, setNewKey] = React.useState("");
  const [newHeader, setNewHeader] = React.useState("");

  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Controls */}
      <div className="mb-4 grid grid-cols-1 items-end gap-2 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            New column key
          </label>
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="e.g. phone"
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Header label
          </label>
          <input
            value={newHeader}
            onChange={(e) => setNewHeader(e.target.value)}
            placeholder="e.g. Phone"
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="sm:col-span-1">
          <button
            type="button"
            onClick={() => {
              handleAddColumn(
                newKey || newHeader.toLowerCase().replace(/\s+/g, "_"),
                newHeader || newKey,
              );
              setNewKey("");
              setNewHeader("");
            }}
            className="h-9 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Column
          </button>
        </div>
        <div className="text-right sm:col-span-1">
          <button
            type="button"
            onClick={handleAddRow}
            className="h-9 rounded-md border border-gray-300 px-3 text-sm hover:bg-gray-50"
          >
            Add Row
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="sticky top-0 z-10 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
                <th className="sticky top-0 z-10 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="odd:bg-white even:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b border-gray-100 px-3 py-2 align-top"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="border-b border-gray-100 px-3 py-2 align-top">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(row.original.id)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-red-50 hover:text-red-600"
                  >
                    Delete row
                  </button>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-3 py-8 text-center text-sm text-gray-500"
                >
                  No data. Use "Add Row" to insert a new record.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Column quick list with delete buttons */}
      <div className="mt-4 flex hidden flex-wrap gap-2">
        {columns.map((c) => {
          const id = String(c.id ?? c.accessorKey);
          return (
            <span
              key={id}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs"
            >
              {id}
              <button
                type="button"
                onClick={() => handleDeleteColumn(id)}
                className="rounded border border-gray-300 px-1 hover:bg-red-50 hover:text-red-600"
                title={`Delete column ${id}`}
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
