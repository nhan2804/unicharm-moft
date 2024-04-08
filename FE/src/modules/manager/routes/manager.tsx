import { IRoute } from "@routes/route.interface";
import { lazy } from "react";
const ManagerBill = lazy(() => import("../bill/pages/manager"));
const ReportCheckinSupPage = lazy(() => import("../reports/checkin-sup"));
const ReportQuestion = lazy(() => import("../reports/question"));
const ReportPolicy = lazy(() => import("../reports/policy"));
const ReportSubImagePage = lazy(() => import("../reports/sup-image"));
const PolicyHomePage = lazy(() => import("../policys/pages"));
const GroupimageHomePage = lazy(() => import("../groupimages/pages"));
const DepartmentHomePage = lazy(() => import("../departments/pages"));
const ReportRating = lazy(() => import("../reports/rating"));
const NotificationHomePage = lazy(() => import("../notifications/pages"));
const ReportCheckinPage = lazy(() => import("../reports/checkin"));
const FormschemaHomePage = lazy(() => import("../formschemas/pages"));
const ImageHomePage = lazy(() => import("../images/pages"));
const ReportImagePage = lazy(() => import("../reports/image"));
const ReportSamplingPage = lazy(() => import("../reports/sampling"));
const ReportOOSPage = lazy(() => import("../reports/oos"));
const ReportGiftPage = lazy(() => import("../reports/gift"));
const ReportSalePage = lazy(() => import("../reports/sale"));
const ReportEndShiftPage = lazy(() => import("../reports/end-shift"));
const QuestionHomePage = lazy(() => import("../questions/pages"));
const UserHomePage = lazy(() => import("../users/pages"));
const ProductHomePage = lazy(() => import("../products/pages"));
const GiftHomePage = lazy(() => import("../products/pages/gift"));
const StoreHomePage = lazy(() => import("../stores/pages"));
const AnnoucementHomePage = lazy(() => import("../annoucements/pages"));
const ReportGiftExchangePage = lazy(() => import("../reports/gift-exchange"));
const Login = lazy(() => import("@modules/auth/pages/login"));
// const ProjectPage = () => <div>dd</div>;
const AppLayout = lazy(() => import("@layouts/LayoutApp.jsx"));

const managerRoutes: IRoute[] = [
  {
    component: AppLayout,
    path: "/manager/",
    isPrivate: true,
    exact: true,
    accessRole: ["SUPER_ADMIN", "ADMIN", "ADMIN_READONLY"],
    children: [
      {
        component: ProductHomePage,
        path: "products",
        isPrivate: true,
        exact: true,
      },
      {
        component: GiftHomePage,
        path: "gifts",
        isPrivate: true,
        exact: true,
      },
      {
        component: DepartmentHomePage,
        path: "departments",
        isPrivate: true,
        exact: true,
      },
      {
        component: StoreHomePage,
        path: "stores",
        isPrivate: true,
        exact: true,
      },
      {
        component: AnnoucementHomePage,
        path: "annoucements",
        isPrivate: true,
        exact: true,
      },
      {
        component: UserHomePage,
        path: "users",
        isPrivate: true,
        exact: true,
      },
      {
        component: QuestionHomePage,
        path: "questions",
        isPrivate: true,
        exact: true,
      },
      {
        component: QuestionHomePage,
        path: "question-rating",
        isPrivate: true,
        exact: true,
      },
      {
        component: QuestionHomePage,
        path: "question-policy",
        isPrivate: true,
        exact: true,
      },
      {
        component: GroupimageHomePage,
        path: "group-image",
        isPrivate: true,
        exact: true,
      },
      {
        component: ImageHomePage,
        path: "images",
        isPrivate: true,
        exact: true,
      },
      {
        component: FormschemaHomePage,
        path: "form-schemas",
        isPrivate: true,
        exact: true,
      },
      {
        component: PolicyHomePage,
        path: "policies",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportSalePage,
        path: "report/sale",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportOOSPage,
        path: "report/oos",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportGiftPage,
        path: "report/gift",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportEndShiftPage,
        path: "report/end-shift",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportSamplingPage,
        path: "report/sampling",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportImagePage,
        path: "report/image",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportSubImagePage,
        path: "report/sup-image",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportCheckinPage,
        path: "report/checkin",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportCheckinSupPage,
        path: "report/checkin-sup",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportGiftExchangePage,
        path: "report/gift-exchange",
        isPrivate: true,
        exact: true,
      },
      {
        component: NotificationHomePage,
        path: "report/notification",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportRating,
        path: "report/rating",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportPolicy,
        path: "report/policy",
        isPrivate: true,
        exact: true,
      },
      {
        component: ReportQuestion,
        path: "report/question",
        isPrivate: true,
        exact: true,
      },
    ],
  },
  {
    component: AppLayout,
    path: "/bill-management/",
    isPrivate: true,
    exact: true,
    accessRole: ["SUPER_ADMIN", "BILL_MANAGER"],
    children: [
      {
        component: ManagerBill,
        path: "",
        isPrivate: true,
        exact: true,
      },
    ],
  },
];
export default managerRoutes;
