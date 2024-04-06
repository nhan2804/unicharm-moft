import FormEndShiftReport from "@modules/staff/components/FormEndShiftReport";
import React, { useEffect, useMemo } from "react";
import useCreateReport from "@modules/staff/hooks/mutate/useCreateReport";
import { useParams } from "react-router";
import { Form } from "antd";
import useGetGiftClients from "@modules/comsumer/hooks/query/useGetGiftClients";
import useGetTodayGiftClients from "@modules/comsumer/hooks/query/useGetTodayGiftClients";

const EndShiftReportPage = () => {
  const { storeId } = useParams();
  const { mutate: createReport } = useCreateReport(storeId, "end-shift");
  const onFinish = (values) => {
    createReport(values);
  };
  const { data: giftClientsToday } = useGetTodayGiftClients(storeId);
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
        const productsBill = record?.productsBill;
        for (const key in productsBill) {
          if (endShiftSales[key]) {
            endShiftSales[key] += productsBill[key];
          } else {
            endShiftSales[key] = productsBill[key];
          }
        }
      }
    });
    return { endShiftSamplings, endShiftGiftExternals, endShiftSales };
  }, [giftClientsToday]);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(initData);
  }, [form, initData]);
  return (
    <div>
      <FormEndShiftReport form={form} onFinish={onFinish} />
    </div>
  );
};

export default EndShiftReportPage;
