import CustomPageHeader from "@components/CustomPageHeader";
import { Button, DatePicker, Form, Image, Input, Select, Table } from "antd";
import React, { lazy, useMemo, useRef, useState } from "react";
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
import CustomModal from "@components/CustomModal";
import FormSale from "@modules/staff/components/FormSale";
import useUpdateReport from "@modules/staff/hooks/mutate/useUpdateReport";
import initRangeToday from "@helper/getInitRangeToday";
import filterOption from "@helper/filterOption";
import useRole from "@hooks/useRole";

const ExportExcelReport = lazy(() => import("../components/ExportExcel"));
const ReportSalePage = () => {
  const [formSearch] = Form.useForm();
  const [form] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    range: initRangeToday,
  });

  if (!initSearchValues?.range) {
    initSearchValues.range = [dayjs(), dayjs()];
  }

  const { data: products } = useGetProduct({ isSale: true });
  const { data: stores } = useGetStore();

  const { canWrite } = useRole();
  const pagination = usePagination({ reset: Object.values(search) });
  const query = {
    ...search,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    ...pagination?.sort,
  };

  const { data: sales, isLoading } = useManagerReport("sale", query);
  const extraColumn = useMemo(() => {
    return (
      products?.data?.map((e) => {
        return {
          title: e?.name,
          dataIndex: ["data", e?._id],
          key: e?._id,
        };
      }) || []
    );
  }, [products]);
  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Khu vực",
      dataIndex: ["store", "region"],
      key: ["store", "region"],
    },
    {
      title: "Tỉnh",
      dataIndex: ["store", "province"],
      key: ["store", "province"],
    },
    {
      title: "Account",
      dataIndex: ["store", "type"],
      key: ["store", "type"],
    },
    {
      title: "Outlet Name",
      dataIndex: ["store", "name"],
      key: ["store", "name"],
    },
    {
      title: "Sale rep",
      dataIndex: ["store", "saleRep"],
      key: ["store", "saleRep"],
    },
    {
      title: "Sale sup",
      dataIndex: ["store", "saleSup"],
      key: ["store", "saleSup"],
    },
    {
      title: "KAM",
      dataIndex: ["store", "kam"],
      key: ["store", "kam"],
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      noExcel: true,
      render: (text) => dayjs(text).format("HH:mm:ss"),
    },
    {
      sortOrder: pagination?.tableSortOrder?.createdAt?.order,
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
      sorter: {
        multiple: 1,
      },
    },
    {
      // noExcel: true,
      title: "Ca",
      dataIndex: ["shift", "name"],
      key: "shift",
    },
    {
      title: "SP",
      dataIndex: ["creator", "fullName"],
      key: ["creator", "fullName"],
      children: [
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
      ],
    },
  ]
    .concat(extraColumn)

    .concat([
      {
        title: "Hình data bán hàng",
        dataIndex: "image1",
        key: "image1",
        excelRender: (t) => t,
        render: (txt) => txt && <Image width={40} src={txt} alt="" />,
      },
    ])
    .concat([
      {
        title: "H.động",
        dataIndex: "action",
        key: "action",
        render: (_, record) => (
          <Button
            onClick={() => {
              setSelected(record);
              form.setFieldsValue(record?.data);
              ref?.current?.open?.();
            }}
            disabled={!canWrite}
            icon={<EditOutlined />}
            type="primary"
          ></Button>
        ),
      },
    ]);

  const ref = useRef();
  const [selected, setSelected] = useState(undefined);
  const { mutate: updateReport, isLoading: loadingUpdate } = useUpdateReport(
    undefined,
    "sale"
  );
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
  return (
    <div>
      <CustomModal
        title={"Sửa report số bán"}
        onClose={() => {
          form.resetFields();
        }}
        footer={false}
        ref={ref}
        noButton
      >
        {() => (
          <FormSale
            isLoading={loadingUpdate}
            onFinish={handleEdit}
            form={form}
          />
        )}
      </CustomModal>
      <CustomPageHeader title="Report số bán" />
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
          type="report-sale"
          columns={columns}
          dataSource={sales}
        />
      </div>
      <Table
        onChange={pagination.onChangeTable}
        loading={isLoading}
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={sales || []}
      ></Table>
    </div>
  );
};

export default ReportSalePage;
