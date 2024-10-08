import { Button } from "@/components/ui/button";
import { mkConfig, generateCsv, download } from "export-to-csv";
import React from "react";

function ExportToCsv({ table }: any) {
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: "sample", // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  // export function
  const exportExcel = () => {
    console.log("table :>> ", table);
    console.log(
      "(table.getFilteredRowModel().rows) :>> ",
      table.getFilteredRowModel().rows
    );

    // Filtrelenmiş satırları alıyoruz
    const rows = table.getFilteredRowModel().rows;

    // Görünen sütunların id'lerini alıyoruz
    const visibleColumnIds = table
      .getAllColumns()
      .filter((column: any) => column.getIsVisible())
      .map((column: any) => column.id);

    // Görünen sütunları içeren verileri hazırlıyoruz
    const rowData = rows.map((row: any) => {
      const filteredData: any = {};
      visibleColumnIds.forEach((id: any) => {
        filteredData[id] = row.original[id];
      });
      return filteredData;
    });

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  return (
    <div>
      <Button  onClick={exportExcel}>
        Export Excel
      </Button>
    </div>
  );
}

export default React.memo(ExportToCsv);
