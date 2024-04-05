import { IRoute } from "@routes/route.interface";
import { lazy } from "react";
const OverviewTab = lazy(() => import("../policy/tab"));
const OverviewPolicy = lazy(() => import("../policy/overview"));
const ImageSupHomePage = lazy(() => import("../sup"));
const OverviewCheckin = lazy(() => import("../checkin/overview"));
const GiftExchangeSummay = lazy(() => import("../gift-exchange-summary"));
const NotificationHome = lazy(() => import("../notification"));
const CheckoutPage = lazy(() => import("../checkin/checkout"));
const ImageStaffHomePage = lazy(() => import("../images"));
const CreateCheckinPage = lazy(() => import("../checkin/create"));
const StaffQuestionHomePage = lazy(() => import("../question"));
const StaffHomePage = lazy(() => import("../home"));
const SaleHomePage = lazy(() => import("../sale"));
const CheckinPage = lazy(() => import("../checkin"));
const StartPageStaff = lazy(() => import("../start"));
const GiftHomePage = lazy(() => import("../gift"));
const OosHomePage = lazy(() => import("../oos"));
const SamplingHomePage = lazy(() => import("../sampling"));
const GiftOtpPage = lazy(() => import("../gift/otp"));
const ShowGiftPage = lazy(() => import("../gift/show-gift"));
const GiftExchangeHome = lazy(() => import("../gift-exchange"));
const Login = lazy(() => import("@modules/auth/pages/login"));
// const ProjectPage = () => <div>dd</div>;
const AppLayout = lazy(() => import("@layouts/LayoutApp.jsx"));
const StaffLayout = lazy(() => import("@layouts/LayoutStaff.jsx"));

const staffRoutes: IRoute[] = [
  {
    component: StaffLayout,
    path: "/staff/",
    isPrivate: true,
    exact: true,
    children: [
      {
        component: StartPageStaff,
        path: "",
        isPrivate: true,
        exact: true,
      },
      {
        component: StaffQuestionHomePage,
        path: "questions",
        isPrivate: true,
        exact: true,
      },

      {
        component: OverviewCheckin,
        path: "checkin/overview",
        isPrivate: true,
        exact: true,
      },
      {
        component: OverviewTab,
        path: "policy/overview",
        isPrivate: true,
        exact: true,
      },
      {
        component: StaffHomePage,
        path: "stores/:storeId",
        isPrivate: true,
        exact: true,
      },

      {
        component: CreateCheckinPage,
        path: "stores/:storeId/checkin/create",
        isPrivate: true,
        exact: true,
      },
      {
        component: CheckoutPage,
        path: "stores/:storeId/checkin/:checkinId/checkout",
        isPrivate: true,
        exact: true,
      },
      {
        component: CheckinPage,
        path: "stores/:storeId/checkin",
        isPrivate: true,
        exact: true,
      },
      {
        component: SaleHomePage,
        path: "stores/:storeId/sale",
        isPrivate: true,
        exact: true,
      },
      {
        component: GiftHomePage,
        path: "stores/:storeId/gift",
        isPrivate: true,
        exact: true,
      },
      {
        component: GiftOtpPage,
        path: "stores/:storeId/gift-otp",
        isPrivate: true,
        exact: true,
      },
      {
        component: ShowGiftPage,
        path: "stores/:storeId/show-gift/:giftId",
        isPrivate: true,
        exact: true,
      },
      {
        component: OosHomePage,
        path: "stores/:storeId/oos",
        isPrivate: true,
        exact: true,
      },
      {
        component: SamplingHomePage,
        path: "stores/:storeId/sampling",
        isPrivate: true,
        exact: true,
      },
      {
        component: ImageStaffHomePage,
        path: "stores/:storeId/image",
        isPrivate: true,
        exact: true,
      },
      {
        component: ImageSupHomePage,
        path: "stores/:storeId/sup",
        isPrivate: true,
        exact: true,
      },
      {
        component: GiftExchangeHome,
        path: "stores/:storeId/gift-exchange",
        isPrivate: true,
        exact: true,
      },
      {
        component: NotificationHome,
        path: "stores/:storeId/notification",
        isPrivate: true,
        exact: true,
      },
      {
        component: GiftExchangeSummay,
        path: "stores/:storeId/gift-exchange-summary",
        isPrivate: true,
        exact: true,
      },
    ],
  },
];
export default staffRoutes;
