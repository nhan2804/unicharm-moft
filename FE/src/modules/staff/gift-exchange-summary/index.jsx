import React, { useMemo } from "react";
import useGetAllGiftExchangeToday from "../hooks/query/useGetAllGiftExchangeToday";
import { useParams } from "react-router";
import { useAppSelector } from "@hooks/reduxHook";
import { Card, Image, Statistic, Table } from "antd";
import dayjs from "dayjs";
import { ArrowUpOutlined } from "@ant-design/icons";
import CustomPageHeader from "@components/CustomPageHeader";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { array2Object } from "@helper/array2Obj";
const GiftExchangeSummay = () => {
  const { storeId } = useParams();
  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);
  const { data: giftExchanges } = useGetAllGiftExchangeToday(storeId, {
    checkinId: checkinId,
  });
  const { data: products } = useGetProduct();
  const prod = products?.data;
  const dataOverview = useMemo(() => {
    const obj = {};

    const mappingProduct = array2Object(prod, "_id");

    giftExchanges?.forEach((record) => {
      Object.entries(record?.dataSchemes || {})?.forEach(([idScheme, data]) => {
        Object.entries(data || {})?.forEach(([type, value]) => {
          obj[type] = obj[type] || {};
          Object.entries(value || {})?.forEach(([idProduct, quantity]) => {
            const nameProd = mappingProduct?.[idProduct]?.name;
            obj[type][nameProd] = obj[type][nameProd] || 0;
            obj[type][nameProd] += parseInt(quantity);
          });
        });
      });
    });

    return obj;
  }, [giftExchanges, prod]);

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },

    {
      title: "Tên Store",
      dataIndex: ["store", "name"],
      key: ["store", "name"],
    },
    {
      title: "Giờ tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("HH:mm:ss"),
    },
    {
      //   sortOrder: pagination?.tableSortOrder?.createdAt?.order,
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
      sorter: {
        multiple: 1,
      },
    },
    {
      title: "Ca",
      dataIndex: ["shift", "name"],
      key: ["shift", "name"],
    },
    {
      title: "Người tạo",
      dataIndex: ["owner", "fullName"],
      key: ["owner", "fullName"],
      //   render: (creatorId) => mappingUsers?.[creatorId]?.fullName,
    },
    {
      title: "Tên k.hàng",
      dataIndex: "custName",
      key: "custName",
      render: (txt) => txt,
    },
    {
      title: "SDT K.hàng",
      dataIndex: "custNumber",
      key: "custNumber",
      render: (txt) => txt,
    },
    {
      title: "Số hóa đơn",
      dataIndex: "billId",
      key: "billId",
      render: (txt) => txt,
    },
    {
      title: "Hình ảnh",
      dataIndex: "giftImage",
      key: "giftImage",
      render: (txt) => txt && <Image width={40} src={txt} alt="" />,
    },
  ];
  return (
    <div>
      <CustomPageHeader title="Đổi quà hôm nay" />
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Card title="Sản phẩm" bordered={false} className="!p-0">
          <ul className="!m-0 !p-0 !text-sm list-none">
            {Object.entries(dataOverview?.product || {})?.map(
              ([name, quantity]) => {
                return (
                  <li key={name}>
                    {name} : <span className=" text-blue-500">{quantity}</span>
                  </li>
                );
              }
            )}
          </ul>
        </Card>
        <Card title="Quà đã đổi" bordered={false}>
          <ul className="!m-0 !p-0 !text-sm list-none">
            {Object.entries(dataOverview?.gift || {})?.map(
              ([name, quantity]) => {
                return (
                  <li key={name}>
                    {name} : <span className=" text-blue-500">{quantity}</span>
                  </li>
                );
              }
            )}
          </ul>
        </Card>
      </div>
      <h3>Tổng : {giftExchanges?.length} record</h3>
      <Table
        bordered
        // loading={isLoading}
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={giftExchanges || []}
      ></Table>
    </div>
  );
};

export default GiftExchangeSummay;
