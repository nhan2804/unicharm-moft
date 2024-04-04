import SingleImageUpload from "@components/SingleImageUpload";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import useGetUser from "@modules/manager/users/hooks/query/useGetUser";
import { Button, Card, Collapse, Form, Input, Select, Typography } from "antd";
import React, { useMemo, useState, useEffect } from "react";

const FormRating = ({ onFinish, form, isLoading }) => {
  const { data: stores } = useGetStore();
  const { data: users } = useGetUser();
  const [selectedStore, setSelectedStore] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const storesOption = useMemo(() => {
    return stores?.map((e) => ({ value: e?._id, label: e?.name }));
  }, [stores]);
  useEffect(() => {
    const store = stores?.find((e) => e._id === selectedStore);
    const usersInStore = users?.filter((e) => store?.userIds?.includes(e._id));
    setUserOptions(usersInStore?.map(e => ({value: e?._id, label: e?.fullName })))
  }, [stores, selectedStore, users]);
  const onSelected = (value) => {
    setSelectedStore(value)
    form.resetFields(["userId"])
  }
  return (
    <div>
      <Form
        labelCol={{ flex: "200px" }}
        wrapperCol={{
          flex: 1,
        }}
        labelAlign="left"
        labelWrap={true}
        // layout="inline"
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          rules={[{ required: true, message: "Vui lòng chọn cửa hàng!" }]}
          name="storeId"
          label="Cửa hàng"
          className="my-1"
        >
          <Select
            onSelect={onSelected}
            type="text"
            options={storesOption}
          ></Select>
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
          name="userId"
          label="Nhân viên"
          className="my-1"
        >
          <Select
            type="text"
            options={userOptions || []}
          ></Select>
        </Form.Item>
        <div className="flex justify-center mt-2 w-full">
          <Button loading={isLoading} type="primary" htmlType="submit">
            Đánh giá
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormRating;
