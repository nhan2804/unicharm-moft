import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const AnnoucementHomePage = lazy(() => import("../pages"));

const annoucementRoutes: IRoute[] = [
  {
    component: AnnoucementHomePage,
    isPrivate: true,
    path:"/annoucements"
  },
];
export default annoucementRoutes;
