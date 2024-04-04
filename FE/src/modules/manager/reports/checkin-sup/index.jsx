import CustomPageHeader from "@components/CustomPageHeader";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Popconfirm,
  Select,
  Table,
} from "antd";
import React, { lazy, useMemo, useRef, useState } from "react";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useSearchQuery from "@hooks/useSearchQuery";
import dayjs from "dayjs";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import usePagination from "@hooks/usePagination";
import useGetCheckin from "@modules/manager/hooks/query/useGetCheckin";
import useDeleteCheckin from "@modules/manager/hooks/mutate/useDeleteCheckin";
import useGetReportImageByCheckin from "@modules/manager/hooks/query/useGetImageByCheckin";
import useGetImage from "@modules/manager/images/hooks/query/useGetImage";
import initRangeToday from "@helper/getInitRangeToday";
import filterOption from "@helper/filterOption";
import useRole from "@hooks/useRole";
import useQueryString2 from "@hooks/useQueryString2";
import useGetReportImageSupByCheckin from "@modules/manager/hooks/query/useGetImageSupByCheckin";
import { imagesSup } from "@modules/staff/components/FormSupImage";
const ExportExcelReport = lazy(() => import("../components/ExportExcel"));
const ReportCheckinSupPage = () => {
  const [formSearch] = Form.useForm();
  const [form] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    range: initRangeToday,
  });

  // const { qsParsed } = useQueryString2();
  const type = "SUP";
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
  const { data, isLoading } = useGetCheckin(query);
  const dataCheckins = useMemo(() => {
    if (type) {
      return data?.filter((e) => e?.owner?.type === type);
    }
    return data;
  }, [data, type]);
  const idsCheckin = useMemo(
    () => dataCheckins?.map((e) => e?._id),
    [dataCheckins]
  );

  const { data: imageReportMapping, isLoading: loadingImageReport } =
    useGetReportImageSupByCheckin(idsCheckin);
  const checkins = useMemo(() => {
    return dataCheckins?.map((e) => {
      return {
        ...e,
        imageReport: imageReportMapping?.[e?._id]?.dataImage,
      };
    });
  }, [imageReportMapping, dataCheckins]);
  const extraColumn = useMemo(() => {
    return (
      imagesSup
        // ?.sort((a, b) => a?.groupId?.localeCompare(b.groupId))
        ?.map((e) => {
          return {
            title: e?.label,
            dataIndex: ["imageReport", e?.value],
            key: ["imageReport", e?.value],
            excelRender: (txt) => txt,
            render: (txt) => {
              return loadingImageReport ? "⟳" : txt && <Image src={txt} />;
            },
          };
        }) || []
    );
  }, [loadingImageReport]);
  const { mutate: deleteCheckin } = useDeleteCheckin();
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
      // render: (store) => store?.code,
    },
    {
      title: "Tên Store",
      dataIndex: ["store", "name"],
      key: ["store", "name"],
      // render: (store) => store?.name,
    },
    {
      title: "Ảnh N.Viên",
      dataIndex: ["owner", "avatar"],
      key: ["owner", "avatar"],
      // noExport: true,
      excelRender: (_) => {
        return _;
      },
      render: (avatar) =>
        avatar && <Image height={40} width={40} src={avatar} />,
    },
    {
      title: "Hình checkin",
      dataIndex: "imageCheckin",
      key: "imageCheckin",
      noExport: true,
      __cellType__: "TypeGeneral",
      excelRender: (_) => {
        return _;
      },
      render: (_, record, index) => {
        return <Image height={40} width={40} src={_} />;
      },
    },
    ...extraColumn,
    {
      title: "Checkin",
      dataIndex: "location",
      key: "location",
      excelRender: (_, record) => {
        return record?.timeCheckIn
          ? dayjs(record?.timeCheckIn)?.format("HH:mm:ss")
          : "";
      },
      render: (txt, record) => {
        return (
          <div>
            <div>
              {!!record?.timeCheckIn &&
                dayjs(record?.timeCheckIn)?.format("HH:m:s")}
            </div>
            <div>
              {txt ? (
                <a
                  rel="noreferrer"
                  href={`http://maps.google.com/maps?daddr=${txt}`}
                  target="_blank"
                >
                  Bản đồ
                </a>
              ) : (
                "Không có định vị"
              )}
            </div>
          </div>
        );
      },
    },

    {
      title: "Hình checkout",
      dataIndex: "imageCheckOut",
      key: "imageCheckOut",
      noExport: true,
      excelRender: (_) => {
        return _;
      },
      render: (txt) => {
        return txt && <Image height={40} width={40} src={txt} />;
      },
    },
    {
      title: "Checkout",
      dataIndex: "location",
      key: "location",
      excelRender: (_, record) => {
        return !!record?.timeCheckOut
          ? dayjs(record?.timeCheckOut)?.format("HH:mm:ss")
          : "";
      },
      render: (txt, record) => {
        return (
          <div>
            <div>
              {!!record?.timeCheckOut &&
                dayjs(record?.timeCheckOut)?.format("HH:m:s")}
            </div>
            <div>
              {record?.locationCheckOut ? (
                <a
                  rel="noreferrer"
                  href={`http://maps.google.com/maps?daddr=${record?.locationCheckOut}`}
                  target="_blank"
                >
                  Bản đồ
                </a>
              ) : (
                "Không có định vị"
              )}
            </div>
          </div>
        );
      },
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
      dataIndex: ["owner", "fullName"],
      key: ["owner", "fullName"],
      // render: (owner) => owner?.fullName,
    },
  ].concat([
    {
      title: "H.động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          disabled={!canWrite}
          onConfirm={() => {
            deleteCheckin(record?._id);
          }}
          title="Xóa record này?, sẽ không thể hoàn tác!"
        >
          <Button
            disabled={!canWrite}
            icon={<DeleteOutlined />}
            type="primary"
            danger
          ></Button>
        </Popconfirm>
      ),
    },
  ]);

  const columnsExport = [
    {
      title: "Hình Profile",
      dataIndex: ["owner", "avatar"],
      key: ["owner", "avatar"],
    },
    {
      title: "Hình checkin",
      dataIndex: "imageCheckin",
      key: "imageCheckin",
    },
    {
      title: "Hình CheckOut",
      dataIndex: "imageCheckOut",
      key: "imageCheckOut",
    },
    ...extraColumn,
    {
      title: "Ngày làm việc",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (txt) => txt && dayjs(txt).format("DD/MM/YYYY"),
    },

    {
      title: "StartTime",
      dataIndex: ["shift", "startTime"],
      key: ["shift", "startTime"],
      render: (txt) => txt && dayjs(txt).format("HH:mm:ss"),
    },
    {
      title: "EndTime",
      dataIndex: ["shift", "endTime"],
      key: ["shift", "endTime"],
      render: (txt) => txt && dayjs(txt).format("HH:mm:ss"),
    },
    {
      title: "Thời gian checkin",
      dataIndex: "timeCheckIn",
      render: (txt) => txt && dayjs(txt).format("HH:mm:ss"),
    },
    {
      title: "Thời gian checkout",
      dataIndex: "timeCheckOut",
      render: (txt) => txt && dayjs(txt).format("HH:mm:ss"),
    },

    {
      title: "Ca làm việc",
      dataIndex: ["shift", "name"],
      key: "shift",
    },

    {
      title: "Code nhân Viên",
      dataIndex: ["owner", "username"],
      key: ["owner", "username"],
    },
    {
      title: "Họ & Tên Nhân Viên",
      dataIndex: ["owner", "fullName"],
      key: ["owner", "fullName"],
    },
    {
      title: "Thời gian checkin",
      dataIndex: "timeCheckIn",
      render: (txt) => txt && dayjs(txt).format("HH:mm:ss"),
    },
    {
      title: "Địa chỉ làm việc",
      dataIndex: ["store", "name"],
      key: ["store", "name"],
    },
    {
      title: "Địa chỉ cửa hàng",
      dataIndex: ["store", "address"],
      key: ["store", "address"],
    },
    {
      title: "Ngày training",
      dataIndex: ["owner", "dateTraining"],
      key: ["owner", "dateTraining"],
      render: (txt) => txt && dayjs(txt).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày Bắt đầu làm việc",
      dataIndex: ["owner", "dateToWork"],
      key: ["owner", "dateToWork"],
      render: (txt) => txt && dayjs(txt).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày Pass Học Việc",
      dataIndex: ["owner", "datePassWork"],
      key: ["owner", "datePassWork"],
      render: (txt) => txt && dayjs(txt).format("DD/MM/YYYY"),
    },
  ];

  return (
    <div>
      <CustomPageHeader title="Report checkin" />
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
              type="report-checkin"
              columns={columnsExport}
              dataSource={checkins}
            />
          </div>
        </Form>
        {/* <ExportExcelReport
          type="report-checkin"
          columns={columns}
          dataSource={checkins}
        /> */}
      </div>
      <Table
        tableLayout="auto"
        onChange={pagination.onChangeTable}
        loading={isLoading}
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={checkins || []}
      ></Table>
    </div>
  );
};

export default ReportCheckinSupPage;
