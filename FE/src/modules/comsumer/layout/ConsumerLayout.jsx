import { Button, Card, Layout, Menu, Modal, theme, Table } from "antd";
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
import useEmptyNoti from "@modules/auth/hooks/useEmptyNoti";
import classNames from "classnames";
import useShowPlace from "@modules/projects/hooks/query/useShowPlace";

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

  if (!role.isGuest) {
    nav(`/login`);
  }
  const type = useAppSelector((s) => s?.auth?.user?.type);
  // console.log({ type: type });
  const { data: user } = useGetProfile({ background: !type });

  const { data: lastPlace } = useShowPlace(
    "111",
    user?.lastPlaceId || undefined
  );
  const annoucement = user?.annoucement;
  const ref = useRef();
  const { mutateAsync: empty } = useEmptyNoti();
  useEffect(() => {
    console.log({ annoucement });
    if (annoucement > 0) {
      Modal.destroyAll();

      Modal.info({
        onOk: async () => {
          await empty();
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
  }, [annoucement, empty, nav]);

  const consumer = useAppSelector((s) => s?.auth?.user);
  const { projectId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const match = useMatch("/consumer/:page");
  // console.log(location);
  return (
    <div className="">
      <div className="bg-primary h-3 w-full"></div>
      <div className="">
        <div
          style={{ background: token.colorPrimary }}
          className="bg-gray-200 py-4 force-rounded"
        >
          <Table
            //  rowKey={"_id"}
            bordered
            style={
              {
                // borderEndEndRadius: "8px",
                // borderBottomLeftRadius: "8px",
                // borderBottomRightRadius: "8px",
                // borderTopLeftRadius: "0px",
              }
            }
            size="small"
            pagination={false}
            showHeader={false}
            dataSource={[
              {
                label: <b>Tổng số lượt quay</b>,
                value: consumer?.totalPoint,
              },
              {
                label: <b>Số lượt đã quay</b>,
                value: (consumer?.totalPoint || 0) - (consumer?.point || 0),
              },
              {
                label: <b>Số lượt còn lại</b>,
                value: consumer?.point,
              },
            ]}
            columns={[
              {
                dataIndex: "label",
                key: "label",
              },
              {
                dataIndex: "value",
                key: "value",
              },
            ]}
          ></Table>
          <div className="mt-5 text-white text-center">
            <a
              className="text-[#fdb52f] font-bold stroke-white"
              href={`tel:+${mappingHotline?.[lastPlace?.region] || "---"}`}
            >
              {" "}
              Hotline : <PhoneOutlined />{" "}
              {mappingHotline?.[lastPlace?.region] || "---"}
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2 mt-2">
        {[
          {
            label: "Chụp hình hoá đơn",
            value: "/consumer/create-bill",
            icon: <BarcodeOutlined />,
          },
          {
            label: `Quay số : <span class="text-red-500">${consumer?.point}</span>`,
            value: "/consumer/roll",
            icon: <DollarOutlined />,
            s: true,
          },
          {
            label: "Lịch sử trúng thưởng",
            value: "/consumer/history",
            icon: <GiftOutlined />,
          },
          // {
          //   label: "Kho quà trúng thưởng",
          //   value: "/consumer/gift",
          //   icon: <GiftOutlined />,
          // },
          {
            label: "Lịch sử tham gia",
            value: "/consumer/bill",
            icon: <BookOutlined />,
          },
        ].map((e) => {
          return (
            <Link className="w-full" to={e?.value}>
              <Button
                className={classNames(
                  "w-full border-gray-500",
                  e?.s && user?.point > 0 && "border-color-change"
                )}
                type={
                  `/consumer/${match?.params?.page}` === e?.value
                    ? "primary"
                    : ""
                }
                icon={e?.icon}
              >
                <span dangerouslySetInnerHTML={{ __html: e?.label }}></span>
              </Button>
            </Link>
          );
        })}
      </div>
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
