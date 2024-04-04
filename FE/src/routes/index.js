import authRoute from "@modules/auth/routes";
import managerRoutes from "@modules/manager/routes/manager";
import projectsRoutes from "@modules/projects/routes";
import staffRoutes from "@modules/staff/routes/staff";
import ratingRoutes from "@modules/rating/routes/rating";
const routes = [
  ///////////////////////////////for cli insert
  ...authRoute,
  ...projectsRoutes,
  ...managerRoutes,
  ...staffRoutes,
  ...ratingRoutes,
];
export default routes;
