/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import useGetProfile from "@modules/auth/hooks/useGetProfile";
import { useAppSelector } from "@hooks/reduxHook";
import useLogout from "@modules/auth/hooks/useLogout";
import { Avatar, Button, Dropdown, Input, Space, version } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMatch, useNavigate, useParams } from "react-router";
import logo from "@assets/logo.png";
import useShowProject from "@modules/projects/hooks/query/useShowProject";
const Header = () => {
  const { data: u } = useGetProfile();
  const user = useAppSelector((s) => s?.auth?.user);
  const { mutate: logout } = useLogout();
  const match = useMatch("/projects/:projectId/*");
  const projectId = match?.params?.projectId;
  const nav = useNavigate();
  // const logout=()=>{

  // }
  // {user?.type === "SUPER_ADMIN" && (
  //   <li>
  //     <Link to={"/projects"}>Project</Link>
  //   </li>
  // )}
  // {user?.type === "QC" && (
  //   <li>
  //     <Link to={`/project-submit/${user?.projectId}`}>
  //       Đổi địa điểm
  //     </Link>
  //   </li>
  // )}

  const items = [
    user?.type === "PG"
      ? {
          key: "x",
          label: (
            <div
              className="text-blue-400"
              aria-hidden
              type="text"
              onClick={() => nav("/profile")}
            >
              Thông tin nhân sự
            </div>
          ),
        }
      : null,
    user?.type === "SUPER_ADMIN"
      ? {
          key: "2",
          label: <Link to={"/projects"}>Dự án</Link>,
        }
      : null,
    user?.type === "QC"
      ? {
          key: "3",
          label: (
            <Link to={`/project-submit/${user?.projectId}`}>Đổi địa điểm</Link>
          ),
        }
      : null,
    user?.type === "PG"
      ? {
          key: "0",
          label: (
            <div
              className="text-blue-500"
              aria-hidden
              type="text"
              onClick={() => nav("/staff/policy/overview")}
            >
              Thống kê
            </div>
          ),
        }
      : null,
    {
      key: "1",
      label: (
        <div className="text-red-400" aria-hidden type="text" onClick={logout}>
          Đăng xuất
        </div>
      ),
    },
  ].filter((e) => !!e);

  const { data: project } = useShowProject(projectId);
  return (
    <header className="">
      <nav class="bg-primary text-white border-gray-200 lg:px-6 py-2.5 dark:bg-gray-800">
        <div class="flex flex-wrap justify-between items-center">
          <Link to={"/"} class="flex items-center">
            <div className="relative">
              <img
                src={
                  "https://www.unicharm.vn/content/dam/sites/www_unicharm_vn/images/common/logo-company.svg"
                }
                class="mr-3 h-12 sm:h-12"
                alt="Flowbite Logo"
              />
              {/* <div className="absolute bottom-[-8px] text-xs right-0 text-white">
                v2
              </div> */}
            </div>
            {/* <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Blue Sky
            </span> */}
          </Link>
          {project && (
            <div className="text-2xl font-bold uppercase text-[#135dac] overflow-hidden flex-shrink lg:w-[300px] w-48">
              <span className="line-clamp-1"> {project?.title}</span>
            </div>
          )}

          <div class="flex items-center lg:order-2 cursor-pointer">
            {user && (
              <Dropdown
                menu={{
                  items,
                }}
              >
                <Space>
                  {user?.avatar && <Avatar src={user?.avatar}></Avatar>}
                  {user?.fullName}
                  <DownOutlined />
                </Space>
              </Dropdown>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
