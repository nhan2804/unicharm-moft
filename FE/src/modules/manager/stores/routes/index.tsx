import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const StoreHomePage = lazy(() => import("../pages"));

const storeRoutes: IRoute[] = [
  {
    component: StoreHomePage,
    isPrivate: true,
    path: "/stores",
  },
  {
    component: StoreHomePage,
    isPrivate: true,
    path: "/stores",
  },
];
export default storeRoutes;
