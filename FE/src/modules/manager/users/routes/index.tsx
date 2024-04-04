import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const UserHomePage = lazy(() => import("../pages"));

const userRoutes: IRoute[] = [
  {
    component: UserHomePage,
    isPrivate: true,
    path:"/users"
  },
];
export default userRoutes;
