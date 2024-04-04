import CustomPageHeader from "@components/CustomPageHeader";
import React from "react";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { useParams } from "react-router";
import { Button, Card, Collapse, Form, Input, Spin, message } from "antd";
import useCreateReport from "../hooks/mutate/useCreateReport";
import useGetReport from "../hooks/query/useGetReport";
import { useAppSelector } from "@hooks/reduxHook";
import { useEffect } from "react";
import FormImage from "../components/FormImage";
import FormSupImage from "../components/FormSupImage";
const ImageSupHomePage = () => {
  const { storeId } = useParams();
  const currentCheckIn = useAppSelector((s) => s?.staff?.currentCheckIn);
  const { data: currentReport, isLoading: loadingCurrent } = useGetReport(
    storeId,
    "sup",
    {
      checkinId: currentCheckIn,
    }
  );
  const [form] = Form.useForm();
  const { mutate: createReport, isLoading } = useCreateReport(storeId, "sup");
  const handleCreateReport = (values) => {
    if (Object.values(values?.dataImage || {}).length <= 0) {
      message.success("Vui lòng upload ít nhất một ảnh!");
      return;
    }
    createReport({
      ...values,
      dataImage: { ...currentReport?.dataImage, ...values?.dataImage },
      checkinId: currentCheckIn,
      currentId: currentReport?._id,
    });
  };

  useEffect(() => {
    if (currentReport) form.setFieldsValue(currentReport);
  }, [currentReport, form]);

  return (
    <div>
      <CustomPageHeader title="Hình ảnh Sup" />
      <Spin spinning={loadingCurrent}>
        <div className="">
          <FormSupImage
            onFinish={handleCreateReport}
            isLoading={isLoading}
            form={form}
          />
        </div>
      </Spin>
    </div>
  );
};

export default ImageSupHomePage;
