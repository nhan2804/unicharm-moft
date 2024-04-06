import { Button, Card, Layout, Menu, Modal, theme, Result } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router";
import {
  BarcodeOutlined,
  DollarOutlined,
  HistoryOutlined,
  GiftOutlined,
  BookOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import Paragraph from "antd/es/typography/Paragraph";
import { useAppSelector } from "@hooks/reduxHook";
import useRole from "@hooks/useRole";
import useGetProfile from "@modules/auth/hooks/useGetProfile";
import { useRef } from "react";
// import useEmptyNoti from "@modules/auth/hooks/useEmptyNoti";
import classNames from "classnames";
import useShowGiftClients from "../hooks/query/useShowGiftClients";

export const mappingHotline = {
  Central: "0916486076",
  "Central Highlands": "0916486076",
  North: "0916486076",

  MKD: "0354545921",
  East: "0354545921",
  HCM: "0354545921",
};
const { useToken } = theme;
const { Sider, Content } = Layout;
const ConsumerLayout = () => {
  const { token } = useToken();
  const role = useRole();
  const nav = useNavigate();

  // if (!role.isGuest) {
  //   nav(`/login`);
  // }
  const type = useAppSelector((s) => s?.auth?.user?.type);
  // console.log({ type: type });
  const { data: user } = useGetProfile({ background: !type });

  const annoucement = user?.annoucement;
  const ref = useRef();
  // const { mutateAsync: empty } = useEmptyNoti();
  useEffect(() => {
    console.log({ annoucement });
    if (annoucement > 0) {
      Modal.destroyAll();

      Modal.info({
        onOk: async () => {
          // await empty();
          nav(`/consumer/bill`);
          Modal.destroyAll();
        },
        type: "info",
        title: "Bạn có thông báo mới",
        centered: true,
        content: (
          <div>
            <p className="text-blue-500 text-2xl">
              Đã có kết quả duyệt hóa đơn của bạn, vui lòng kiểm tra kết quả
              {/* Bạn có <b className="text-red-500">{annoucement}</b> thông báo */}
            </p>
          </div>
        ),
        okText: "Xem kết quả",
        // closable: true,
        // maskClosable: true,
        // closeIcon: <div>X</div>,
      });
    }
  }, [annoucement, nav]);

  const consumer = useAppSelector((s) => s?.auth?.user);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="">
      <div className="bg-primary h-3 w-full"></div>

      <Layout>
        <Layout className="site-layout">
          <Content className="p-2">
            <Suspense
              fallback={
                <div className="flex items-center justify-center max-w-lg min-h-full mx-auto h-screen">
                  <BarLoader
                    color={"#00B649"}
                    width={300}
                    height={6}
                    loading={true}
                    size={60}
                  />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </Content>
        </Layout>
      </Layout>
      <div className="h-80 bg-primary"></div>
      <div></div>
    </div>
  );
};

export default ConsumerLayout;
