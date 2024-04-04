import CustomPageHeader from "@components/CustomPageHeader";
import { Card, Form, Spin } from "antd";
import { useNavigate } from "react-router";
import FormIdentifyUser from "../components/FormIdentifyUser";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHook";
import { setCurrentRatingUser } from "../slices/rating";

const IdentifyRatingUser = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const nav = useNavigate();

  // useEffect(() => {
  //   if (isIdentify) {
  //     nav("/rating/stores", { replace: true });
  //   }
  // }, [isIdentify]);

  const handleIdentify = (values) => {
    dispatch(setCurrentRatingUser(values));
    nav("/rating/stores", { replace: true });
  };
  return (
    <div className="mb-5">
      <CustomPageHeader title="Thông tin người đánh giá" />
      <Card>
        <Spin spinning={false}>
          <FormIdentifyUser
            isLoading={false}
            form={form}
            onFinish={handleIdentify}
          />
        </Spin>
      </Card>
    </div>
  );
};
export default IdentifyRatingUser;
