import CustomPageHeader from "@components/CustomPageHeader";
import { Button, DatePicker, Form, Image, Input, Select, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { lazy, useMemo, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import useSearchQuery from "@hooks/useSearchQuery";
import dayjs from "dayjs";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import usePagination from "@hooks/usePagination";
import useGetGiftExchange from "@modules/staff/hooks/query/useGetGiftExchange";
import { array2Object } from "@helper/array2Obj";
import useGetShift from "@modules/staff/hooks/query/useGetShift";
import useGetUser from "@modules/manager/users/hooks/query/useGetUser";
import useGetFormschema from "@modules/manager/formschemas/hooks/query/useGetFormschema";
import FormGiftExchange from "@modules/staff/components/FormGiftExchange";
import CustomModal from "@components/CustomModal";
import useUpdateGiftExchange from "@modules/staff/hooks/mutate/useUpdateGiftExchange";
import initRangeToday from "@helper/getInitRangeToday";
import filterOption from "@helper/filterOption";
import useRole from "@hooks/useRole";
const ExportExcelReport = lazy(() => import("../components/ExportExcel"));
const ReportGiftExchangePage = () => {
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    range: initRangeToday,
  });

  const [form] = Form.useForm();

  const { data: products } = useGetProduct();
  const { data: stores } = useGetStore();
  const { data: shifts } = useGetShift();
  const { data: users } = useGetUser();
  const { data: schemas } = useGetFormschema();

  const mappingStores = useMemo(() => {
    return array2Object(stores?.data, "_id");
  }, [stores]);
  const mappingShifts = useMemo(() => {
    return array2Object(shifts, "_id");
  }, [shifts]);
  const mappingUsers = useMemo(() => {
    return array2Object(users, "_id");
  }, [users]);

  const { canWrite } = useRole();
  const mappingProducts = useMemo(() => {
    return array2Object(products?.data, "_id");
  }, [products]);

  const mappingSchemas = useMemo(() => {
    return array2Object(schemas, "_id");
  }, [schemas]);

  const pagination = usePagination({ reset: Object.values(search) });
  const query = {
    ...search,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    ...pagination?.sort,
  };
  const { data: giftExchanges, isLoading } = useGetGiftExchange(
    undefined,
    query
  );
  const extraColumn = useMemo(() => {
    return schemas?.map((data) => {
      return {
        title: data?.name,
        dataIndex: "dataSchemes",
        key: data?._id,
        children: [
          {
            title: "Product",
            key: "product",
            dataIndex: [data?._id, "product"],
            children: data?.product?.map((e) => {
              return {
                title: mappingProducts?.[e]?.name,
                dataIndex: ["dataSchemes", data?._id, "product", e],
                key: ["dataSchemes", data?._id, "product", e],
              };
            }),
          },
          {
            title: "Gift",
            key: "gift",
            dataIndex: [data?._id, "gift"],
            children: data?.gift?.map((e) => {
              return {
                title: mappingProducts?.[e]?.name,
                dataIndex: ["dataSchemes", data?._id, "gift", e],
                key: ["dataSchemes", data?._id, "gift", e],
              };
            }),
          },
        ],
      };
    });
  }, [schemas, mappingProducts]);

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã Store",
      dataIndex: "storeId",
      key: "storeId",
      render: (storeId, record) => mappingStores?.[storeId]?.code,
    },
    {
      title: "Tên Store",
      dataIndex: "storeId",
      key: "storeId",
      render: (storeId, record) => mappingStores?.[storeId]?.name,
    },
    {
      title: "Giờ tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("HH:mm:ss"),
    },
    {
      sortOrder: pagination?.tableSortOrder?.createdAt?.order,
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
      dataIndex: "shiftId",
      key: "shiftId",
      render: (shiftId, record) => mappingShifts?.[shiftId]?.name,
    },
    {
      title: "Người tạo",
      dataIndex: "creatorId",
      key: "creatorId",
      render: (creatorId) => mappingUsers?.[creatorId]?.fullName,
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
      title: "Bill",
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
  ]
    .concat(extraColumn || [])
    .concat([
      {
        title: "H.động",
        dataIndex: "action",
        key: "action",
        render: (_, record) => (
          <Button
            disabled={!canWrite}
            onClick={() => {
              setSelected(record);
              form.setFieldsValue(record);
              ref?.current?.open?.();
            }}
            icon={<EditOutlined />}
            type="primary"
          ></Button>
        ),
      },
    ]);
  const columnsExport = [
    {
      title: "Ngày thực hiện",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Outlet Code",
      dataIndex: ["store", "code"],
      key: ["store", "code"],
    },
    {
      title: "Store's Name",
      dataIndex: ["store", "name"],
      key: ["store", "name"],
    },
    {
      title: "Họ & Tên Nhân Viên",
      dataIndex: ["owner", "fullName"],
      key: ["owner", "fullName"],
    },
    {
      title: "Code nhân Viên",
      dataIndex: ["owner", "username"],
      key: ["owner", "username"],
    },
    {
      title: "Số nhà",
      dataIndex: ["store", "house_num"],
      key: ["store", "house_num"],
    },
    {
      title: "Đường",
      dataIndex: ["store", "street"],
      key: ["store", "street"],
    },
    {
      title: "Phường/Xã",
      dataIndex: ["store", "ward"],
      key: ["store", "ward"],
    },
    {
      title: "Quận/Huyện",
      dataIndex: ["store", "district"],
      key: ["store", "district"],
    },
    {
      title: "Tỉnh/Thành Phố",
      dataIndex: ["store", "province"],
      key: ["store", "province"],
    },
    {
      title: "Khu vực",
      dataIndex: ["store", "region"],
      key: ["store", "region"],
    },
    {
      title: "Ca làm việc",
      dataIndex: "shiftId",
      key: "shiftId",
      render: (shiftId, record) => mappingShifts?.[shiftId]?.name,
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
    },
  ].concat(extraColumn || []);

  const ref = useRef();
  const [selected, setSelected] = useState(undefined);
  const { mutate: updateGiftExchange, isLoading: loadingUpdate } =
    useUpdateGiftExchange(undefined);
  // // .concat([
  const handleEdit = (value) => {
    updateGiftExchange(
      {
        _id: selected?._id,
        formData: value,
      },
      {
        onSuccess: () => {
          ref?.current?.close?.();
          setSelected(undefined);
        },
      }
    );
  };
  // ]);
  return (
    <div>
      <CustomModal
        title={"Sửa report đổi quà"}
        onClose={() => {
          form.resetFields();
        }}
        footer={false}
        ref={ref}
        noButton
      >
        {() => (
          <FormGiftExchange
            isLoading={loadingUpdate}
            onFinish={handleEdit}
            form={form}
          />
        )}
      </CustomModal>
      <CustomPageHeader title="Report đổi quà" />
      <div className="flex justify-end mb-2">
        <Form
          onFinish={setSearch}
          form={formSearch}
          layout="inline"
          initialValues={initSearchValues}
          autoComplete="off"
        >
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 [&>*]:!m-0 !space-x-reverse form-no-margin">
            <Form.Item name="range">
              <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item name="storeId">
              <Select
                filterOption={filterOption}
                showSearch
                style={{
                  width: 200,
                }}
                allowClear
                placeholder="Cửa hàng"
              >
                {stores?.data?.map((e) => {
                  return (
                    <Select.Option value={e?._id}>{e?.name}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                // disabled={isLoading}
                icon={<SearchOutlined />}
                type="primary"
                htmlType="submit"
              >
                Tìm
              </Button>
            </Form.Item>
          </div>
        </Form>
        <ExportExcelReport
          headerRows={[1, 2, 3]}
          type="report-gift-exchange"
          columns={columnsExport}
          dataSource={giftExchanges?.data || []}
        />
      </div>
      <Table
        bordered
        onChange={pagination.onChangeTable}
        // loading={isLoading}
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={giftExchanges?.data || []}
      ></Table>
    </div>
  );
};

export default ReportGiftExchangePage;
