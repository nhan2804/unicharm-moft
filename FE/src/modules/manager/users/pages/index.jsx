import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateUser from "../hooks/mutate/useCreateUser";
import useCreateBulkUser from "../hooks/mutate/useCreateBulkUser";
import useUpdateUser from "../hooks/mutate/useUpdateUser";
import useDeleteUser from "../hooks/mutate/useDeleteUser";
import useDeleteBulkUser from "../hooks/mutate/useDeleteBulkUser";
import useGetUser from "../hooks/query/useGetUser";
import UserFormCreate from "../components/Form";

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
  Avatar,
} from "antd";
import CustomModal from "@components/CustomModal";
import ImportFileModal from "@components/ImportFileModal";
import CustomPageHeader from "@components/CustomPageHeader";
import Paragraph from "antd/es/typography/Paragraph";
import ExportExcelReport from "@modules/manager/reports/components/ExportExcel";
import MappingTypeUser, { typeUser } from "../components/Form/MappingTypeUser";
import useRole from "@hooks/useRole";

const UserHomePage = () => {
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
  const { canWrite } = useRole();

  const { mutate: createUserFn, isLoading: isLoadingCreate } = useCreateUser();
  const { data: users, isLoading: loadingFetch } = useGetUser(query);
  const { mutate: updateUserFn, isLoading: isLoadingUpdate } = useUpdateUser();
  const { mutateAsync: deleteUserFn, isLoading: isLoadingDelete } =
    useDeleteUser();
  const { mutateAsync: deleteBulkUserFn, isLoading: isLoadingBulkDelete } =
    useDeleteBulkUser();
  const { mutate: createBulkUserFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkUser();

  const onDelete = (id) => {
    return deleteUserFn(id);
  };
  const onUpdate = (values) => {
    updateUserFn(
      { _id: selectedRecord?._id, formData: values },
      {
        onSuccess: () => {
          refForm?.current?.close();
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createUserFn(value, {
      onSuccess: c,
    });
  };

  const onCreateBulk = (data, c) => {
    const raw = data
      ?.map((e) => ({
        type: e?.[0]?.trim(),
        username: e?.[1]?.trim(),
        password: e?.[2]?.trim(),
        passwordRaw: e?.[2]?.trim(),
        fullName: e?.[3]?.trim(),
        dob: e?.[4]?.trim()
          ? dayjs(e?.[4]?.trim(), "DD/MM/YYYY").toDate()
          : undefined,
        dateTraining: e?.[5]?.trim()
          ? dayjs(e?.[5]?.trim(), "DD/MM/YYYY").toDate()
          : undefined,
        dateToWork: e?.[6]?.trim()
          ? dayjs(e?.[6]?.trim(), "DD/MM/YYYY").toDate()
          : undefined,
      }))
      .filter((e) => {
        return !!e?.username && !e?.username?.includes("Username");
      });
    // console.log({ raw });
    createBulkUserFn(raw, {
      onSuccess: c,
    });
  };
  const onDeleteBulk = () => {
    return deleteBulkUserFn(selectedRowKeys, {
      onSuccess: () => {
        setSelectedRowKeys([]);
      },
    });
  };
  const columns = [
    {
      title: "Ảnh N.Viên",
      dataIndex: "avatar",
      key: "avatar",
      render: (txt) => <Avatar src={txt} />,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Tên đăng nhập/Mã nhân viên",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "DoB",
      dataIndex: "dob",
      key: "dob",
      render: (txt) => txt && dayjs(txt).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày training",
      dataIndex: "dateTraining",
      key: "dateTraining",
      render: (txt) => txt && dayjs(txt).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày pass học việc",
      dataIndex: "datePassWork",
      key: "datePassWork",
      render: (txt) => txt && dayjs(txt).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày làm việc",
      dataIndex: "dateToWork",
      key: "dateToWork",
      render: (txt) => txt && dayjs(txt).format("DD/MM/YYYY"),
    },
    {
      title: "Mật khẩu",
      dataIndex: "passwordRaw",
      key: "passwordRaw",
      excelRender: (txt) => txt,
      render: (txt) => {
        return (
          <Paragraph
            copyable={{
              text: txt,
            }}
          >
            ***
          </Paragraph>
        );
      },
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (t) => <MappingTypeUser t={t} />,
    },
    // {
    //   sortOrder: pagination?.tableSortOrder?.createdAt?.order,
    //   title: "Ngày tạo",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
    //   sorter: {
    //     multiple: 1,
    //   },
    // },
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
      <CustomPageHeader title="Nhân viên" />
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
            link={
              "https://drive.google.com/file/d/1KqVmvCcAKcwGctL4FNRuOnNB1DsJAnE3/view?usp=sharing"
            }
            loading={isLoadingCreateBulk}
            title={`Tạo nhiều nhân viên`}
            onSubmit={onCreateBulk}
          />

          <CustomModal
            width={600}
            footer={false}
            button={({ open }) => (
              <Button
                disabled={!canWrite}
                onClick={open}
                icon={<PlusOutlined />}
                type="primary"
              >
                Tạo mới
              </Button>
            )}
            title={"Tạo nhân viên"}
          >
            {({ close }) => (
              <UserFormCreate
                okText={"Tạo"}
                onFinish={(v) => onCreate(v, close)}
                loading={isLoadingCreate}
              />
            )}
          </CustomModal>
          <ExportExcelReport type="user" columns={columns} dataSource={users} />
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
            <Form.Item name="fullName">
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item name="username">
              <Input placeholder="Tên đăng nhập /Mã NV" />
            </Form.Item>

            <Form.Item name="type">
              <Select style={{ width: 200 }} allowClear placeholder="Loại">
                {typeUser.map((e) => {
                  return (
                    <Select.Option value={e?.value}>{e?.label}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

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
        // rowSelection={rowSelection}
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        // pagination={{ ...pagination, total: users?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={users?.filter((e) => e?.type !== "SUPER_ADMIN") || []}
      ></Table>

      <CustomModal
        width={600}
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Sửa nhân viên"}
      >
        {() => (
          <UserFormCreate
            okText="Lưu thay đổi"
            initialValues={{
              ...selectedRecord,
              password: undefined,
              dob: selectedRecord?.dob ? dayjs(selectedRecord?.dob) : undefined,
              dateToWork: selectedRecord?.dateToWork
                ? dayjs(selectedRecord?.dateToWork)
                : undefined,
              datePassWork: selectedRecord?.datePassWork
                ? dayjs(selectedRecord?.datePassWork)
                : undefined,
              dateTraining: selectedRecord?.dateTraining
                ? dayjs(selectedRecord?.dateTraining)
                : undefined,
            }}
            onFinish={onUpdate}
            loading={isLoadingUpdate}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default UserHomePage;
