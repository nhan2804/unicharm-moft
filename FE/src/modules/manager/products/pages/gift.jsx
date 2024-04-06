import React, { useMemo, useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateProduct from "../hooks/mutate/useCreateProduct";
import useCreateBulkProduct from "../hooks/mutate/useCreateBulkProduct";
import useUpdateProduct from "../hooks/mutate/useUpdateProduct";
import useDeleteProduct from "../hooks/mutate/useDeleteProduct";
import useDeleteBulkProduct from "../hooks/mutate/useDeleteBulkProduct";
import useGetProduct, { typeOfProduct } from "../hooks/query/useGetProduct";
import ProductFormCreate from "../components/Form";

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
  Checkbox,
  message,
  Switch,
} from "antd";
import CustomModal from "@components/CustomModal";
import ImportFileModal from "@components/ImportFileModal";
import CustomPageHeader from "@components/CustomPageHeader";
import { activeList } from "@modules/manager/formschemas/pages";
import ExportExcelReport from "@modules/manager/reports/components/ExportExcel";

const GiftHomePage = () => {
  const {} = useParams();
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery({
    isActive: true,
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
  const pagination = usePagination();
  const sort = pagination?.sort;
  const query = useMemo(
    () => ({
      ...search,
      page: 1000,
      perPage: 1,

      isGiftExternal: true,
      range: undefined,

      ...sort,
    }),
    [sort, search]
  );
  const finalQuery = useMemo(() => {
    Object.keys(query).forEach((e) => {
      if (query?.[e] === "" || query?.[e] === undefined) delete query[e];
    });
    return query;
  }, [query]);

  const { mutate: createProductFn, isLoading: isLoadingCreate } =
    useCreateProduct();
  const { data: products, isLoading: loadingFetch } = useGetProduct(finalQuery);
  const { mutate: updateProductFn, isLoading: isLoadingUpdate } =
    useUpdateProduct();
  const { mutateAsync: deleteProductFn, isLoading: isLoadingDelete } =
    useDeleteProduct();
  const { mutateAsync: deleteBulkProductFn, isLoading: isLoadingBulkDelete } =
    useDeleteBulkProduct();
  const { mutate: createBulkProductFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkProduct();

  const onDelete = (id) => {
    return deleteProductFn(id);
  };
  const onUpdate = (values) => {
    updateProductFn(
      { _id: selectedRecord?._id, formData: values },
      {
        onSuccess: () => {
          refForm?.current?.close();
        },
      }
    );
  };
  const onUpdateType = (_id, form) => {
    updateProductFn(
      { _id: _id, formData: form },
      {
        onSuccess: () => {
          message.success("Cập nhật thành công");
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createProductFn(
      { ...value, isGiftExternal: true },
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
    createBulkProductFn(raw, {
      onSuccess: c,
    });
  };
  const onDeleteBulk = () => {
    return deleteBulkProductFn(selectedRowKeys, {
      onSuccess: () => {
        setSelectedRowKeys([]);
      },
    });
  };
  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
    },
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
      <CustomPageHeader title="Quà tặng" />
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
            title={`Tạo nhiều product`}
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
            title={"Tạo product"}
          >
            {({ close }) => (
              <ProductFormCreate
                showType={false}
                okText={"Tạo"}
                onFinish={(v) => onCreate(v, close)}
                loading={isLoadingCreate}
              />
            )}
          </CustomModal>
          <ExportExcelReport
            type="product"
            columns={columns}
            dataSource={products?.data}
          />
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
            <div className=" bg-white flex space-x-2 rounded px-2"></div>

            <Form.Item name="isActive">
              <Select
                style={{ width: 200 }}
                allowClear
                placeholder="Trạng thái"
              >
                {activeList.map((e) => {
                  return (
                    <Select.Option key={e?.value} value={e?.value}>
                      {e?.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="name">
              <Input placeholder="Tên SP" />
            </Form.Item>
            <Form.Item name="code">
              <Input placeholder="Mã SP" />
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
        // pagination={{ ...pagination, total: products?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={products?.data || []}
      ></Table>

      <CustomModal
        width={600}
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Sửa product"}
      >
        {() => (
          <ProductFormCreate
            showType={false}
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

export default GiftHomePage;
