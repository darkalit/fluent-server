import express, { Router } from "express";
import pingRoute from "./ping.route";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import docsRoute from "./swagger.route";

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: "/ping",
    route: pingRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
