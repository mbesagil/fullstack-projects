import React, { useEffect, useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ApiService from "@/core/ApiService";
import { Pagination, Checkbox, Popover } from "antd";
import { Button } from "@/components/ui/button";
import ExportToCsv from "./ExportToCsv";
import Delete from "./Delete";
import { PiSlidersHorizontal } from "react-icons/pi";
import { TbArrowsSort } from "react-icons/tb";

interface DataTableProps {
  config: {
    service: string;
    columns: { label: string; key: string }[];
    description: string;
    enableMultiRowSelection: boolean;
    buttons: {
      create: boolean;
      update: boolean;
      delete: boolean;
      export: boolean;
      import: boolean;
      getSelectedRows: boolean;
    };
  };
  createCallback?: () => void;
  updateCallback?: (payload: any) => void;
  getSelectedRowsCallback?: (payload: any) => void;
  refreshData: boolean; // Yeni prop eklendi
}

export const DataTable = React.memo(
  ({
    config,
    createCallback,
    updateCallback,
    getSelectedRowsCallback,
    refreshData, // Yeni prop eklendi
  }: DataTableProps) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(
      config.columns.map((col) => col.key)
    );
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleColumnSelect = (columnKey: string, checked: boolean) => {
      setSelectedColumns((prev) =>
        checked ? [...prev, columnKey] : prev.filter((key) => key !== columnKey)
      );
    };

    const columns: ColumnDef<any>[] = useMemo(() => {
      const selectColumn: ColumnDef<any> = {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              type="checkbox"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              style={{ width: "16px", height: "16px" }} // You can adjust the width and height as needed
            />{" "}
            All
          </div>
        ),
        cell: ({ row }) => (
          <Checkbox
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            style={{ width: "16px", height: "16px" }} // Same here for consistency
          />
        ),
        size: 16, // Or set a fixed width for the column
        minSize: 16,
        maxSize: 16,
      };

      const otherColumns = config.columns
        .filter((col) => selectedColumns.includes(col.key))
        .map((col) => ({
          accessorKey: col.key,
          header: ({ column }: any) => {
            return (
              <div
                className="flex items-center cursor-pointer font-bold"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                {col.label}
                <span className="ms-2">
                  <TbArrowsSort />
                </span>
              </div>
            );
          },
        }));

      return [selectColumn, ...otherColumns];
    }, [config.columns, selectedColumns]);

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      state: {
        rowSelection,
        sorting,
      },
      enableMultiRowSelection: config.enableMultiRowSelection || false,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      getRowId: (row) => row._id,
    });

    const getServiceData = () => {
      ApiService.post(`${config.service}/getAll`, { page, limit })
        .then((res) => {
          setData(res.data.data);
          setTotal(res.data.total);
        })
        .catch((err) => console.log("err :>> ", err));
    };

    const handlePaginationChange = (newPage: number, newPageSize?: number) => {
      setPage(newPage);
      if (newPageSize) {
        setLimit(newPageSize);
      }
    };

    useEffect(() => {
      console.log("page limit degisti");

      getServiceData();
    }, [page, limit, refreshData]);

    // useEffect(() => {
    //   console.log("Datatable yuklendi");

    //   getServiceData();
    // }, []);

    const popoverContentForColumns = (
      <div className="flex flex-col">
        {config.columns.map((col) => (
          <Checkbox
            key={col.key}
            checked={selectedColumns.includes(col.key)}
            onChange={(e) => handleColumnSelect(col.key, e.target.checked)}
          >
            {col.label}
          </Checkbox>
        ))}
      </div>
    );

    const updateHandle = () => {
      let rowSelectionArray = Object.keys(rowSelection);
      if (updateCallback)
        updateCallback(data.find((da) => da._id == rowSelectionArray[0]));
    };

    const getSelectedRowsHandle = () => {
      if (getSelectedRowsCallback)
        getSelectedRowsCallback(Object.keys(rowSelection));
    };

    return (
      <>
        <div className="flex justify-between gap-2 items-center px-2">
          <div>
            {config.buttons.create && (
              <div>
                <Button onClick={createCallback}>Create</Button>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {Object.keys(rowSelection).length === 1 && (
              <>
                {config.buttons.update && (
                  <div>
                    <Button onClick={updateHandle}>Update</Button>
                  </div>
                )}
                {config.buttons.delete && (
                  <Delete
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    config={config}
                    getServiceData={getServiceData}
                  ></Delete>
                )}
              </>
            )}

            {config.buttons.export && (
              <div>
                <ExportToCsv table={table}></ExportToCsv>
              </div>
            )}

            {config.buttons.getSelectedRows && (
              <Button onClick={() => getSelectedRowsHandle()}>
                Selected Rows
              </Button>
            )}

            <div className="flex flex-row">
              <Popover content={popoverContentForColumns} placement="bottom">
                <Button className="font-semibold ">
                  <PiSlidersHorizontal />
                  View
                </Button>
              </Popover>
            </div>
          </div>
        </div>
        <div className="border rounded-md my-2">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="max-h-80 overflow-auto">
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="py-2 mb-2 flex justify-end">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={handlePaginationChange}
            pageSizeOptions={[5, 10, 20, 30, 40]}
            showSizeChanger
            defaultPageSize={1}
          />
        </div>
      </>
    );
  }
);
