import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router";
import {
  BuildOutlined,
  AppstoreOutlined,
  ProfileOutlined,
  FileImageOutlined,
  QuestionOutlined,
  UserSwitchOutlined,
  NotificationOutlined,
  InsertRowAboveOutlined,
  FileDoneOutlined,
  InsertRowLeftOutlined,
  DatabaseOutlined,
  WarningOutlined,
  CarryOutOutlined,
  UsergroupAddOutlined,
  BarcodeOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAppSelector } from "@hooks/reduxHook";
import SubMenu from "antd/es/menu/SubMenu";
import classNames from "classnames";
import useRole from "@hooks/useRole";
const { Sider, Content } = Layout;
const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const match = useMatch("/manager/:page/");
  const matchReport = useMatch("/manager/report/:page");
  const user = useAppSelector((s) => s?.auth?.user);
  const keys = [match?.params?.page, matchReport?.params?.page]?.filter(
    (e) => !!e
  );
  const { canView, isSupperAdmin } = useRole();

  const page = match?.params?.page;
  useEffect(() => {
    if (!!page && page !== "report" && !isSupperAdmin) {
      window.location.href = "/";
    }
  }, [isSupperAdmin, page]);

  useEffect(() => {
    if (user) {
      if (!canView) {
        window.location.href = "/";
      }
    }
  }, [canView, user]);

  // console.log(location);
  return (
    <div>
      <Layout>
        <Sider
          onCollapse={() => setCollapsed(!collapsed)}
          style={{
            overflow: "auto",
            // height: "100vh",
            position: "fixed",
            left: 0,
            top: 76,
            bottom: 0,
          }}
          theme="light"
          // trigger={null}
          collapsible
          // collapsed={collapsed}
        >
          <div className="logo" />
          <Menu
            theme="light"
            mode="inline"
            defaultOpenKeys={keys}
            selectedKeys={keys}
          >
            {user?.type === "SUPER_ADMIN" && (
              <SubMenu title="Cài đặt" icon={<ProfileOutlined />}>
                <>
                  <Menu.Item icon={<AppstoreOutlined />} key="stores">
                    <Link to={`/manager/stores`}>Cửa hàng</Link>
                  </Menu.Item>
                  <Menu.Item icon={<AppstoreOutlined />} key="stores-gift">
                    <Link to={`/manager/stores-gift`}>Kho topup</Link>
                  </Menu.Item>
                  <Menu.Item icon={<BuildOutlined />} key="products">
                    <Link to={`/manager/products`}>Sản phẩm</Link>
                  </Menu.Item>
                  <Menu.Item icon={<BuildOutlined />} key="gift">
                    <Link to={`/manager/gifts`}>Quà tặng</Link>
                  </Menu.Item>
                  <Menu.Item icon={<FileImageOutlined />} key="group-image">
                    <Link to={`/manager/group-image`}>Group hình ảnh</Link>
                  </Menu.Item>
                  <Menu.Item icon={<FileImageOutlined />} key="images">
                    <Link to={`/manager/images`}>Hình ảnh</Link>
                  </Menu.Item>

                  <Menu.Item icon={<QuestionOutlined />} key="questions">
                    <Link to={`/manager/questions`}>Câu hỏi đầu ca</Link>
                  </Menu.Item>
                  <Menu.Item icon={<QuestionOutlined />} key="question-rating">
                    <Link to={`/manager/question-rating`}>
                      Câu hỏi đánh giá
                    </Link>
                  </Menu.Item>
                  {/* <Menu.Item icon={<AuditOutlined />} key="question-policy">
                    <Link to={`/manager/question-policy`}>Câu hỏi Policy</Link>
                  </Menu.Item> */}
                  {/* <Menu.Item
                    icon={<InsertRowLeftOutlined />}
                    key="form-schemas"
                  >
                    <Link to={`/manager/form-schemas`}>Scheme đổi quà</Link>
                  </Menu.Item> */}
                  <Menu.Item icon={<UserSwitchOutlined />} key="users">
                    <Link to={`/manager/users`}>Nhân viên</Link>
                  </Menu.Item>
                  <Menu.Item icon={<UsergroupAddOutlined />} key="departments">
                    <Link to={`/manager/departments`}>Phòng ban/Chức vụ</Link>
                  </Menu.Item>
                  <Menu.Item icon={<NotificationOutlined />} key="annoucements">
                    <Link to={`/manager/annoucements`}>Thông báo</Link>
                  </Menu.Item>
                  {/* <SubMenu
                    title="Policy nghiêm trọng"
                    icon={<ProfileOutlined />}
                  >
                    <>
                      <Menu.Item icon={<SnippetsOutlined />} key="policies">
                        <Link to={`/manager/policies`}>Policy</Link>
                      </Menu.Item>
                      <Menu.Item
                        icon={<SnippetsOutlined />}
                        key="policies-field"
                      >
                        <Link to={`/manager/policy-field`}>Policy Field</Link>
                      </Menu.Item>
                    </>
                  </SubMenu> */}
                </>
              </SubMenu>
            )}
            {user?.type === "SUPER_ADMIN" && (
              <SubMenu title="Quản lý duyệt bill" icon={<BarcodeOutlined />}>
                <>
                  <Menu.Item icon={<BarcodeOutlined />} key="bill-management">
                    <Link to={`/bill-management`}>Duyệt bill khách hàng</Link>
                  </Menu.Item>
                </>
              </SubMenu>
            )}
            {/* <SubMenu
              // key={"manager"}
              title="Thống kê"
              icon={<InsertRowAboveOutlined />}
            >
              {user?.type === "SUPER_ADMIN" && (
                <> */}
            <Menu.Item icon={<FileDoneOutlined />} key="checkin">
              <Link to={`/manager/report/checkin`}>Report checkin</Link>
            </Menu.Item>
            {/* <Menu.Item icon={<FileDoneOutlined />} key="sale">
              <Link to={`/manager/report/sale`}>Report số bán</Link>
            </Menu.Item> */}
            <Menu.Item icon={<FileDoneOutlined />} key="oos">
              <Link to={`/manager/report/oos`}>Report OOS</Link>
            </Menu.Item>
            <Menu.Item icon={<FileDoneOutlined />} key="gift">
              <Link to={`/manager/report/gift`}>Report quà tặng</Link>
            </Menu.Item>
            <Menu.Item icon={<FileDoneOutlined />} key="sampling">
              <Link to={`/manager/report/end-shift`}>Report cuối ca</Link>
            </Menu.Item>
            <Menu.Item icon={<FileDoneOutlined />} key="image">
              <Link to={`/manager/report/image`}>Report hình ảnh</Link>
            </Menu.Item>
            {/* <Menu.Item icon={<FileDoneOutlined />} key="sup-image">
              <Link to={`/manager/report/sup-image`}>Report Sup hình ảnh</Link>
            </Menu.Item>
            <Menu.Item icon={<FileDoneOutlined />} key="checkin-sup">
              <Link to={`/manager/report/checkin-sup`}>Report Sup Checkin</Link>
            </Menu.Item> */}
            {/* <Menu.Item icon={<FileDoneOutlined />} key="gift-exchange">
              <Link to={`/manager/report/gift-exchange`}>Report đổi quà</Link>
            </Menu.Item> */}
            <Menu.Item icon={<CarryOutOutlined />} key="rating">
              <Link to={`/manager/report/rating`}>Report đánh giá</Link>
            </Menu.Item>
            {/* <Menu.Item icon={<CarryOutOutlined />} key="policy">
              <Link to={`/manager/report/policy`}>Report Policy</Link>
            </Menu.Item> */}
            <Menu.Item icon={<CarryOutOutlined />} key="question">
              <Link to={`/manager/report/question`}>Report câu hỏi</Link>
            </Menu.Item>
            <Menu.Item icon={<WarningOutlined />} key="notification">
              <Link to={`/manager/report/notification`}>Thông báo khẩn</Link>
            </Menu.Item>

            {/* </>
              )}
            </SubMenu> */}
            {/* <SubMenu key={"m"} title="Mod data" icon={<DatabaseOutlined />}>
              {user?.role === "SUPER_ADMIN" && (
                <>
                  <Menu.Item
                    icon={<DatabaseOutlined />}
                    key="mod-data-gift-exchage"
                  >
                    <Link to={`/mod-data-gift-exchage`}>Đổi quà</Link>
                  </Menu.Item>
                </>
              )}
            </SubMenu> */}

            {/* <Menu.Item icon={<InsertRowLeftOutlined />} key={"storages"}>
              <Link to={`/storages`}>Báo cáo kho</Link>
            </Menu.Item>
            <Menu.Item icon={<MenuFoldOutlined />} key="import-tickets">
              <Link to={`/import-tickets`}>Nhập kho</Link>
            </Menu.Item>
            <Menu.Item icon={<MenuUnfoldOutlined />} key={"export-tickets"}>
              <Link to={`/export-tickets`}>Xuất kho</Link>
            </Menu.Item>
            <Menu.Item icon={<BlockOutlined />} key={"storage-inventory"}>
              <Link to={`/storage-inventory`}>Tổng hợp tồn kho</Link>
            </Menu.Item>
            <Menu.Item icon={<BlockOutlined />} key={"export-file"}>
              <Link to={`/export-file`}>Export file</Link>
            </Menu.Item> */}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content className={classNames("p-2", collapsed ? "ml-24" : "ml-52")}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <div></div>
    </div>
  );
};

export default AppLayout;
