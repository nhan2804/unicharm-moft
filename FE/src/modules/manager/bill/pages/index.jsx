import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd";
import { useRef, useState } from "react";
// import { billBaseAPI, BillClient } from "../../../clients/BillClient";
import CustomDrawer from "@components/CustomDrawer";
import { useAppSelector } from "@hooks/reduxHook";
import classNames from "classnames";
import { useNavigate } from "react-router";
import uuid from "react-uuid";
// import FormEditBill from "../components/FormEdit";
import useCreateBill from "../hooks/mutate/useCreateBill";
import useDeleteBill from "../hooks/mutate/useDeleteBill";
import useUpdateBill from "../hooks/mutate/useUpdateBill";
import useGetBill from "../hooks/query/useGetBill";

import { DeleteOutlined } from "@ant-design/icons";

const BillPage = () => {
  const user = useAppSelector((s) => s?.auth?.user);
  const nav = useNavigate();

  const refDrawerFormBill = useRef();
  const [selected, setSelected] = useState();

  const { mutate: create, isLoading: isLoadingCreate } = useCreateBill();
  const { data: bills } = useGetBill();
  const { mutate: update, isLoading: loadingUpdate } = useUpdateBill();
  const { mutate: remove, isLoading: loadingDelete } = useDeleteBill();

  const onUpdate = (value, c) => {
    update(value, {
      onSuccess: c,
    });
  };
  const onDelete = (id) => {
    remove(id);
  };
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",

      render: (text, record) => (
        <div className="flex gap-x-1">
          <Popconfirm
            placement="topLeft"
            title={"Bạn có chắc muốn xóa?"}
            onConfirm={() => {
              onDelete("DELETE", record._id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="primary" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            onClick={() => {
              setSelected(record);
              refDrawerFormBill?.current?.open();
            }}
            danger
            type="dashed"
          >
            Chỉnh sửa
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div class="p-2">
      <h1>Bill</h1>
      <div className="grid grid-cols-5 gap-2">
        <div className="flex items-center justify-center">
          <Button
            aria-hidden
            onClick={() => {
              // create({
              //   xid: uuid(),
              //   name: "_",
              //   title: "_title",
              //   description: "_description",
              // });
            }}
          >
            <PlusCircleOutlined spin={isLoadingCreate} size="large" />
            Tạo mới
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={bills} />

      <CustomDrawer
        title={selected?.title}
        // key={selectedBill?.id + selectedBill?.updatedAt}
        ref={refDrawerFormBill}
        noButton={true}
      >
        {() => (
          // <FormEditBill
          //   loadingDelete={loadingDelete}
          //   loadingUpdate={loadingUpdate}
          //   handleActions={onUpdate}
          //   source={selected}
          // />
          <></>
        )}
      </CustomDrawer>
    </div>
  );
};

export default BillPage;
