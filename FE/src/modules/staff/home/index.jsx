import { Alert, Button, Card } from "antd";
import React from "react";
import {
  CameraTwoTone,
  ShoppingTwoTone,
  FireTwoTone,
  NotificationTwoTone,
  ShopTwoTone,
  LogoutOutlined,
  FundTwoTone,
  CalendarTwoTone,
  ProfileTwoTone,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import CustomPageHeader from "@components/CustomPageHeader";
import { useAppSelector } from "@hooks/reduxHook";
import useGetAnnoucement from "../hooks/query/useGetAnnoucement";
import useGetReport from "../hooks/query/useGetReport";
const items = [
  {
    to: "image",
    icon: <CameraTwoTone className="text-6xl" size={"large"} />,
    title: "Hình POSM",
  },
  // {
  //   to: "sup",
  //   icon: <CameraTwoTone className="text-6xl" size={"large"} />,
  //   title: "Hình ảnh Sup",
  //   forSup: true,
  // },
  // {
  //   to: "sale",
  //   icon: <FundTwoTone className="text-6xl" size={"large"} />,
  //   title: "Số bán",
  // },
  // {
  //   to: "gift-exchange-summary",
  //   icon: <CalendarTwoTone className="text-6xl" size={"large"} />,
  //   title: "Tổng đổi quà",
  // },
  // {
  //   to: "gift-exchange",
  //   icon: <ShoppingTwoTone className="text-6xl" size={"large"} />,
  //   title: "Đổi quà",
  // },

  {
    to: "gift",
    icon: <ShoppingTwoTone className="text-6xl" size={"large"} />,
    title: "Quà tặng",
  },
  {
    to: "oos",
    icon: <FireTwoTone className="text-6xl" size={"large"} />,
    title: "OOS",
  },
  {
    to: "notification",
    icon: <NotificationTwoTone className="text-6xl" size={"large"} />,
    title: "Thông báo khẩn",
  },
  {
    to: "end-shift",
    icon: <ProfileTwoTone className="text-6xl" size={"large"} />,
    title: "Báo cáo cuối ca",
  },
  // {
  //   to: "sampling",
  //   icon: <ShopTwoTone className="text-6xl" size={"large"} />,
  //   title: "Sampling",
  // },
];
const after10H = new Date().getHours() >= 10;
const StaffHomePage = () => {
  const { storeId } = useParams();
  const currentCheckIn = useAppSelector((s) => s?.staff?.currentCheckIn);
  const { data: annoucements } = useGetAnnoucement();
  const user = useAppSelector((s) => s?.auth?.user);
  const checkinId = useAppSelector((s) => s?.staff?.currentCheckIn);
  const { data: currentReport, isLoading: loadingCurrent } = useGetReport(
    storeId,
    "oos",
    { checkinId }
  );

  return (
    <div>
      <CustomPageHeader
        title="Trang chủ"
        extra={
          <Link
            to={`/staff/stores/${storeId}/checkin/${currentCheckIn}/checkout`}
          >
            <Button icon={<LogoutOutlined />} type="primary" danger>
              Checkout
            </Button>
          </Link>
        }
      />
      <div className="px-2">
        {annoucements?.map((e) => {
          return (
            <Alert
              style={{ fontSize: 12 }}
              message={`${e?.name} : ${e?.desc}`}
              type="warning"
              showIcon
              // closable
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 p-2 gap-4">
        {items
          ?.filter((e) => (user?.type === "SUP" ? e?.forSup : !e?.forSup))
          ?.map((e) => {
            const hl =
              e?.to === "oos" && after10H && !currentReport && !loadingCurrent;
            return (
              <Link to={e?.to}>
                <Card className={hl && "border-2 border-red-500"} bordered={hl}>
                  <div className="flex justify-center">{e?.icon}</div>
                  <h3 className="text-center">{e?.title}</h3>
                  {hl && (
                    <div className="text-center text-red-500 font-bold">
                      Vui lòng nhập OOS đầu ca!
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default StaffHomePage;
