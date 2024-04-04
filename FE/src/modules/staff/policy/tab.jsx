import { lazy, useState } from "react";

import dayjs from "dayjs";
import CustomPageHeader from "@components/CustomPageHeader";
import { DatePicker, Tabs } from "antd";

const OverviewCheckin = lazy(() => import("../checkin/overview"));
const OverviewRating = lazy(() => import("./overview-rating"));
const OverviewPolicy = lazy(() => import("./overview"));
const OverviewTab = ({ initProject }) => {
  const [month, setMonth] = useState(dayjs().startOf("month"));
  //   const search = {
  //     startTime: month?.valueOf(),
  //     endTime: month?.endOf("month")?.valueOf(),
  //   };
  //   console.log({ search });
  const items = [
    {
      key: "1",
      label: "Đánh giá",

      children: <OverviewRating month={month} />,
    },
    {
      key: "2",
      label: "Policy",
      children: <OverviewPolicy month={month} />,
    },
    {
      key: "3",
      label: "Checkin",
      children: <OverviewCheckin month={month} />,
    },
  ];

  return (
    <div>
      <CustomPageHeader title="Thống kê" />

      <div className="p-2">
        <div className="flex justify-end">
          <DatePicker.MonthPicker
            allowClear={false}
            onChange={setMonth}
            value={month}
          ></DatePicker.MonthPicker>
        </div>
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default OverviewTab;
