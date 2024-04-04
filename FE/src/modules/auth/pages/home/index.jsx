import { useAppSelector } from "@hooks/reduxHook";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
const routerMapping = {
  SUPER_ADMIN: "/manager/",
  MANAGER: "/manager/",
  MANAGER_READONLY: "/manager/",
  ADMIN_READONLY: "/manager/",
  RATING: "/rating/identify",
  PG: "/staff/",
};
const HomePage = () => {
  const nav = useNavigate();
  const user = useAppSelector((s) => s?.auth?.user);
  useEffect(() => {
    if (user)
      nav(routerMapping?.[user?.type], {
        replace: true,
      });
  }, [nav, user]);

  return <div></div>;
};

export default HomePage;
