import CustomPageHeader from "@components/CustomPageHeader";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Card, Collapse, Form, Input, Space, Spin } from "antd";
import useGetReport from "../hooks/query/useGetReport";
import { useEffect } from "react";
import { useAppSelector } from "@hooks/reduxHook";
const GiftHomePage = () => {
  const { storeId } = useParams();
  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);

  const { data: currentReport, isLoading: loadingCurrent } = useGetReport(
    storeId,
    "gift",
    { checkinId }
  );
  const [form] = Form.useForm();
  useEffect(() => {
    if (currentReport) form.setFieldsValue(currentReport);
  }, [currentReport, form]);
  const nav = useNavigate();

  return (
    <div>
      <CustomPageHeader title="Quà tặng" />
      <Spin spinning={loadingCurrent}>
        {/* <FormGift
          onFinish={handleCreateReport}
          form={form}
          isLoading={isLoading}
        /> */}
        <div className="flex flex-col h-[300px] items-center justify-center gap-2">
          <Button
            onClick={() =>
              nav(`/staff/stores/${storeId}/gift-otp?type=sampling`, { relative: false })
            }
            className="w-[90%] font-bold text-xl h-[50px]"
          >
            SAMPLING
          </Button>
          <Button
            onClick={() =>
              nav(`/staff/stores/${storeId}/gift-otp?type=selling`, { relative: false })
            }
            className="w-[90%] font-bold text-xl h-[50px]"
          >
            SELLING
          </Button>
        </div>
      </Spin>
    </div>
  );
};

export default GiftHomePage;
