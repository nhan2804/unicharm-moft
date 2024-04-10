import FormEndShiftReport from "@modules/staff/components/FormEndShiftReport";
import React, { useEffect, useMemo } from "react";
import useCreateReport from "@modules/staff/hooks/mutate/useCreateReport";
import { useNavigate, useParams } from "react-router";
import { Form, Spin } from "antd";
import useGetGiftClients from "@modules/comsumer/hooks/query/useGetGiftClients";
import useGetReport from "@modules/staff/hooks/query/useGetReport";
import useGetTodayGiftClients from "@modules/comsumer/hooks/query/useGetTodayGiftClients";
import CustomPageHeader from "@components/CustomPageHeader";
import { useAppSelector } from "@hooks/reduxHook";

const EndShiftReportPage = () => {
  const { storeId } = useParams();
  const { mutate: createReport } = useCreateReport(storeId, "end-shift");
  const nav = useNavigate();
  const onFinish = (values) => {
    createReport(values, {
      onSuccess: () => {
        nav(-1);
      },
    });
  };
  const { data: giftClientsToday, isLoading } = useGetTodayGiftClients(storeId);
  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);

  const { data: endShiftReportToday } = useGetReport(storeId, "end-shift", {
    checkinId,
  });
  const initData = useMemo(() => {
    let endShiftSamplings = {};
    let endShiftGiftExternals = {};
    let endShiftSales = {};
    giftClientsToday?.forEach((record) => {
      const products = record?.products;
      for (const key in products) {
        if (record?.type === "SAMPLING") {
          if (endShiftSamplings[key]) {
            endShiftSamplings[key] += products[key];
          } else {
            endShiftSamplings[key] = products[key];
          }
        } else if (record?.type === "SELLING") {
          if (endShiftGiftExternals[key]) {
            endShiftGiftExternals[key] += products[key];
          } else {
            endShiftGiftExternals[key] = products[key];
          }
        }
      }
      if (record?.type === "SELLING") {
        record?.productsBill?.map((e) => {
          const key = e?.product;
          if (endShiftSales[key]) {
            endShiftSales[key] += e?.quantity;
          } else {
            endShiftSales[key] = e?.quantity;
          }
        });
      }
    });
    return {
      ...endShiftReportToday,
      endShiftSamplings,
      endShiftGiftExternals,
      endShiftSales,
    };
  }, [giftClientsToday, endShiftReportToday]);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(initData);
  }, [form, initData]);
  return (
    <div className="p-2">
      <CustomPageHeader title="Báo cáo cuối ca"></CustomPageHeader>
      <Spin spinning={isLoading}>
        <FormEndShiftReport form={form} onFinish={onFinish} />
      </Spin>
    </div>
  );
};

export default EndShiftReportPage;
