import CustomPageHeader from "@components/CustomPageHeader";
import { Button, DatePicker, Form, Image, Input, Select, Table } from "antd";
import React, { lazy, useMemo } from "react";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useSearchQuery from "@hooks/useSearchQuery";
import dayjs from "dayjs";
import useManagerReport from "@modules/manager/hooks/query/useManagerReport";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import usePagination from "@hooks/usePagination";
import { useRef } from "react";
import { useState } from "react";
import useUpdateReport from "@modules/staff/hooks/mutate/useUpdateReport";
import CustomModal from "@components/CustomModal";
import FormGift from "@modules/staff/components/FormGift";
import initRangeToday from "@helper/getInitRangeToday";
import filterOption from "@helper/filterOption";
import useRole from "@hooks/useRole";
const ExportExcelReport = lazy(() => import("../components/ExportExcel"));
const ReportGiftPage = () => {
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    range: initRangeToday,
  });

  const { canWrite } = useRole();
  const [form] = Form.useForm();

  const { data: products } = useGetProduct({ isGift: true });
  const { data: stores } = useGetStore();

  const pagination = usePagination({ reset: Object.values(search) });
  const query = {
    ...search,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    ...pagination?.sort,
  };
  const { data: gifts, isLoading } = useManagerReport("gift", query);
  const extraColumn = useMemo(() => {
    const moreData = [
      {
        title: "Tồn đầu",
        key: "startShiftInventory",
      },
      {
        title: "Nhập thêm giữa ca",
        key: "midShiftAddProduct",
      },
      {
        title: "Sử dụng",
        key: "usingGift",
      },
      {
        title: "Tồn cuối",
        key: "endShiftInventory",
      },
    ];
    return moreData?.map((data) => {
      return {
        title: data.title,
        dataIndex: [data.key],
        key: data.key,
        children:
          products?.data?.map((e) => {
            return {
              title: e?.name,
              dataIndex: [data.key, e?._id],
              key: e?._id,
            };
          }) || [],
      };
    });
  }, [products]);
  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã Store",
      dataIndex: ["store", "code"],
      key: ["store", "code"],
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
      dataIndex: ["shift", "name"],
      key: "shift",
    },
    {
      title: "Người tạo",
      dataIndex: ["creator", "fullName"],
      key: ["creator", "fullName"],
    },
    {
      title: "Hình ảnh",
      dataIndex: "image1",
      key: "image1",
      render: (txt, record) => (
        <div>
          {txt && <Image width={40} src={txt} alt="" />}
          {record?.image2 && <Image width={40} src={record?.image2} alt="" />}
        </div>
      ),
    },
  ]
    .concat(extraColumn)
    .concat([
      {
        title: "H.động",
        dataIndex: "action",
        key: "action",
        render: (_, record) => (
          <Button
            onClick={() => {
              setSelected(record);
              form.setFieldsValue(record);
              ref?.current?.open?.();
            }}
            icon={<EditOutlined />}
            type="primary"
            disabled={!canWrite}
          ></Button>
        ),
      },
    ]);
  const columnExport = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
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
      title: "SP Code",
      dataIndex: ["creator", "username"],
      key: ["creator", "username"],
    },
    {
      title: "SP Name",
      dataIndex: ["creator", "fullName"],
      key: ["creator", "fullName"],
    },
    {
      title: "Thời gian Check-in",
      dataIndex: ["checkin", "timeCheckIn"],
      key: ["checkin", "timeCheckIn"],
      render: (text) => text && dayjs(text).format("HH:mm:ss"),
    },
    {
      title: "Thời gian Check-out",
      dataIndex: ["checkin", "timeCheckOut"],
      key: ["checkin", "timeCheckOut"],
      render: (text) => text && dayjs(text).format("HH:mm:ss"),
    },
  ]
    .concat(extraColumn)
    .concat([
      {
        title: "Hình ảnh data đổi quà",
        dataIndex: "image1",
        key: "image1",
      },
      {
        title: "Hình ảnh data đổi quà 2",
        dataIndex: "image2",
        key: "image2",
      },
    ]);
  const ref = useRef();
  const [selected, setSelected] = useState(undefined);
  const { mutate: updateReport, isLoading: loadingUpdate } = useUpdateReport(
    undefined,
    "gift"
  );
  // .concat([
  const handleEdit = (value) => {
    updateReport(
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
        title={"Sửa report quà tặng"}
        onClose={() => {
          form.resetFields();
        }}
        footer={false}
        ref={ref}
        noButton
      >
        {() => (
          <FormGift
            isLoading={loadingUpdate}
            onFinish={handleEdit}
            form={form}
          />
        )}
      </CustomModal>
      <CustomPageHeader title="Report quà tặng" />
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
                {stores?.data.map((e) => {
                  return (
                    <Select.Option value={e?._id}>{e?.name}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                disabled={isLoading}
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
          headerRows={[1, 2]}
          type="report-gift"
          columns={columnExport}
          dataSource={gifts}
        />
      </div>
      <Table
        bordered
        onChange={pagination.onChangeTable}
        loading={isLoading}
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={gifts || []}
      ></Table>
    </div>
  );
};

export default ReportGiftPage;
