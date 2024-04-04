import { useAppSelector } from "@hooks/reduxHook";
import { Button, Modal, Space, Table } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import MappingStatus from "@components/MappingStatus";
import useUpdateGift from "@modules/gift/hooks/mutate/useUpdateGift";
import useGetGiftConsumer from "../hooks/query/useGetGiftConsumer";
const HistoryConsumer = () => {
  const userId = useAppSelector((s) => s?.auth?.user?._id);
  const { data: gifts, isLoading } = useGetGiftConsumer();
  const { mutate: updateGift, isLoading: loadingUse } = useUpdateGift();
  const showPopup = (data) => {
    console.log({ data });
    const mapping = {
      DONE: {
        title: "Nạp tiền thành công",
        desc: "Nạp tiền thành công",
      },
      PROCESSING: {
        title: "Nạp tiền đang chờ xử lý",
        desc: "Nạp tiền đang chờ xử lý",
      },
      VOUCHER: {
        title: "Nạp tiền được chuyển thành voucher",
        desc: "Nạp tiền được chuyển thành voucher",
      },
    };
    const rs = mapping?.[data?.gift?.status];
    Modal.info({
      centered: true,
      title: rs?.title,
      content: <>{rs?.content}</>,
      closable: true,
      closeIcon: "X",
      maskClosable: true,
    });
  };
  const handleUseGift = (_id) => {
    updateGift(
      { _id, status: "DONE" },
      {
        // onSuccess: showPopup,
      }
    );
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (txt, record) => {
        if (record?.final === "goodluck")
          return `Chúc may mắn Ngày ${dayjs(record?.createdAt).format(
            "DD/MM/YYYY"
          )}`;
        return (
          <p>{`${record?.final}k Ngày ${dayjs(record?.createdAt).format(
            "DD/MM/YYYY"
          )}`}</p>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (txt, record) => {
        return record?.final !== "goodluck" && <MappingStatus text={txt} />;
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (txt, record) => {
        return (
          <Space>
            {record?.status === "UNCLAIMED" && record?.final !== "goodluck" && (
              <Button
                loading={loadingUse}
                onClick={() => {
                  handleUseGift(record?._id);
                }}
                type="primary"
              >
                Sử dụng
              </Button>
            )}
            {record?.status === "VOUCHER" && (
              <Button
                loading={loadingUse}
                onClick={() => {
                  window.location.href = record?.linkTopup;
                }}
                type="primary"
              >
                Link voucher
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
  const nav = useNavigate();

  return (
    <>
      {/* <PageHeader title="Lịch sử" onBack={() => nav(-1)} /> */}
      <Table
        rowKey={"_id"}
        loading={isLoading}
        columns={columns}
        dataSource={gifts}
      />
    </>
  );
};

export default HistoryConsumer;
