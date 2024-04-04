import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateQuestion from "../hooks/mutate/useCreateQuestion";
import useCreateBulkQuestion from "../hooks/mutate/useCreateBulkQuestion";
import useUpdateQuestion from "../hooks/mutate/useUpdateQuestion";
import useDeleteQuestion from "../hooks/mutate/useDeleteQuestion";
import useDeleteBulkQuestion from "../hooks/mutate/useDeleteBulkQuestion";
import useGetQuestion from "../hooks/query/useGetQuestion";
import QuestionFormCreate, { categoryQues } from "../components/Form";

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import usePagination from "@hooks/usePagination";
import useSearchQuery from "@hooks/useSearchQuery";
import { useMatch, useParams } from "react-router";
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

import CustomPageHeader from "@components/CustomPageHeader";
import { array2Object } from "@helper/array2Obj";
import { useQueryClient } from "react-query";
export const statusQuestion = [
  {
    label: "Hoạt động",
    value: "ACTIVE",
  },
  {
    label: "Không hoạt động",
    value: "INACTIVE",
  },
];
const mappingType = {
  "question-rating": {
    value: "RATING",
    label: "Câu hỏi đánh giá",
  },
  questions: {
    value: "WORK",
    label: "Câu hỏi đầu ca",
  },
  "question-policy": {
    value: "POLICY",
    label: "Câu hỏi Policy",
  },
};
const mappingStatusQuestion = array2Object(statusQuestion, "value", "label");
const QuestionHomePage = () => {
  const match = useMatch("/manager/:page");
  const typeQuestion = mappingType?.[match?.params?.page?.trim()]?.value;

  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    status: "ACTIVE",
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

  const ref = useRef();
  const pagination = usePagination({ reset: Object.values(search) });
  const query = {
    ...search,
    page: pagination.current,
    perPage: pagination.pageSize,
    typeQuestion,
    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    ...pagination?.sort,
  };

  const { mutate: createQuestionFn, isLoading: isLoadingCreate } =
    useCreateQuestion();
  const { data: questions, isLoading: loadingFetch } = useGetQuestion(query);
  const {
    mutate: updateQuestionFn,
    mutateAsync: updateQuestionAsyncFn,
    isLoading: isLoadingUpdate,
  } = useUpdateQuestion();
  const { mutateAsync: deleteQuestionFn, isLoading: isLoadingDelete } =
    useDeleteQuestion();
  const { mutateAsync: deleteBulkQuestionFn, isLoading: isLoadingBulkDelete } =
    useDeleteBulkQuestion();
  const { mutate: createBulkQuestionFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkQuestion();

  const onDelete = (id) => {
    return deleteQuestionFn(id);
  };
  const onUpdate = (values) => {
    updateQuestionFn(
      { _id: selectedRecord?._id, formData: values },
      {
        onSuccess: () => {
          ref?.current?.close();
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createQuestionFn(
      { ...value, typeQuestion },
      {
        onSuccess: c,
      }
    );
  };

  const onDeleteBulk = () => {
    return deleteBulkQuestionFn(selectedRowKeys, {
      onSuccess: () => {
        setSelectedRowKeys([]);
      },
    });
  };
  const qc = useQueryClient();
  const onUpdateStatusBulk = async (status) => {
    // const rs = selectedRowKeys?.map(e=>{
    //   return updateQuestionAsyncFn(
    //     { _id: e, formData: { status }, noRefresh: true },
    //     {
    //       onSuccess: () => {
    //         message.success("Thay đổi thành công!");
    //       },
    //     }
    //   );
    // })
    // await Promise.all(rs)
    for (const _id of selectedRowKeys) {
      await updateQuestionAsyncFn(
        { _id: _id, formData: { status }, noRefresh: true },
        {
          // onSuccess: () => {
          //   message.success("Thay đổi thành công!");
          // },
        }
      );
    }
    message.success("Thay đổi tất cả thành công!");
    qc.invalidateQueries(["questions"]);
    setSelectedRowKeys([]);
  };

  const [form] = Form.useForm();
  const columns = [
    {
      key: "sort",
    },
    {
      key: "STT",
      title: "STT",
      dataIndex: "stt",
      render: (_, __, stt) => stt + 1 + ".",
    },
    {
      title: "Câu hỏi",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    typeQuestion !== "POLICY" && {
      title: "Bắt buộc",
      dataIndex: "required",
      key: "required",
      render: (txt) => {
        return !!txt ? "Có" : "Không";
      },
    },
    typeQuestion === "POLICY" && {
      title: "Điểm",
      dataIndex: "point",
      key: "point",
      render: (txt) => {
        return (
          <span className={txt >= 0 ? `text-blue-500` : "text-red-500"}>
            {txt}
          </span>
        );
      },
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Kiểu",
      dataIndex: "typeQuestion",
      key: "typeQuestion",
      render: (text, record) => {
        return text;
      },
    },
    typeQuestion === "WORK" && {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (text) => {
        return categoryQues?.[text] || "";
      },
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
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (_, r) => {
        return (
          <Select
            onChange={(status) => {
              updateQuestionFn(
                { _id: r?._id, formData: { status }, noRefresh: true },
                {
                  onSuccess: () => {
                    message.success("Thay đổi thành công!");
                  },
                }
              );
            }}
            defaultValue={_}
            // value={_}
            style={{ width: 200 }}
            allowClear
            placeholder="Status"
          >
            {statusQuestion.map((e) => {
              return <Select.Option value={e?.value}>{e?.label}</Select.Option>;
            })}
          </Select>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div>
          <div className="flex gap-x-1">
            <Button
              onClick={() =>
                createQuestionFn({
                  ...record,
                  _id: undefined,
                  createdAt: undefined,
                  updatedAt: undefined,
                })
              }
            >
              Clone
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={async () => {
                setSelected(record);
                form.setFieldsValue(record);
                // await new Promise((resolve) => setTimeout(resolve, 200));
                ref?.current?.open?.();
              }}
            ></Button>

            <Popconfirm
              title="Xóa record này?, Sẽ không thể hoàn tác"
              onConfirm={() => {
                onDelete(record._id);
              }}
            >
              <Button danger type="primary" icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ].filter(Boolean);

  return (
    <div>
      <CustomPageHeader
        title={mappingType?.[match?.params?.page?.trim()]?.label}
      />
      <div className="flex justify-end">
        <div className="mb-2 flex space-x-2">
          {hasSelected && (
            <>
              <Popconfirm
                title="Set hoạt động?"
                onConfirm={() => onUpdateStatusBulk("ACTIVE")}
              >
                <Button type="primary" icon={<EditOutlined />}>
                  Set hoạt động
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Set không hoạt động?"
                onConfirm={() => onUpdateStatusBulk("INACTIVE")}
              >
                <Button type="dashed" icon={<EditOutlined />}>
                  Set không hoạt động
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Xóa các record này, sẽ không thể hoàn tác được!"
                onConfirm={onDeleteBulk}
              >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  Xóa nhiều
                </Button>
              </Popconfirm>
            </>
          )}
          {/* <ImportFileModal
            loading={isLoadingCreateBulk}
            title={`Tạo nhiều question`}
            onSubmit={onCreateBulk}
          /> */}

          <CustomModal
            onClose={() => {
              form.resetFields();
              setSelected(undefined);
            }}
            ref={ref}
            width={1000}
            footer={false}
            button={({ open }) => (
              <Button
                onClick={() => {
                  open();
                  form.setFieldsValue({
                    required: true,
                    category: "PRODUCT_KNOWLEDGE",
                  });
                }}
                icon={<PlusOutlined />}
                type="primary"
              >
                Tạo mới
              </Button>
            )}
            title={!selectedRecord ? "Tạo câu hỏi" : "Sửa câu hỏi"}
          >
            {({ close }) => (
              <QuestionFormCreate
                typeQuestion={typeQuestion}
                form={form}
                okText={!selectedRecord ? "Tạo " : "Lưu thay đối"}
                onFinish={(v) => {
                  if (!selectedRecord) {
                    onCreate(v, close);
                  } else {
                    onUpdate(v, close);
                  }
                }}
                loading={isLoadingCreate || isLoadingUpdate}
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

            <Form.Item name="status">
              <Select style={{ width: 200 }} allowClear placeholder="Status">
                {statusQuestion.map((e) => {
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
      </div>

      <Table
        rowSelection={rowSelection}
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        // pagination={{ ...pagination, total: questions?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={questions?.data || questions || []}
      ></Table>
    </div>
  );
};

export default QuestionHomePage;
