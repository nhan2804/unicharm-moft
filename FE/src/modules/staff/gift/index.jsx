import CustomPageHeader from "@components/CustomPageHeader";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Spin } from "antd";

const GiftHomePage = () => {
  const { storeId } = useParams();

  const nav = useNavigate();

  return (
    <div>
      <CustomPageHeader title="Quà tặng" />
      <Spin spinning={false}>
        {/* <FormGift
          onFinish={handleCreateReport}
          form={form}
          isLoading={isLoading}
        /> */}
        <div className="flex flex-col h-[300px] items-center justify-center gap-2">
          <Button
            onClick={() =>
              nav(`/staff/stores/${storeId}/gift/sampling`, {
                relative: false,
              })
            }
            className="w-[90%] font-bold text-xl h-[50px]"
          >
            SAMPLING
          </Button>
          <Button
            onClick={() =>
              nav(`/staff/stores/${storeId}/gift/selling`, {
                relative: false,
              })
            }
            className="w-[90%] font-bold text-xl h-[50px]"
          >
            SELLING
          </Button>
          <Button
            onClick={() =>
              nav(`/staff/stores/${storeId}/gift-otp?type=selling`, {
                relative: false,
              })
            }
            className="w-[90%] font-bold text-xl h-[50px]"
          >
            SELLING OTP
          </Button>
        </div>
      </Spin>
    </div>
  );
};

export default GiftHomePage;
