import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateAnnoucement from "../hooks/mutate/useCreateAnnoucement";
import useCreateBulkAnnoucement from "../hooks/mutate/useCreateBulkAnnoucement";
import useUpdateAnnoucement from "../hooks/mutate/useUpdateAnnoucement";
import useDeleteAnnoucement from "../hooks/mutate/useDeleteAnnoucement";
import useDeleteBulkAnnoucement from "../hooks/mutate/useDeleteBulkAnnoucement";
import useGetAnnoucement from "../hooks/query/useGetAnnoucement";
import AnnoucementFormCreate from "../components/Form";

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

const AnnoucementHomePage = () => {
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

  const { mutate: createAnnoucementFn, isLoading: isLoadingCreate } =
    useCreateAnnoucement();
  const { data: annoucements, isLoading: loadingFetch } =
    useGetAnnoucement(query);
  const { mutate: updateAnnoucementFn, isLoading: isLoadingUpdate } =
    useUpdateAnnoucement();
  const { mutateAsync: deleteAnnoucementFn, isLoading: isLoadingDelete } =
    useDeleteAnnoucement();
  const {
    mutateAsync: deleteBulkAnnoucementFn,
    isLoading: isLoadingBulkDelete,
  } = useDeleteBulkAnnoucement();
  const { mutate: createBulkAnnoucementFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkAnnoucement();

  const onDelete = (id) => {
    return deleteAnnoucementFn(id);
  };
  const onUpdate = (values) => {
    updateAnnoucementFn(
      {
        _id: selectedRecord?._id,
        formData: {
          ...values,
          fromDate: values?.rangeDate?.[0],
          toDate: values?.rangeDate?.[1],
        },
      },
      {
        onSuccess: () => {
          refForm?.current?.close();
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createAnnoucementFn(
      {
        ...value,
        fromDate: value?.rangeDate?.[0],
        toDate: value?.rangeDate?.[1],
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
    createBulkAnnoucementFn(raw, {
      onSuccess: c,
    });
  };
  const onDeleteBulk = () => {
    return deleteBulkAnnoucementFn(selectedRowKeys, {
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
      title: "Miêu tả",
      dataIndex: "desc",
      key: "desc",
    },

    {
      title: "Từ ngày",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (t) => dayjs(t).format("DD/MM/YYYY"),
    },
    {
      title: "Đến ngày",
      dataIndex: "toDate",
      key: "toDate",
      render: (t) => dayjs(t).format("DD/MM/YYYY"),
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
      <CustomPageHeader title="Thông báo" />
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
          <ImportFileModal
            loading={isLoadingCreateBulk}
            title={`Tạo nhiều thông báo`}
            onSubmit={onCreateBulk}
          />
          <CustomModal
            width={600}
            footer={false}
            button={({ open }) => (
              <Button onClick={open} icon={<PlusOutlined />} type="primary">
                Tạo mới
              </Button>
            )}
            title={"Tạo thông báo"}
          >
            {({ close }) => (
              <AnnoucementFormCreate
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
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item name="desc">
              <Input placeholder="Nhập miêu tả" />
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

            {/* <Form.Item name="range">
              <DatePicker.RangePicker />
            </Form.Item> */}
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
        pagination={{ ...pagination, total: annoucements?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={annoucements?.data || []}
      ></Table>

      <CustomModal
        width={600}
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Sửa thông báo"}
      >
        {() => (
          <AnnoucementFormCreate
            okText="Lưu thay đổi"
            initialValues={
              selectedRecord
                ? {
                    ...selectedRecord,
                    rangeDate: [
                      dayjs(selectedRecord?.fromDate),
                      dayjs(selectedRecord?.toDate),
                    ],
                  }
                : {}
            }
            onFinish={onUpdate}
            loading={isLoadingUpdate}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default AnnoucementHomePage;
