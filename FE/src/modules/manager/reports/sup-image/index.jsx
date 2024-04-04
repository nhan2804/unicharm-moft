import CustomPageHeader from "@components/CustomPageHeader";
import { Button, DatePicker, Form, Image, Input, Select, Table } from "antd";
import React, { useMemo, useRef, useState } from "react";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useSearchQuery from "@hooks/useSearchQuery";
import dayjs from "dayjs";
import useManagerReport from "@modules/manager/hooks/query/useManagerReport";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import usePagination from "@hooks/usePagination";
import CustomModal from "@components/CustomModal";
import useGetImage from "@modules/manager/images/hooks/query/useGetImage";
import SingleImageUpload from "@components/SingleImageUpload";
import useUpdateReport from "@modules/staff/hooks/mutate/useUpdateReport";
import initRangeToday from "@helper/getInitRangeToday";
import FormImage from "@modules/staff/components/FormImage";
import filterOption from "@helper/filterOption";
import useRole from "@hooks/useRole";
import FormSupImage, {
  imagesSup,
} from "@modules/staff/components/FormSupImage";
import ExportExcelReport from "../components/ExportExcel";
const ReportSubImagePage = () => {
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    range: initRangeToday,
  });

  const { canWrite } = useRole();
  const { data: stores } = useGetStore();
  const pagination = usePagination({ reset: Object.values(search) });
  const query = {
    ...search,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    ...pagination?.sort,
  };
  const { data: images, isLoading } = useManagerReport("sup", query);

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Mã Store",
      dataIndex: ["store"],
      key: ["store", "code"],
      render: (store) => store?.code,
    },
    {
      title: "Tên Store",
      dataIndex: ["store"],
      key: ["store", "name"],
      render: (store) => store?.name,
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
      render: (creator) => creator,
    },

    {
      title: "Ảnh",
      dataIndex: "action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(record?.dataImage || {})?.map((e) => {
            return (
              <div>
                {" "}
                <Image
                  className="object-cover aspect-1 rounded"
                  src={e?.[1]}
                  key={e?.[1]}
                />
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button
          disabled={!canWrite}
          icon={<EditOutlined />}
          onClick={() => onRowClick(record)}
          type="primary"
        ></Button>
      ),
    },
  ];
  const columnsExport = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Mã Store",
      dataIndex: ["store", "code"],
      key: ["store", "code"],
      render: (store) => store?.code,
    },
    {
      title: "Tên Store",
      dataIndex: ["store", "name"],
      key: ["store", "name"],
      render: (store) => store?.name,
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
      key: ["shift", "name"],
    },
    {
      title: "Người tạo",
      dataIndex: ["creator", "fullName"],
      key: ["creator", "fullName"],
      render: (creator) => creator,
    },
  ].concat(
    imagesSup.map((e) => {
      return {
        title: e?.label,
        dataIndex: ["dataImage", e?.value],
        key: ["dataImage", e?.value],
        render: (creator) => creator,
      };
    })
  );
  const [form] = Form.useForm();
  const refModal = useRef();
  const onRowClick = (row) => {
    form.setFieldsValue(row);
    refModal?.current?.open();
    setSelected(row);
  };

  const [selected, setSelected] = useState(undefined);
  const { mutate: updateImage, isLoading: loadingUpdate } = useUpdateReport(
    undefined,
    "sup"
  );
  const [preview, setPreview] = useState(true);
  const onUpdate = (value) => {
    updateImage({
      _id: selected?._id,
      formData: value,
    });
    setSelected(undefined);
    setPreview(true);
    refModal?.current?.close();
  };

  return (
    <div>
      <CustomPageHeader title="Report Sup hình ảnh" />
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
            <ExportExcelReport
              headerRows={[1, 2]}
              type="report-sup-image"
              columns={columnsExport}
              dataSource={images}
            />
          </div>
        </Form>
      </div>
      <Table
        tableLayout="fixed"
        // onRow={(data) => {
        //   return {
        //     onClick: () => onRowClick(data),
        //   };
        // }}
        onChange={pagination.onChangeTable}
        loading={isLoading}
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={images || []}
      ></Table>
      <CustomModal
        // width={200}
        footer={false}
        noButton
        ref={refModal}
        title={"Xem chi tiết ảnh"}
      >
        {() => (
          <div>
            <FormSupImage
              isLoading={loadingUpdate}
              onFinish={onUpdate}
              form={form}
            />
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default ReportSubImagePage;
