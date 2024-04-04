import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateNotification from "../hooks/mutate/useCreateNotification";
import useCreateBulkNotification from "../hooks/mutate/useCreateBulkNotification";
import useUpdateNotification from "../hooks/mutate/useUpdateNotification";
import useDeleteNotification from "../hooks/mutate/useDeleteNotification";
import useDeleteBulkNotification from "../hooks/mutate/useDeleteBulkNotification";
import useGetNotification from "../hooks/query/useGetNotification";
import NotificationFormCreate from "../components/Form";

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import usePagination from "@hooks/usePagination";
import useSearchQuery from "@hooks/useSearchQuery";
import { useParams } from "react-router";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  DatePicker,
  Tag,
} from "antd";
import CustomModal from "@components/CustomModal";
import ImportFileModal from "@components/ImportFileModal";
import CustomPageHeader from "@components/CustomPageHeader";
import ExportExcelReport from "@modules/manager/reports/components/ExportExcel";
import initRangeToday from "@helper/getInitRangeToday";
import filterOption from "@helper/filterOption";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
const mappingStatus = {
  PENDING: {
    color: "yellow",
    label: "Hoạt động",
  },
  DONE: {
    color: "green",
    label: "Kết thúc",
  },
};
const NotificationHomePage = () => {
  const {} = useParams();
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    range: initRangeToday,
  });

  const [selectedRecord, setSelected] = useState();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const refForm = useRef();
  const pagination = usePagination({ reset: Object.values(search) });
  const query = {
    ...search,
    page: pagination.current,
    perPage: pagination.pageSize,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    ...pagination?.sort,
  };

  const { mutate: createNotificationFn, isLoading: isLoadingCreate } =
    useCreateNotification();
  const { data: notifications, isLoading: loadingFetch } =
    useGetNotification(query);
  const { mutate: updateNotificationFn, isLoading: isLoadingUpdate } =
    useUpdateNotification();
  const { mutateAsync: deleteNotificationFn, isLoading: isLoadingDelete } =
    useDeleteNotification();
  const {
    mutateAsync: deleteBulkNotificationFn,
    isLoading: isLoadingBulkDelete,
  } = useDeleteBulkNotification();
  const { mutate: createBulkNotificationFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkNotification();

  const onDelete = (id) => {
    return deleteNotificationFn(id);
  };
  const onUpdate = (values) => {
    updateNotificationFn(
      { _id: selectedRecord?._id, formData: values },
      {
        onSuccess: () => {
          refForm?.current?.close();
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createNotificationFn(value, {
      onSuccess: c,
    });
  };

  const onCreateBulk = (data, c) => {
    const raw = data?.map((e) => ({
      name: e?.[0]?.trim(),
    }));
    // console.log({ raw });
    createBulkNotificationFn(raw, {
      onSuccess: c,
    });
  };
  const onDeleteBulk = () => {
    return deleteBulkNotificationFn(selectedRowKeys, {
      onSuccess: () => {
        setSelectedRowKeys([]);
      },
    });
  };
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Store",
      dataIndex: ["store", "name"],
      key: ["store", "name"],
    },
    {
      title: "Người tạo",
      dataIndex: ["owner", "fullName"],
      key: "fullName",
    },
    {
      title: "Từ giờ",
      dataIndex: "fromTime",
      key: "fromTime",
      render: (text) => text && dayjs(text).format("HH:mm:ss"),
    },
    {
      title: "Đến giờ",
      dataIndex: "toTime",
      key: "toTime",
      render: (text) => text && dayjs(text).format("HH:mm:ss"),
    },
    {
      title: "Tổng thời gian",
      dataIndex: "tt",
      key: "t",
      render: (_, record) => {
        if (!record?.toTime) return "";
        const date1 = dayjs(record?.fromTime);
        const date2 = dayjs(record?.toTime);
        const diff = date2.diff(date1, "minutes");
        return diff + " phút";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={mappingStatus?.[text]?.color || "blue"}>
          {mappingStatus?.[text]?.label || "Unknownn"}
        </Tag>
      ),
    },
    {
      sortOrder: pagination?.tableSortOrder?.createdAt?.order,
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY H:m:s"),
      sorter: {
        multiple: 1,
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (txt, record) => (
        <div className="flex gap-x-1">
          {/* <Popconfirm
            placement="topLeft"
            title={
              "Bạn có chắc muốn xóa record này, điều này không thể hoàn tác?"
            }
            onConfirm={async () => {
              await onDelete(record._id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="primary" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm> */}
          {/* <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelected(record);
              refForm?.current?.open();
            }}
            type="primary"
          >
            Chỉnh sửa
          </Button> */}
        </div>
      ),
    },
  ];
  const { data: stores } = useGetStore();
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
      dataIndex: ["owner", "username"],
      key: ["owner", "username"],
    },
    {
      title: "SP Name",
      dataIndex: ["owner", "fullName"],
      key: ["owner", "fullName"],
    },
    {
      title: "Báo cáo khẩn",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "fromTime",
      key: "fromTime",
      render: (text) => text && dayjs(text).format("HH:mm:ss"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "toTime",
      key: "toTime",
      render: (text) => text && dayjs(text).format("HH:mm:ss"),
    },
    {
      title: "Tổng thời gian rời vị trí",
      dataIndex: "tt",
      key: "t",
      render: (_, record) => {
        if (!record?.toTime) return "";
        const date1 = dayjs(record?.fromTime);
        const date2 = dayjs(record?.toTime);
        const diff = date2.diff(date1, "minutes");
        return diff + " phút";
      },
    },
  ];

  //NNN check query bao cao khan nay
  return (
    <div>
      <CustomPageHeader title="Thông báo khẩn" />
      {/* <div className="flex justify-end">
      <div className="mb-2 flex space-x-2">
        {hasSelected &&  <Popconfirm title="Xóa các record này, sẽ không thể hoàn tác được!" onConfirm={onDeleteBulk}><Button type="primary" danger icon={<DeleteOutlined/>} >Xóa nhiều</Button></Popconfirm>}
        <ImportFileModal  loading={isLoadingCreateBulk} title={`Tạo nhiều notification`} onSubmit={onCreateBulk}/>
        <CustomModal width={600}  footer={false} button={({open})=><Button onClick={open} icon={<PlusOutlined />} type="primary">Tạo mới</Button>} title={"Tạo notification"}>
          {({close})=> <NotificationFormCreate okText={"Tạo"} onFinish={(v)=>onCreate(v,close)} loading={isLoadingCreate}/>}
        </CustomModal>
      </div>
    </div> */}
      <div className="flex justify-end mb-2">
        <Form
          onFinish={setSearch}
          form={formSearch}
          layout="inline"
          initialValues={initSearchValues}
          autoComplete="off"
        >
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 [&>*]:!m-0 !space-x-reverse form-no-margin">
            <Form.Item name="name">
              <Input placeholder="Tên" />
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

            {/* <Form.Item name="status">
              <Select allowClear placeholder="Status">
                {[].map((e) => {
                  return (
                    <Select.Option value={e?.value}>{e?.label}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item> */}

            <Form.Item name="range">
              <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item>
              <Button
                disabled={loadingFetch}
                icon={<SearchOutlined />}
                type="primary"
                htmlType="submit"
              >
                Tìm
              </Button>
            </Form.Item>
          </div>
        </Form>
        <ExportExcelReport columns={columnExport} dataSource={notifications} />
      </div>

      <Table
        // rowSelection={rowSelection}
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        // pagination={{ ...pagination, total: notifications?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={notifications || []}
      ></Table>

      <CustomModal
        width={600}
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Sửa notification"}
      >
        {() => (
          <NotificationFormCreate
            okText="Lưu thay đổi"
            initialValues={selectedRecord}
            onFinish={onUpdate}
            loading={isLoadingUpdate}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default NotificationHomePage;
