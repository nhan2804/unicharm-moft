import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const NotificationHomePage = lazy(() => import("../pages"));

const notificationRoutes: IRoute[] = [
  {
    component: NotificationHomePage,
    isPrivate: true,
    path:"/notifications"
  },
];
export default notificationRoutes;
