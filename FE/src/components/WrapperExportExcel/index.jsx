import React from "react";
import ExcelJS from "exceljs";
const WrapperExportExcel = ({
  columns,
  dataSource,
  worksheetName = "Sheet1",
  fileName = "export.xlsx",
}) => {
  const renderExcelData = () => {
    // Create header row
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(worksheetName);

    const headerRow = worksheet.addRow(columns.map((c) => c.title));
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.border = { bottom: { style: "thin" } };
    });

    // Add data rows
    dataSource.forEach((item, index) => {
      const row = worksheet.addRow(
        columns.map((c) => {
          let value = item;
          const dataIndex = Array.isArray(c.dataIndex)
            ? c.dataIndex
            : [c.dataIndex];
          for (const key of dataIndex) {
            value = value[key];
          }
          return {};
          if (c.render) {
            value = c.render(value, item, index);
          }
          const cell = { value };
          if (c.isHyperlink) {
            const hyperlink = {
              text: c.textInner || value,
              hyperlink: value,
            };
            cell.value = hyperlink.text;
            cell.font = { color: { argb: "FF0000FF" }, underline: "single" };
            cell.alignment = { horizontal: "left" };
            cell.border = { left: { style: "thin" }, right: { style: "thin" } };
            row.getCell(c.key).value = hyperlink; // Set hyperlink value to original cell
          }
          // if (c.children) {
          //   mergeCellsRecursive([row], 0);
          //   row.eachCell((cell) => {
          //     cell.border = {
          //       left: { style: "thin" },
          //       right: { style: "thin" },
          //     };
          //   });
          // }
          return item;
        })
      );
      return row;
    });
    workbook?.worksheet?.columns // Auto-fit column widths
      ?.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const length = cell.value ? cell.value.toString().length : 0;
          if (length > maxLength) {
            maxLength = length;
          }
        });
        column.width = maxLength + 2;
      });
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

  const mergeCellsRecursive = (worksheet, rows, parentColIndex) => {
    if (rows.length === 0) return;
    let parentRow = rows[0];
    let childRows = [];
    let childRowIndex = 0;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (parentRow.values[parentColIndex] === row.values[parentColIndex]) {
        childRows.push(row);
        childRowIndex = i;
      } else {
        mergeCellsRecursive(childRows, parentColIndex + 1);
        worksheet.mergeCells(
          parentRow.getCell(parentColIndex),
          rows[childRowIndex].getCell(parentColIndex)
        );
        childRows = [];
        parentRow = row;
        childRowIndex = i;
      }
    }
    mergeCellsRecursive(childRows, parentColIndex + 1);
    worksheet.mergeCells(
      parentRow.getCell(parentColIndex),
      rows[childRowIndex].getCell(parentColIndex)
    );
  };

  return <button onClick={renderExcelData}>Export to Excel</button>;
};

export default WrapperExportExcel;
