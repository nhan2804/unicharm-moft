import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const GroupimageHomePage = lazy(() => import("../pages"));

const groupimageRoutes: IRoute[] = [
  {
    component: GroupimageHomePage,
    isPrivate: true,
    path:"/groupimages"
  },
];
export default groupimageRoutes;
