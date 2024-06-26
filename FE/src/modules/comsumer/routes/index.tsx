import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
// const CreateBillCustomer = lazy(() => import("../pages/CreateBillCustomer"));
const ConsumerLayout = lazy(() => import("../layout/ConsumerLayout"));
const LoginComsumer = lazy(() => import("../pages"));
const ConsumerRoll = lazy(() => import("../pages/RollConsumer"));
// const ConsumerHistory = lazy(() => import("../pages/HistoryConsumer"));

// const ConsumerBill = lazy(() => import("../pages/BillCustomer"));
const consumerRoutes: IRoute[] = [
  // {
  //   path: "/consumer/login",
  //   component: LoginComsumer,
  // },
  // {
  //   path: "/c/",
  //   component: LoginComsumer,
  // },
  // {
  //   component: ConsumerLayout,
  //   isPrivate: false,
  //   accessRole: ["GUEST"],
  //   path: "/consumer",
  //   children: [
  //     {
  //       path: "roll/:id",
  //       component: ConsumerRoll,
  //       isPrivate: false,
  //     },
  //     // {
  //     //   path: "/consumer/history",
  //     //   component: ConsumerHistory,
  //     // },
  //     // {
  //     //   path: "/consumer/bill",
  //     //   component: ConsumerBill,
  //     // },
  //     // {
  //     //   path: "/consumer/create-bill",
  //     //   component: CreateBillCustomer,
  //     // },
  //   ],
  // },
];
export default consumerRoutes;
