import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreatePolicy from "../hooks/mutate/useCreatePolicy";
import useCreateBulkPolicy from "../hooks/mutate/useCreateBulkPolicy";
import useUpdatePolicy from "../hooks/mutate/useUpdatePolicy";
import useDeletePolicy from "../hooks/mutate/useDeletePolicy";
import useDeleteBulkPolicy from "../hooks/mutate/useDeleteBulkPolicy";
import useGetPolicy from "../hooks/query/useGetPolicy";
import PolicyFormCreate from "../components/Form";

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
  Tabs,
} from "antd";
import CustomModal from "@components/CustomModal";
import ImportFileModal from "@components/ImportFileModal";
import { PageHeader } from "@ant-design/pro-components";
import CustomPageHeader from "@components/CustomPageHeader";

const PolicyHomePage = () => {
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
  const [type, setType] = useState("SERIOUS");
  const onChange = (key) => {
    setType(key);
  };
  const pagination = usePagination({ reset: Object.values(search) });
  const query = {
    ...search,
    page: pagination.current,
    perPage: pagination.pageSize,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    type,
    ...pagination?.sort,
  };

  const { mutate: createPolicyFn, isLoading: isLoadingCreate } =
    useCreatePolicy();
  const { data: policys, isLoading: loadingFetch } = useGetPolicy(query);
  const { mutate: updatePolicyFn, isLoading: isLoadingUpdate } =
    useUpdatePolicy();
  const { mutateAsync: deletePolicyFn, isLoading: isLoadingDelete } =
    useDeletePolicy();
  const { mutateAsync: deleteBulkPolicyFn, isLoading: isLoadingBulkDelete } =
    useDeleteBulkPolicy();
  const { mutate: createBulkPolicyFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkPolicy();

  const onDelete = (id) => {
    return deletePolicyFn(id);
  };
  const onUpdate = (values) => {
    updatePolicyFn(
      { _id: selectedRecord?._id, formData: values },
      {
        onSuccess: () => {
          refForm?.current?.close();
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createPolicyFn(
      { ...value, type },
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
    createBulkPolicyFn(raw, {
      onSuccess: c,
    });
  };
  const onDeleteBulk = () => {
    return deleteBulkPolicyFn(selectedRowKeys, {
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
            <Button danger type="primary" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelected(record);
              refForm?.current?.open();
            }}
            type="primary"
          >
            Chỉnh sửa
          </Button>
        </div>
      ),
    },
  ];
  const items = [
    {
      key: "SERIOUS",
      label: "Nghiêm trọng",
      children: "",
    },
    {
      key: "WORK",
      label: "Công việc",
      children: "",
    },
  ];

  return (
    <div>
      <CustomPageHeader title="Policy"></CustomPageHeader>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
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
            title={`Tạo nhiều policy`}
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
            title={"Tạo policy"}
          >
            {({ close }) => (
              <PolicyFormCreate
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
            {/* 
            <Form.Item name="status">
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
      </div>

      <Table
        rowSelection={rowSelection}
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        pagination={{ ...pagination, total: policys?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={policys?.data || []}
      ></Table>

      <CustomModal
        width={600}
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Sửa policy"}
      >
        {() => (
          <PolicyFormCreate
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

export default PolicyHomePage;
