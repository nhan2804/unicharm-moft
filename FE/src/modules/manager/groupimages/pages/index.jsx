import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateGroupimage from "../hooks/mutate/useCreateGroupimage";
import useCreateBulkGroupimage from "../hooks/mutate/useCreateBulkGroupimage";
import useUpdateGroupimage from "../hooks/mutate/useUpdateGroupimage";
import useDeleteGroupimage from "../hooks/mutate/useDeleteGroupimage";
import useDeleteBulkGroupimage from "../hooks/mutate/useDeleteBulkGroupimage";
import useGetGroupimage from "../hooks/query/useGetGroupimage";
import GroupimageFormCreate from "../components/Form";

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
} from "antd";
import CustomModal from "@components/CustomModal";
import ImportFileModal from "@components/ImportFileModal";
import CustomPageHeader from "@components/CustomPageHeader";

const GroupimageHomePage = () => {
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
    page: pagination.current,
    perPage: pagination.pageSize,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    ...pagination?.sort,
  };

  const { mutate: createGroupimageFn, isLoading: isLoadingCreate } =
    useCreateGroupimage();
  const { data: groupimages, isLoading: loadingFetch } =
    useGetGroupimage(query);
  const { mutate: updateGroupimageFn, isLoading: isLoadingUpdate } =
    useUpdateGroupimage();
  const { mutateAsync: deleteGroupimageFn, isLoading: isLoadingDelete } =
    useDeleteGroupimage();
  const {
    mutateAsync: deleteBulkGroupimageFn,
    isLoading: isLoadingBulkDelete,
  } = useDeleteBulkGroupimage();
  const { mutate: createBulkGroupimageFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkGroupimage();

  const onDelete = (id) => {
    return deleteGroupimageFn(id);
  };
  const onUpdate = (values) => {
    updateGroupimageFn(
      { _id: selectedRecord?._id, formData: values },
      {
        onSuccess: () => {
          refForm?.current?.close();
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createGroupimageFn(value, {
      onSuccess: c,
    });
  };

  const onCreateBulk = (data, c) => {
    const raw = data?.map((e) => ({
      name: e?.[0]?.trim(),
    }));
    // console.log({ raw });
    createBulkGroupimageFn(raw, {
      onSuccess: c,
    });
  };
  const onDeleteBulk = () => {
    return deleteBulkGroupimageFn(selectedRowKeys, {
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
      title: "Loại",
      dataIndex: "type",
      key: "type",
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
          <Popconfirm
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
            <Button danger type="primary" icon={<DeleteOutlined />}></Button>
          </Popconfirm>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelected(record);
              refForm?.current?.open();
            }}
            type="primary"
          ></Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <CustomPageHeader title="Group" />
      <div className="flex justify-end">
        <div className="mb-2 flex space-x-2">
          {hasSelected && (
            <Popconfirm
              title="Xóa các record này, sẽ không thể hoàn tác được!"
              onConfirm={onDeleteBulk}
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Xóa nhiều
              </Button>
            </Popconfirm>
          )}
          {/* <ImportFileModal
            loading={isLoadingCreateBulk}
            title={`Tạo nhiều groupimage`}
            onSubmit={onCreateBulk}
          /> */}
          <CustomModal
            width={600}
            footer={false}
            button={({ open }) => (
              <Button onClick={open} icon={<PlusOutlined />} type="primary">
                Tạo mới
              </Button>
            )}
            title={"Tạo"}
          >
            {({ close }) => (
              <GroupimageFormCreate
                okText={"Tạo"}
                onFinish={(v) => onCreate(v, close)}
                loading={isLoadingCreate}
              />
            )}
          </CustomModal>
        </div>
      </div>
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
      </div>

      <Table
        rowSelection={rowSelection}
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        // pagination={{ ...pagination, total: groupimages?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={groupimages || []}
      ></Table>

      <CustomModal
        width={600}
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Sửa"}
      >
        {() => (
          <GroupimageFormCreate
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

export default GroupimageHomePage;
