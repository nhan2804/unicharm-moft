import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateStore from "../hooks/mutate/useCreateStore";
import useCreateBulkStore from "../hooks/mutate/useCreateBulkStore";
import useUpdateStore from "../hooks/mutate/useUpdateStore";
import useDeleteStore from "../hooks/mutate/useDeleteStore";
import useDeleteBulkStore from "../hooks/mutate/useDeleteBulkStore";
import useGetStore from "../hooks/query/useGetStore";
import StoreFormCreate from "../components/Form";

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
  message,
  QRCode,
} from "antd";
import CustomModal from "@components/CustomModal";
import ImportFileModal from "@components/ImportFileModal";
import useGetUser from "@modules/manager/users/hooks/query/useGetUser";
import CustomPageHeader from "@components/CustomPageHeader";
import { array2Group, array2Object } from "@helper/array2Obj";
import ExportExcelReport from "@modules/manager/reports/components/ExportExcel";
export const downloadQRCode = async (query) => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const qrs = document.querySelectorAll(query);
  // const arrCanvas = [];

  // for (const el of qrs) {
  //   const ca = await new Promise((resolve) => {
  //     html2canvas(el).then(function (canvas) {
  //       resolve(canvas);
  //     });
  //   });
  //   arrCanvas.push(ca);
  // }
  // console.log(arrCanvas);
  console.log({ qrs });
  // return;
  for (const el of qrs) {
    const canvas = el.querySelector("canvas");
    if (canvas) {
      // const newCanvas = createCanvasWithTitle(el?.getAttribute("name"), canvas);
      // el.appendChild(canvas);
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.download = `${el?.getAttribute("name")}-QRCode.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      await delay(1000);
    }
  }
};
const StoreHomePage = () => {
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

  const { mutate: createStoreFn, isLoading: isLoadingCreate } =
    useCreateStore();
  const { data: stores, isLoading: loadingFetch } = useGetStore(query);

  const {
    mutate: updateStoreFn,
    mutateAsync: updateStoreAsync,
    isLoading: isLoadingUpdate,
  } = useUpdateStore();
  const { mutateAsync: deleteStoreFn, isLoading: isLoadingDelete } =
    useDeleteStore();
  const { mutateAsync: deleteBulkStoreFn, isLoading: isLoadingBulkDelete } =
    useDeleteBulkStore();
  const { mutate: createBulkStoreFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkStore();

  const onDelete = (id) => {
    return deleteStoreFn(id);
  };
  const onUpdate = (values) => {
    updateStoreFn(
      { _id: selectedRecord?._id, formData: values },
      {
        onSuccess: () => {
          refForm?.current?.close();
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createStoreFn(value, {
      onSuccess: c,
    });
  };

  const onCreateBulk = (data, c) => {
    const raw = data
      ?.map((e) => ({
        name: e?.[0]?.trim(),
        region: e?.[1]?.trim(),
        code: e?.[2]?.trim(),
        house_num: e?.[3]?.trim(),
        address: e?.[4]?.trim(),
        ward: e?.[5]?.trim(),
        district: e?.[6]?.trim(),
        province: e?.[7]?.trim(),
        type: e?.[8]?.trim(),
        saleRep: e?.[9]?.trim(),
        saleSup: e?.[10]?.trim(),
        kam: e?.[11]?.trim(),
      }))
      .filter((e) => {
        return !!e?.name && !e?.name?.includes("Ten dia diem");
      });
    // console.log({ raw });
    createBulkStoreFn(raw, {
      onSuccess: c,
    });
  };

  const onInsertUserIntoStore = async (data, c) => {
    console.log({ data });
    const mappingStore = array2Object(stores?.data, "code", "_id");
    const mappingUser = array2Object(users, "username", "_id");
    console.log({ mappingStore, mappingUser });
    const raw = data
      ?.map((e) => ({
        storeCode: mappingStore?.[e?.[0]?.trim()],
        userCode: mappingUser?.[e?.[1]?.trim()],
      }))
      .filter((e) => {
        return (
          !!e?.storeCode &&
          !!e?.userCode &&
          !e?.storeCode?.includes("StoreCode")
        );
      });
    const rs = array2Group(raw, "storeCode");
    const a = Object.entries(rs).map(([storeId, data]) => {
      return {
        _id: storeId,
        userIds: data?.map((e) => e?.userCode),
      };
    });
    for (const store of a) {
      await updateStoreAsync({
        _id: store?._id,
        formData: { userIds: store?.userIds },
      });
      message.success("Update success!");
    }
    console.log({ a });
    return;
    //

    // createBulkStoreFn(raw, {
    //   onSuccess: c,
    // });
  };
  const onDeleteBulk = () => {
    return deleteBulkStoreFn(selectedRowKeys, {
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
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Account",
      dataIndex: "type",
      key: "type",
    },

    {
      title: "Khu vực",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Số nhà",
      dataIndex: "house_num",
      key: "house_num",
    },
    {
      title: "Đường",
      dataIndex: "street",
      key: "street",
    },
    {
      title: "Huyện",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Tỉnh",
      dataIndex: "province",
      key: "province",
    },
    {
      title: "Miêu tả",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Sale rep",
      dataIndex: "saleRep",
      key: "saleRep",
    },
    {
      title: "Sale sup",
      dataIndex: "saleSup",
      key: "saleSup",
    },
    {
      title: "KAM",
      dataIndex: "kam",
      key: "kam",
    },
    {
      sortOrder: pagination?.tableSortOrder?.createdAt?.order,
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
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

  const { data: users } = useGetUser();
  return (
    <div>
      <CustomPageHeader title="Cửa hàng" />
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
            link="https://drive.google.com/file/d/18U1WJ0ANphtdOa7TK1BsLKiC8kMXeKD1/view?usp=sharing"
            loading={isLoadingCreateBulk}
            title={`Tạo nhiều store`}
            onSubmit={onCreateBulk}
          />

          {/* <ImportFileModal
            link="https://drive.google.com/file/d/18U1WJ0ANphtdOa7TK1BsLKiC8kMXeKD1/view?usp=sharing"
            loading={isLoadingCreateBulk}
            title={`User - Store`}
            onSubmit={onInsertUserIntoStore}
          /> */}
          <CustomModal
            width={600}
            footer={false}
            button={({ open }) => (
              <Button onClick={open} icon={<PlusOutlined />} type="primary">
                Tạo mới
              </Button>
            )}
            title={"Tạo store"}
          >
            {({ close }) => (
              <StoreFormCreate
                users={users}
                okText={"Tạo"}
                onFinish={(v) => onCreate(v, close)}
                loading={isLoadingCreate}
              />
            )}
          </CustomModal>
          <ExportExcelReport
            type="store"
            columns={columns}
            dataSource={stores?.data}
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
            <Form.Item name="name">
              <Input placeholder="Tên" />
            </Form.Item>
            <Form.Item name="region">
              <Input placeholder="Khu vực" />
            </Form.Item>
            <Form.Item name="code">
              <Input placeholder="Mã" />
            </Form.Item>
            <Form.Item name="province">
              <Input placeholder="Tỉnh" />
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
        rowSelection={rowSelection}
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        // pagination={{ ...pagination, total: stores?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={stores?.data || []}
      ></Table>

      <CustomModal
        width={600}
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Sửa store"}
      >
        {() => (
          <StoreFormCreate
            users={users}
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

export default StoreHomePage;
