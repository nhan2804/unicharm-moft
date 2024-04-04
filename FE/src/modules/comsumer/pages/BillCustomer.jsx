import CustomModal from "@components/CustomModal";
import MappingStatus from "@components/MappingStatus";
import { useAppSelector } from "@hooks/reduxHook";
import useGetBill from "@modules/bill/hooks/query/useGetBill";
import { Button, Image, Table } from "antd";
import React, { useRef, useState } from "react";

import { useNavigate } from "react-router";
import useGetBillConsumer from "../hooks/query/useGetBillConsumer";

const BillConsumer = () => {
  const ref = useRef();

  const { data: bill, isLoading } = useGetBillConsumer();

  const [selected, setSelected] = useState();
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, __, index) => (
        <div>
          <MappingStatus text={_} />
          {_ === "DENY" ? `MDT:${__?.fromCode}` : ""}
        </div>
      ),
    },
    {
      title: "Ảnh hóa đơn",
      dataIndex: "bill",
      key: "bill",
      render: (text, record) => <Image width={50} src={text} />,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-x-1">
          {record?.status === "DENY" && (
            <Button
              onClick={() => {
                setSelected(record);
                ref?.current?.open?.();
              }}
              type="primary"
            >
              Xem lý do
            </Button>
          )}
        </div>
      ),
    },
  ];
  const nav = useNavigate();
  return (
    <>
      <CustomModal
        onOk={() =>
          selected?.fromCode
            ? nav("/consumer/create-bill?code=" + selected?.fromCode)
            : alert("Data đã cũ, vui lòng thử hóa đơn khác")
        }
        cancelText="Đóng"
        textOk={"Tải lại hóa đơn"}
        // footer={false}
        ref={ref}
        title={"Lý do từ chối"}
        noButton
      >
        {() => <div className="">{selected?.reason}</div>}
      </CustomModal>
      {/* <PageHeader title="Lịch sử tham gia" onBack={() => nav(-1)} /> */}
      <Table
        rowKey={"_id"}
        loading={isLoading}
        columns={columns}
        dataSource={bill}
      />
    </>
  );
};

export default BillConsumer;
