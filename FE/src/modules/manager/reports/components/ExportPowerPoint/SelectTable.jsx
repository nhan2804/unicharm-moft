import React, { useState } from "react";
import { Button, Table } from "antd";
const columns = [
  {
    title: "Store",
    dataIndex: "name",
  },
];

const SelectTable = ({ data, onChange }) => {
  const dataSource = data?.map((e) => ({ name: e, key: e }));
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    onChange(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table
        pagination={false}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource || []}
      />
    </div>
  );
};
export default SelectTable;
