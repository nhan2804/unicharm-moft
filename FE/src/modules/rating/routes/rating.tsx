import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

const RatingPage = lazy(() => import("../index"));
const IdentifyRatingPage = lazy(() => import("../identify"));
const SelectStorePage = lazy(() => import("../select-store"));
const SelectUserPage = lazy(() => import("../select-user"));
const RatingUserPage = lazy(() => import("../rating-user"));
const PolicyUserPage = lazy(() => import("../policy-user"));
// const ProjectPage = () => <div>dd</div>;
const AppLayout = lazy(() => import("@layouts/LayoutApp.jsx"));
const StaffLayout = lazy(() => import("@layouts/LayoutStaff.jsx"));

const ratingRoutes: IRoute[] = [
  {
    component: StaffLayout,
    path: "/rating/",
    isPrivate: true,
    exact: true,
    children: [
      {
        component: IdentifyRatingPage,
        path: "/rating/identify",
        isPrivate: true,
        exact: true,
      },
      {
        component: RatingPage,
        path: "",
        isPrivate: true,
        exact: true,
      },
      {
        component: SelectStorePage,
        path: "/rating/stores",
        isPrivate: true,
        exact: true,
      },
      {
        component: PolicyUserPage,
        path: "/rating/stores/:storeId/users/:userId/checkin/:checkinId/policy",
        isPrivate: true,
        exact: true,
      },
      {
        component: RatingUserPage,
        path: "/rating/stores/:storeId/users/:userId/checkin/:checkinId",
        isPrivate: true,
        exact: true,
      },
      {
        component: SelectUserPage,
        path: "/rating/stores/:storeId",
        isPrivate: true,
        exact: true,
      },
    ],
  },
];
export default ratingRoutes;
