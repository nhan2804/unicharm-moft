import CustomPageHeader from "@components/CustomPageHeader";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import useGetUser from "@modules/manager/users/hooks/query/useGetUser";
import { Form, Spin } from "antd";
import { useNavigate } from "react-router";
import FormRating from "./components/FormRating";
import { useEffect } from "react";
const RatingHomePage = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const handleRating = (values) => {};
  return (
    <div className="mb-5">
      <CustomPageHeader title="Đánh giá" />
      <Spin spinning={false}>
        <FormRating isLoading={false} form={form} onFinish={handleRating} />
      </Spin>
    </div>
  );
};
export default RatingHomePage;
