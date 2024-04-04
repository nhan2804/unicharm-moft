import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const ProductHomePage = lazy(() => import("../pages"));

const productRoutes: IRoute[] = [
  {
    component: ProductHomePage,
    isPrivate: true,
    path:"/products"
  },
];
export default productRoutes;
