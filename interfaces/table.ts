export type TableCell = string | number | boolean | null;

export type TableColumn = {
  id: string;
  header: string;
  accessorKey: string; // key in row object
  width?: number; // px
};

export type TableRow = Record<string, TableCell>;

export type TableData = {
  columns: TableColumn[];
  rows: TableRow[];
};

export type TableBlockProps = {
  overlayId: string;
  data: TableData;
  onChange?: (next: TableData) => void; // call this to persist edits
  className?: string;
};
