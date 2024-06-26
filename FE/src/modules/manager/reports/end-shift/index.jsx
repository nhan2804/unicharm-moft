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
import useUpdateReport from "@modules/staff/hooks/mutate/useUpdateReport";
import CustomModal from "@components/CustomModal";
import FormOos, { optionsKindOOS } from "@modules/staff/components/FormOos";
import { array2Object } from "@helper/array2Obj";
import initRangeToday from "@helper/getInitRangeToday";
import filterOption from "@helper/filterOption";
import useRole from "@hooks/useRole";
import FormEndShiftReport, {
  dataYesNo,
} from "@modules/staff/components/FormEndShiftReport";
const ExportExcelReport = lazy(() => import("../components/ExportExcel"));
const mappingKindOOS = array2Object(optionsKindOOS, "value");
const mappingYesNo = array2Object(dataYesNo, "value");
const ReportEndShiftPage = () => {
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    range: initRangeToday,
  });

  if (!initSearchValues?.range) {
    initSearchValues.range = [dayjs(), dayjs()];
  }
  const { canWrite } = useRole();
  const [form] = Form.useForm();
  const { data: products } = useGetProduct({ isOos: true });
  const { data: stores } = useGetStore();

  const pagination = usePagination({ reset: Object.values(search) });
  const query = {
    ...search,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    ...pagination?.sort,
  };
  const { data: endshiftreports, isLoading } = useManagerReport(
    "end-shift",
    query
  );
  const extraColumn = useMemo(() => {
    const moreData = [
      {
        title: "Số bán",
        key: "endShiftSales",
      },
      {
        title: "Sampling",
        key: "endShiftSamplings",
      },
      {
        title: "Quà tặng quay số",
        key: "endShiftGiftExternals",
      },
      {
        title: "Số bán thực tế",
        key: "endShiftSalesActual",
      },
      {
        title: "Sampling thực tế",
        key: "endShiftSamplingsActual",
      },
      {
        title: "Quà tặng quay số thực tế",
        key: "endShiftGiftExternalsActual",
      },
      // {
      //   title: "Cuối ca OOS",
      //   key: "endShiftInventoryOOS",
      // },
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
    // return (
    //   products?.data?.map((e) => {
    //     return {
    //       title: e?.name,
    //       dataIndex: ["startShiftInventoryOOS", e?._id],
    //       key: e?._id,
    //     };
    //   }) || []
    // );
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
      title: "Store Name",
      dataIndex: ["store", "name"],
      key: ["store", "name"],
    },
    // {
    //   title: "Sale rep",
    //   dataIndex: ["store", "saleRep"],
    //   key: ["store", "saleRep"],
    // },
    // {
    //   title: "Sale sup",
    //   dataIndex: ["store", "saleSup"],
    //   key: ["store", "saleSup"],
    // },
    {
      title: "KAM",
      dataIndex: ["store", "kam"],
      key: ["store", "kam"],
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
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      noExcel: true,
      render: (text) => dayjs(text).format("HH:mm:ss"),
    },
    // {
    //   title: "Nơi kiểm",
    //   dataIndex: "kind",
    //   key: "kind",
    //   render: (text) => mappingKindOOS?.[text]?.label,
    // },
    {
      title: "Code nhân viên",
      noExcel: true,
      dataIndex: ["creator", "username"],
      key: ["creator", "username"],
    },
    {
      title: "Người tạo",
      dataIndex: ["creator", "fullName"],
      noExcel: true,
      key: ["creator", "fullName"],
    },
    {
      title: "Ca",
      dataIndex: ["shift", "name"],
      // noExcel: true,
      key: "shift",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      noExcel: true,
      key: "note",
    },
    {
      title: "Hình BBNT",
      dataIndex: "imgbbnt",
      key: "imgbbnt",
      excelRender: (txt) => txt,
      render: (txt) => txt && <Image width={40} src={txt} alt="" />,
    },
    {
      title: "Tổng số khách đến Outlet",
      dataIndex: ["extra", "totalClientOutlet"],
      key: ["extra", "totalClientOutlet"],
    },
    {
      title: "Tổng Số khách tiếp cận",
      dataIndex: ["extra", "totalClientReach"],
      key: ["extra", "totalClientReach"],
    },
    {
      title: "Tổng Số khách tiếp cận nuôi chó",
      dataIndex: ["extra", "totalClientReachDog"],
      key: ["extra", "totalClientReachDog"],
    },
    {
      title: "Tổng Số khách tiếp cận nuôi mèo",
      dataIndex: ["extra", "totalClientReachCat"],
      key: ["extra", "totalClientReachCat"],
    },
    {
      title: "Đối thủ có CTKM",
      dataIndex: ["extra", "hasPromotion"],
      key: ["extra", "hasPromotion"],
      render: (x) => mappingYesNo?.[x] || "",
    },
  ]
    .concat(extraColumn)
    .concat([
      {
        title: "Code nhân viên",
        noTable: true,
        dataIndex: ["creator", "username"],
        key: ["creator", "username"],
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        noTable: true,
        key: "note",
      },
    ])
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
  const ref = useRef();
  const [selected, setSelected] = useState(undefined);
  const { mutate: updateReport, isLoading: loadingUpdate } = useUpdateReport(
    undefined,
    "end-shift"
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
        title={"Sửa report cuối ca"}
        onClose={() => {
          form.resetFields();
        }}
        footer={false}
        ref={ref}
        noButton
      >
        {() => (
          <FormEndShiftReport
            isLoading={loadingUpdate}
            onFinish={handleEdit}
            form={form}
          />
        )}
      </CustomModal>
      <CustomPageHeader title="Báo cáo cuối ca" />
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
          type="report-end-shift"
          columns={columns}
          dataSource={endshiftreports}
        />
      </div>
      <Table
        bordered
        onChange={pagination.onChangeTable}
        loading={isLoading}
        scroll={{ x: "max-content" }}
        columns={columns?.filter((e) => !e?.noTable)}
        dataSource={endshiftreports || []}
      ></Table>
    </div>
  );
};

export default ReportEndShiftPage;
