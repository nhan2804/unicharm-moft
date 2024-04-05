import { Layout, Menu, Segmented, Tabs } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router";
import {
  BlockOutlined,
  UserOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BuildOutlined,
  InsertRowLeftOutlined,
  UnderlineOutlined,
  AppstoreOutlined,
  BarsOutlined,
  HomeOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHook";
import SubMenu from "antd/es/menu/SubMenu";
import classNames from "classnames";
import useGetQuestionToday from "@modules/staff/hooks/query/useGetQuestionToday";
import useShowCheckIn from "@modules/staff/hooks/query/useShowCheckIn";
import { setCurrentCheckIn } from "@modules/staff/slices/staff";
import useShowStore from "@modules/manager/stores/hooks/query/useShowStore";
import useRole from "@hooks/useRole";
const { Sider, Content } = Layout;
const StaffLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const match = useMatch("/staff/questions");
  const matchReport = useMatch("/staff/stores/*");
  const matchReportStore = useMatch("/staff/stores/:storeId/*");
  const matchCheckIn = useMatch("/staff/stores/:storeId/checkin/*");

  const user = useAppSelector((s) => s?.auth?.user);

  const __ = useRole();
  const { storeId } = useParams();
  const nav = useNavigate();
  const { data: store, isLoading: loadingStore } = useShowStore(storeId);
  useEffect(() => {
    if (!store && !loadingStore && !!storeId && __.isPg) {
      alert("Store không đúng, vui lòng thử lại");
      // should be check in BE
      window.location.href = "/";
      return;
    }
    if (!!store && __.isPg) {
      if (!store?.userIds?.includes(user?._id)) {
        nav("/staff");
      }
    }
  }, [store, loadingStore, nav, user, storeId, __]);

  // console.log(location);

  const onChangeMenu = (key) => {
    if (key === "question") {
      nav("/staff/questions");
    }
    if (key === "home") {
      if (isRating) {
        nav("/");
      } else {
        nav("/staff");
      }
    }
    if (key === "checkin") {
      nav("/staff/policy/overview");
    }
  };
  const dispatch = useAppDispatch();
  // NNN check if currentCheckin have been checkout or over current day
  const currentCheckIn = useAppSelector((s) => s?.staff?.currentCheckIn);
  const { data: checkIn, isLoading: loadingCheckin } = useShowCheckIn(
    matchReportStore?.params?.storeId,
    currentCheckIn
  );
  const ref = useRef(false);
  useEffect(() => {
    if (checkIn) {
      if (!checkIn?.isValid) {
        dispatch(setCurrentCheckIn(undefined));
        nav("/staff");
      }
    }
  }, [checkIn, dispatch, nav, loadingCheckin]);

  useEffect(() => {
    if (!currentCheckIn && matchReport && !matchCheckIn) {
      nav("/staff");
    }
  }, [currentCheckIn, matchReport, nav, matchCheckIn]);
  const roleUser = useAppSelector((s) => s?.auth?.user?.type);
  const isRating = ["RATING", "RATING_POLICY"].includes(roleUser);
  const { data: currentQues, isLoading: loadingQues } = useGetQuestionToday();
  useEffect(() => {
    if (!currentQues && !loadingQues && !match && !isRating && !__.isSup) {
      nav("/staff/questions");
    }
  }, [currentQues, loadingQues, match, nav, isRating, __]);
  return (
    <div>
      <div className="mb-10">
        <Outlet />
      </div>
      <div className="fixed -bottom-2 w-full">
        <div className="">
          <div>
            <Tabs
              centered
              onTabClick={onChangeMenu}
              tabPosition={"bottom"}
              items={[
                {
                  label: "Trang chủ",
                  value: "home",
                  icon: <HomeOutlined />,
                },
                {
                  label: "Công việc đầu ca",
                  value: "question",
                  icon: <AppstoreOutlined />,
                },
                {
                  label: "Thống kê",
                  value: "checkin",
                  icon: <HistoryOutlined />,
                },
              ]
                .filter((e) => {
                  return isRating || __.isSup ? e?.value === "home" : e?.value;
                })
                .map((_, i) => {
                  const { icon: ICon } = _;
                  return {
                    label: (
                      <span>
                        {" "}
                        {ICon} {_.label}
                      </span>
                    ),
                    key: _.value,
                    children: ``,
                  };
                })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;
