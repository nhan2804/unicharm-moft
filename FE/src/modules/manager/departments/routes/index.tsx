import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const DepartmentHomePage = lazy(() => import("../pages"));

const departmentRoutes: IRoute[] = [
  {
    component: DepartmentHomePage,
    isPrivate: true,
    path:"/departments"
  },
];
export default departmentRoutes;
