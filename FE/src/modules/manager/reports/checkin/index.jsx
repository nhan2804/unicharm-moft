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
import useManagerReport from "@modules/manager/hooks/query/useManagerReport";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import usePagination from "@hooks/usePagination";
import CustomModal from "@components/CustomModal";
import FormSale from "@modules/staff/components/FormSale";
import useUpdateReport from "@modules/staff/hooks/mutate/useUpdateReport";
import useGetCheckin from "@modules/manager/hooks/query/useGetCheckin";
import useDeleteCheckin from "@modules/manager/hooks/mutate/useDeleteCheckin";
import useGetReportImageByCheckin from "@modules/manager/hooks/query/useGetImageByCheckin";
import useGetImage from "@modules/manager/images/hooks/query/useGetImage";
import initRangeToday from "@helper/getInitRangeToday";
import filterOption from "@helper/filterOption";
import useRole from "@hooks/useRole";
import useQueryString from "@hooks/useQueryString";
import useQueryString2 from "@hooks/useQueryString2";
import { array2Group, array2Object } from "@helper/array2Obj";
import useGetShift from "@modules/staff/hooks/query/useGetShift";
import ExportPowerPoint from "../components/ExportPowerPoint";
const ExportExcelReport = lazy(() => import("../components/ExportExcel"));
const ReportCheckinPage = () => {
  const [formSearch] = Form.useForm();
  const [form] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    range: initRangeToday,
  });

  const { qsParsed } = useQueryString2();
  const type = qsParsed?.type;
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
    return data?.filter((e) => e?.owner?.type !== "SUP");
  }, [data]);
  const idsCheckin = useMemo(
    () => dataCheckins?.map((e) => e?._id),
    [dataCheckins]
  );

  const { data: imageReportMapping, isLoading: loadingImageReport } =
    useGetReportImageByCheckin(idsCheckin);

  const checkins = useMemo(() => {
    return dataCheckins?.map((e) => {
      const key = `${e?.storeId}-${dayjs(e?.createdAt).format("DD/MM/YYYY")}-${
        e?.shiftId
      }`;
      return {
        ...e,
        imageReport: imageReportMapping?.[key]?.dataImage,
      };
    });
  }, [imageReportMapping, dataCheckins]);
  const { data: image } = useGetImage();

  const extraColumn = useMemo(() => {
    return (
      image
        ?.sort((a, b) => a?.groupId?.localeCompare(b.groupId))
        ?.map((e) => {
          return {
            title: e?.name,
            dataIndex: ["imageReport", e?._id],
            key: ["imageReport", e?._id],
            excelRender: (txt) => txt,
            render: (txt) => {
              return loadingImageReport ? "⟳" : txt && <Image src={txt} />;
            },
          };
        }) || []
    );
  }, [image, loadingImageReport]);
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
  const { data: shift } = useGetShift();
  const data2PPTX = () => {
    // const mappingStore = array2Object(shift,"_id","")
    const data = checkins
      ?.map((e) => {
        return {
          ...e,
          shiftName: e?.shift?.name,
          storeName: e?.store?.name,
        };
      })
      ?.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    const group = array2Group(data, "storeName");
    const subG = Object.entries(group).reduce((all, [store, data]) => {
      const date = array2Group(data, "createdAt");
      const subG = Object.entries(date).reduce((all, [dateKey, data]) => {
        const d = array2Group(data, "shiftName");
        all[dateKey] = d;
        return all;
      }, {});

      all[store] = subG;
      return all;
    }, {});
    return subG;
  };
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
            <ExportPowerPoint
              // type="s"
              columns={columns}
              dataFn={data2PPTX}
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

export default ReportCheckinPage;
