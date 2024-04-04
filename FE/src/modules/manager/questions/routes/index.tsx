import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const QuestionHomePage = lazy(() => import("../pages"));

const questionRoutes: IRoute[] = [
  {
    component: QuestionHomePage,
    isPrivate: true,
    path: "/questions",
  },
];
export default questionRoutes;
