import CustomPageHeader from "@components/CustomPageHeader";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Select,
  Table,
  Tabs,
  Tag,
} from "antd";
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
import useGetGiftClients from "@modules/comsumer/hooks/query/useGetGiftClients";
import useGetShift from "@modules/staff/hooks/query/useGetShift";
import { array2Object } from "@helper/array2Obj";
const ExportExcelReport = lazy(() => import("../components/ExportExcel"));
const ReportGiftPage = () => {
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    range: initRangeToday,
    status: "DONE",
  });
  const mappingStatus = {
    DONE: <span className="text-green-600">Hoàn thành</span>,
    PENDING: <span className="text-orange-500"> Đang chờ</span>,
    CONFIRM: <span className="text-blue-500"> Đã duyệt</span>,
    DENY: <span className="text-red-500">Đã từ chối</span>,
  };

  const [tab, setTab] = useState("SAMPLING");
  const { canWrite } = useRole();
  const [form] = Form.useForm();

  const { data: sampling } = useGetProduct({ isSampling: true });
  const { data: giftExternal } = useGetProduct({ isGiftExternal: true });
  const { data: stores } = useGetStore();
  const { data: shifts } = useGetShift();
  const mappingShift = useMemo(() => {
    return array2Object(shifts, "_id");
  }, [shifts]);

  const pagination = usePagination({
    reset: Object.values({ ...search, tab }),
  });
  const query = {
    ...search,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    type: tab,
    page: pagination?.current,
    perPage: pagination?.pageSize,
    ...pagination?.sort,
  };
  const { data: giftClients, isLoading } = useGetGiftClients(query);
  // const sellingData = useMemo(() => {
  //   return giftClients?.data?.filter((e) => e?.type === "SELLING");
  // }, [giftClients]);
  // const samplingData = useMemo(() => {
  //   return giftClients?.data?.filter((e) => e?.type === "SAMPLING");
  // }, [giftClients]);
  // const { data: gifts, isLoading } = useManagerReport("gift", query);
  const extraColumnSampling = useMemo(() => {
    const moreData = [
      {
        title: "Quà tặng sampling",
        key: "products",
      },
    ];
    return moreData?.map((data) => {
      return {
        title: data.title,
        dataIndex: [data.key],
        key: data.key,
        children:
          sampling?.data?.map((e) => {
            return {
              title: e?.name,
              dataIndex: [data.key, e?._id],
              key: e?._id,
            };
          }) || [],
      };
    });
  }, [sampling]).concat([
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
  const extraColumnSelling = useMemo(() => {
    const moreData = [
      {
        title: "Quà tặng sampling",
        key: "products",
      },
    ];
    return moreData?.map((data) => {
      return {
        title: data.title,
        dataIndex: [data.key],
        key: data.key,
        children:
          giftExternal?.data?.map((e) => {
            return {
              title: e?.name,
              dataIndex: [data.key, e?._id],
              key: e?._id,
            };
          }) || [],
      };
    });
  }, [giftExternal]).concat([
    {
      title: "H.động",
      dataIndex: "action",
      key: "action",
      // render: (_, record) => (
      //   <Button
      //     onClick={() => {
      //       setSelected(record);
      //       form.setFieldsValue(record);
      //       ref?.current?.open?.();
      //     }}
      //     icon={<EditOutlined />}
      //     type="primary"
      //     disabled={!canWrite}
      //   ></Button>
      // ),
    },
  ]);
  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
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
      sortOrder: pagination?.tableSortOrder?.createdAt?.order,
      title: "Ngày nhận",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
      sorter: {
        multiple: 1,
      },
    },
    {
      title: "Giờ nhận",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("HH:mm:ss"),
    },
    {
      title: "Ca làm việc",
      dataIndex: "shiftId",
      key: "shiftId",
      render: (text) => mappingShift?.[text]?.name,
    },
    {
      title: "SDT K.hàng",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => mappingStatus?.[text],
    },
    {
      title: "Người cập nhật ảnh",
      dataIndex: ["creator", "fullName"],
      key: ["creator", "fullName"],
    },
    {
      title: "Ảnh khách hàng",
      dataIndex: "imgClient",
      key: "imgClient",
      render: (txt, record) => (
        <div>
          {txt && <Image width={40} src={txt} alt="" />}
          {record?.image2 && <Image width={40} src={record?.image2} alt="" />}
        </div>
      ),
    },
  ];
  const columnExport = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      sortOrder: pagination?.tableSortOrder?.createdAt?.order,
      title: "Ngày nhận",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
      sorter: {
        multiple: 1,
      },
    },
    {
      title: "Giờ nhận",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("HH:mm:ss"),
    },
    {
      title: "Store Code",
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
      title: "Ca làm việc",
      dataIndex: "shiftId",
      key: "shiftId",
      render: (text) => mappingShift?.[text]?.name,
    },
    {
      title: "SDT K.hàng",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => mappingStatus?.[text],
    },
    // {
    //   title: "Thời gian Check-out",
    //   dataIndex: ["checkin", "timeCheckOut"],
    //   key: ["checkin", "timeCheckOut"],
    //   render: (text) => text && dayjs(text).format("HH:mm:ss"),
    // },
    {
      title: "Ảnh khách hàng",
      dataIndex: "imgClient",
      key: "imgClient",
      render: (txt, record) => txt,
    },
  ];
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
          <Form isLoading={loadingUpdate} onFinish={handleEdit} form={form} />
        )}
      </CustomModal>
      <CustomPageHeader title="Report quà tặng" />
      <Tabs
        onChange={setTab}
        defaultActiveKey="1"
        items={[
          {
            label: "Quà tặng Sampling",
            key: "SAMPLING",
            children: (
              <>
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
                              <Select.Option value={e?._id}>
                                {e?.name}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Form.Item name="status">
                        <Select
                          filterOption={filterOption}
                          showSearch
                          style={{
                            width: 200,
                          }}
                          // allowClear
                          placeholder="Trạng thái"
                        >
                          {Object.entries({
                            DONE: mappingStatus.DONE,
                            PENDING: mappingStatus.PENDING,
                          }).map((e) => {
                            return (
                              <Select.Option value={e?.[0]}>
                                {e?.[1]}
                              </Select.Option>
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
                    columns={columnExport?.concat(extraColumnSampling)}
                    dataSource={giftClients?.data}
                  />
                </div>
                <Table
                  pagination={{
                    ...pagination,
                    total: giftClients?.paginate?.count,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100, 200, 500],
                    //   ...restPagi,
                  }}
                  bordered
                  // onChange={pagination.onChangeTable}
                  loading={isLoading}
                  scroll={{ x: "max-content" }}
                  columns={columns?.concat(extraColumnSampling)}
                  dataSource={giftClients?.data || []}
                ></Table>
              </>
            ),
          },
          {
            label: "Quà tặng Selling",
            key: "SELLING",
            children: (
              <>
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
                              <Select.Option value={e?._id}>
                                {e?.name}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Form.Item name="status">
                        <Select
                          filterOption={filterOption}
                          showSearch
                          style={{
                            width: 200,
                          }}
                          // allowClear
                          placeholder="Trạng thái"
                        >
                          {Object.entries({ DONE: mappingStatus.DONE }).map(
                            (e) => {
                              return (
                                <Select.Option value={e?.[0]}>
                                  {e?.[1]}
                                </Select.Option>
                              );
                            }
                          )}
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
                    columns={columnExport?.concat(extraColumnSelling)}
                    dataSource={giftClients?.data}
                  />
                </div>

                <Table
                  bordered
                  pagination={{
                    ...pagination,
                    total: giftClients?.paginate?.count,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100, 200, 500],
                    //   ...restPagi,
                  }}
                  // onChange={pagination.onChangeTable}
                  loading={isLoading}
                  scroll={{ x: "max-content" }}
                  columns={columns?.concat(extraColumnSelling)}
                  dataSource={giftClients?.data || []}
                ></Table>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ReportGiftPage;
