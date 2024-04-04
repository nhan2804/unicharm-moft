import React from "react";
import ExcelJS from "exceljs";

const WrapperExportExcel = ({
  columns,
  dataSource,
  worksheetName = "Sheet1",
  fileName = "export.xlsx",
}) => {
  const renderExcelData = (
    worksheet,
    columns,
    dataSource,
    rowIndex = 1,
    parentColIndex = 0
  ) => {
    // Create header row
    const headerRow = worksheet.addRow(columns.map((c) => c.title));
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.border = { bottom: { style: "thin" } };
    });

    // Add data rows
    let rowOffset = rowIndex;
    dataSource.forEach((item, index) => {
      const row = worksheet.addRow([]);
      rowOffset++;

      let colOffset = 1;
      columns.forEach((column, colIndex) => {
        if (column.children) {
          const numChildren = column.children.length;
          renderExcelData(
            worksheet,
            column.children,
            item[column.key],
            rowOffset,
            colIndex
          );
          worksheet.mergeCells(
            rowOffset,
            colOffset,
            rowOffset + numChildren - 1,
            colOffset
          );
          colOffset += numChildren;
        } else {
          let value = item;
          const dataIndex = Array.isArray(column.dataIndex)
            ? column.dataIndex
            : [column.dataIndex];
          for (const key of dataIndex) {
            value = value[key];
          }
          if (column.render) {
            value = column.render(value, item, index);
          }
          const cell = row.getCell(colOffset);
          cell.value = value;
          if (column.isHyperlink) {
            const hyperlink = {
              text: column.textInner || value,
              hyperlink: value,
            };
            cell.value = hyperlink.text;
            cell.font = { color: { argb: "FF0000FF" }, underline: "single" };
            cell.alignment = { horizontal: "left" };
            cell.border = { left: { style: "thin" }, right: { style: "thin" } };
            row.getCell(column.key).value = hyperlink; // Set hyperlink value to original cell
          }
          colOffset++;
        }
      });
    });

    // Auto-fit column widths
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) {
          maxLength = length;
        }
      });
      column.width = maxLength + 2;
    });

    // Merge cells for parent column
    if (parentColIndex >= 0) {
      mergeCellsRecursive(
        worksheet,
        rowIndex,
        parentColIndex,
        rowOffset - 1,
        parentColIndex
      );
    }
  };

  const mergeCellsRecursive = (
    worksheet,
    rowStart,
    colStart,
    rowEnd,
    colEnd
  ) => {
    worksheet.mergeCells(rowStart, colStart, rowEnd, colEnd);
    if (rowStart < rowEnd) {
      for (let i = rowStart; i <= rowEnd; i++) {
        worksheet.getCell(i, colStart).border = { left: { style: "thin" } };
        worksheet.getCell(i, colEnd).border = { right: { style: "thin" } };
      }
    }
    if (colStart < colEnd) {
      for (let i = colStart; i <= colEnd; i++) {
        worksheet.getCell(rowStart, i).border = { top: { style: "thin" } };
        worksheet.getCell(rowEnd, i).border = { bottom: { style: "thin" } };
      }
    }
    if (rowStart < rowEnd && colStart < colEnd) {
      worksheet.getCell(rowStart, colStart).border = {
        top: { style: "thin" },
        left: { style: "thin" },
      };
      worksheet.getCell(rowStart, colEnd).border = {
        top: { style: "thin" },
        right: { style: "thin" },
      };
      worksheet.getCell(rowEnd, colStart).border = {
        bottom: { style: "thin" },
        left: { style: "thin" },
      };
      worksheet.getCell(rowEnd, colEnd).border = {
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(worksheetName);

    renderExcelData(worksheet, columns, dataSource);

    // Save workbook
    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "download.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return <button onClick={exportToExcel}>Export to Excel</button>;
};

export default WrapperExportExcel;
