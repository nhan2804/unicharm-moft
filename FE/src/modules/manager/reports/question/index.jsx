import CustomPageHeader from "@components/CustomPageHeader";
import { Button, DatePicker, Form, Select, Table } from "antd";
import React, { lazy, useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";
import useSearchQuery from "@hooks/useSearchQuery";
import dayjs from "dayjs";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import usePagination from "@hooks/usePagination";
import { array2Object } from "@helper/array2Obj";
import initRangeToday from "@helper/getInitRangeToday";
import filterOption from "@helper/filterOption";
import useRole from "@hooks/useRole";
import useGetQuestion from "@modules/manager/questions/hooks/query/useGetQuestion";
import useGetQuestionSubmit from "@modules/manager/hooks/query/useGetQuestionSubmit";
const ExportExcelReport = lazy(() => import("../components/ExportExcel"));
const ReportQuestion = () => {
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    range: initRangeToday,
  });

  const [form] = Form.useForm();
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
  const { data: dataRatings, isLoading } = useGetQuestionSubmit(query);
  const { data: questions } = useGetQuestion({
    typeQuestion: "WORK",
    status: "ACTIVE",
  });

  const ratings = useMemo(() => {
    const mappingQuestion = array2Object(questions, "_id");

    return dataRatings?.map((e) => {
      const total = Object.entries(e?.data || {}).reduce(
        (all, [idQues, value]) => {
          const question = mappingQuestion?.[idQues];
          const option = array2Object(question?.option, "value");
          const label = option?.[value]?.label || value || "";
          all[idQues] = label;
          return all;
        },
        {}
      );

      return {
        ...e,
        data: total,
      };
    });
  }, [dataRatings, questions]);
  const extraColumn = useMemo(() => {
    return (
      questions?.map((data) => {
        return {
          title: data?.name,
          dataIndex: ["data", data?._id],
          key: ["data", data?._id],
          width: 200,
        };
      }) || []
    );
  }, [questions]);
  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Nhân viên",

      dataIndex: ["owner", "fullName"],
      key: ["owner", "fullName"],
    },
    {
      title: "Mã Nhân viên",

      dataIndex: ["owner", "username"],
      key: ["owner", "username"],
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
  ].concat(extraColumn);
  //   const columnsExport = [
  //     {
  //       title: "Hình ảnh nhân viên được đánh giá",
  //       dataIndex: "image",
  //       key: "image",
  //     },
  //     {
  //       sortOrder: pagination?.tableSortOrder?.createdAt?.order,
  //       title: "Ngày đánh giá",
  //       dataIndex: "createdAt",
  //       key: "createdAt",
  //       render: (text) => dayjs(text).format("DD/MM/YYYY"),
  //       sorter: {
  //         multiple: 1,
  //       },
  //     },
  //     {
  //       title: "Thời gian đánh giá",
  //       dataIndex: "createdAt",
  //       key: "createdAt",
  //       render: (text) => dayjs(text).format("HH:mm:ss"),
  //     },
  //     {
  //       title: "Mã nhân viên đánh giá",
  //       dataIndex: ["owner", "username"],
  //       key: ["owner", "username"],
  //     },
  //     {
  //       title: "Nhân viên đánh giá",
  //       dataIndex: ["owner", "fullName"],
  //       key: ["owner", "fullName"],
  //     },
  //     {
  //       title: "Họ tên người đánh giá",
  //       dataIndex: ["nameMarker"],
  //       key: ["nameMarker"],
  //     },
  //     {
  //       title: "Số điện thoại người đánh giá",
  //       dataIndex: ["phoneMarker"],
  //       key: ["phoneMarker"],
  //     },
  //     {
  //       title: "Đơn vị",
  //       dataIndex: ["department", "name"],
  //       key: ["department", "name"],
  //     },
  //     {
  //       title: "Mã nhân viên được đánh giá",
  //       dataIndex: ["user", "username"],
  //       key: ["user", "username"],
  //     },
  //     {
  //       title: "Nhân viên được đánh giá",
  //       dataIndex: ["user", "fullName"],
  //       key: ["user", "fullName"],
  //     },
  //     {
  //       title: "Mã cửa hàng",
  //       dataIndex: "store",
  //       key: ["store", "code"],
  //       render: (store) => store?.code,
  //     },
  //     {
  //       title: "Tên cửa hàng",
  //       dataIndex: "store",
  //       key: ["store", "name"],
  //       render: (store) => store?.name,
  //     },
  //     {
  //       title: "Địa chỉ",
  //       dataIndex: ["store", "street"],
  //       key: ["store", "street"],
  //     },
  //     {
  //       title: "Ca làm việc",
  //       dataIndex: ["shift", "name"],
  //       key: "shift",
  //     },
  //   ]
  //     .concat(extraColumn)
  //     .concat({
  //       title: "Điểm T.Bình",
  //       dataIndex: "totalPoint",
  //       key: "totalPoint",
  //     });
  // .concat([
  //   {
  //     title: "H.động",
  //     dataIndex: "action",
  //     key: "action",
  //     render: (_, record) => (
  //       <Button
  //         disabled={!canWrite}
  //         onClick={() => {
  //           setSelected(record);
  //           form.setFieldsValue(record);
  //           ref?.current?.open?.();
  //         }}
  //         icon={<EditOutlined />}
  //         type="primary"
  //       >
  //         Sửa
  //       </Button>
  //     ),
  //   },
  // ]);

  return (
    <div>
      <CustomPageHeader title="Report đánh giá" />
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
          type="report-rating"
          columns={columns}
          dataSource={ratings}
        />
      </div>
      <Table
        bordered
        onChange={pagination.onChangeTable}
        loading={isLoading}
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={ratings || []}
      ></Table>
    </div>
  );
};

export default ReportQuestion;
