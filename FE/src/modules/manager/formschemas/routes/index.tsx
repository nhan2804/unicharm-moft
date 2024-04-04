import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const FormschemaHomePage = lazy(() => import("../pages"));

const formschemaRoutes: IRoute[] = [
  {
    component: FormschemaHomePage,
    isPrivate: true,
    path:"/formschemas"
  },
];
export default formschemaRoutes;
