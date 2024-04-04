import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const PolicyHomePage = lazy(() => import("../pages"));

const policyRoutes: IRoute[] = [
  {
    component: PolicyHomePage,
    isPrivate: true,
    path:"/policys"
  },
];
export default policyRoutes;
