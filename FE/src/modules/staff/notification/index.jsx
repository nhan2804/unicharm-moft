import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  IssuesCloseOutlined,
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
  message,
} from "antd";
import CustomModal from "@components/CustomModal";
import ImportFileModal from "@components/ImportFileModal";
import CustomPageHeader from "@components/CustomPageHeader";
import useCreateNotification from "@modules/manager/notifications/hooks/mutate/useCreateNotification";
import useGetNotification from "@modules/manager/notifications/hooks/query/useGetNotification";
import useUpdateNotification from "@modules/manager/notifications/hooks/mutate/useUpdateNotification";
import useDeleteNotification from "@modules/manager/notifications/hooks/mutate/useDeleteNotification";
import useDeleteBulkNotification from "@modules/manager/notifications/hooks/mutate/useDeleteBulkNotification";
import useCreateBulkNotification from "@modules/manager/notifications/hooks/mutate/useCreateBulkNotification";
import NotificationFormCreate from "@modules/manager/notifications/components/Form";
import { useAppSelector } from "@hooks/reduxHook";

const NotificationHomeStaff = () => {
  const { storeId } = useParams();
  const currentCheckIn = useAppSelector((s) => s?.staff?.currentCheckIn);
  const {} = useParams();
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery();

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
    only: true,
    page: pagination.current,
    perPage: pagination.pageSize,
    storeId,
    checkinId: currentCheckIn,
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
  const onUpdateInline = (_id, values) => {
    updateNotificationFn(
      { _id, formData: values },
      {
        onSuccess: () => {
          refForm?.current?.close();
          message.success("Kết thúc thông báo khẩn thành công!");
        },
      }
    );
  };

  const onCreate = (value, c) => {
    createNotificationFn(
      {
        ...value,
        storeId,
        checkinId: currentCheckIn,
        // fromTime: value?.rangeTime?.[0],
        // toTime: value?.rangeTime?.[1],
      },
      {
        onSuccess: c,
      }
    );
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
  const refBbuttonEnd = useRef();
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
      title: "Nhân viên",
      dataIndex: ["owner", "fullName"],
      key: ["owner", "fullName"],
      render: (text) => text,
    },
    {
      title: "Từ giờ",
      dataIndex: "fromTime",
      key: "fromTime",
      render: (text) => text && dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Đến giờ",
      dataIndex: "toTime",
      key: "toTime",
      render: (text) => text && dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    // {
    //   sortOrder: pagination?.tableSortOrder?.createdAt?.order,
    //   title: "Ngày tạo",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (text) => dayjs(text).format("DD/MM/YYYY H:m:s"),
    //   sorter: {
    //     multiple: 1,
    //   },
    // },
    // {
    //   title: "Hành động",
    //   dataIndex: "action",
    //   key: "action",
    //   render: (txt, record) => (
    //     <div className="flex gap-x-1">

    //       {record?.status === "PENDING" && (
    //         <Button
    //           ref={refBbuttonEnd}
    //           disabled={isLoadingUpdate}
    //           loading={isLoadingUpdate}
    //           icon={<IssuesCloseOutlined />}
    //           onClick={() => {
    //             onUpdateInline(record?._id, { status: "DONE" });
    //           }}
    //           danger
    //           type="primary"
    //         >
    //           Kết thúc
    //         </Button>
    //       )}

    //     </div>
    //   ),
    // },
  ];
  const user = useAppSelector((s) => s?.auth?.user);
  const firstNotiPending = notifications?.find(
    (e) => e?.status === "PENDING" && e?.ownerId === user?._id
  );
  const validNoti = !!firstNotiPending;

  return (
    <div>
      <CustomPageHeader title="Thông báo khẩn" />
      <div className="flex justify-end mb-2">
        <CustomModal
          isRealModal
          width={600}
          footer={false}
          button={({ open }) => (
            <Button
              disabled={validNoti}
              onClick={open}
              icon={<PlusOutlined />}
              type="primary"
            >
              Tạo mới
            </Button>
          )}
          title={"Tạo thông báo khẩn"}
        >
          {({ close }) => (
            <NotificationFormCreate
              okText={"Tạo"}
              onFinish={(v) => onCreate(v, close)}
              loading={isLoadingCreate}
            />
          )}
        </CustomModal>
      </div>
      {/* <div className="flex justify-end">
      <div className="mb-2 flex space-x-2">
        {hasSelected &&  <Popconfirm title="Xóa các record này, sẽ không thể hoàn tác được!" onConfirm={onDeleteBulk}><Button type="primary" danger icon={<DeleteOutlined/>} >Xóa nhiều</Button></Popconfirm>}
        <ImportFileModal  loading={isLoadingCreateBulk} title={`Tạo nhiều notification`} onSubmit={onCreateBulk}/>
        <CustomModal width={600}  footer={false} button={({open})=><Button onClick={open} icon={<PlusOutlined />} type="primary">Tạo mới</Button>} title={"Tạo notification"}>
          {({close})=> <NotificationFormCreate okText={"Tạo"} onFinish={(v)=>onCreate(v,close)} loading={isLoadingCreate}/>}
        </CustomModal>
      </div>
    </div> */}
      {/* <div className="flex justify-end mb-2">
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

            <Form.Item name="status">
              <Select allowClear placeholder="Status">
                {[].map((e) => {
                  return (
                    <Select.Option value={e?.value}>{e?.label}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

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
      </div> */}

      <Table
        scroll={{ x: 400 }}
        // rowSelection={rowSelsection}
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        pagination={false}
        loading={loadingFetch}
        columns={columns}
        dataSource={notifications || []}
      ></Table>
      {validNoti && (
        <div className="text-center mt-2">
          <Button
            disabled={!validNoti}
            danger
            loading={isLoadingUpdate}
            type="primary"
            onClick={() => {
              onUpdateInline(firstNotiPending?._id, { status: "DONE" });
            }}
          >
            Kết thúc thông báo khẩn!
          </Button>
        </div>
      )}

      <CustomModal
        isRealModal
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

export default NotificationHomeStaff;
