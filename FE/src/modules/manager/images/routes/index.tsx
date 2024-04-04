import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const ImageHomePage = lazy(() => import("../pages"));

const imageRoutes: IRoute[] = [
  {
    component: ImageHomePage,
    isPrivate: true,
    path:"/images"
  },
];
export default imageRoutes;
