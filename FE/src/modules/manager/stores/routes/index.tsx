import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const StoreHomePage = lazy(() => import("../pages"));
const StoreGiftPage = lazy(() => import("../pages/gift"));

const storeRoutes: IRoute[] = [
  {
    component: StoreHomePage,
    isPrivate: true,
    path: "/stores",
  },
  {
    component: StoreGiftPage,
    isPrivate: true,
    path: "/stores-gift",
  },
];
export default storeRoutes;
