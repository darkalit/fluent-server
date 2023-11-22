import express, { Router } from "express";
import pingRoute from "./ping.route";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import wordRoute from "./word.route";
import userStatRoute from "./userStat.route";
import themeRoute from "./theme.route";
import testRoute from "./test.route";
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
    path: "/words",
    route: wordRoute,
  },
  {
    path: "/userstats",
    route: userStatRoute,
  },
  {
    path: "/themes",
    route: themeRoute,
  },
  {
    path: "/tests",
    route: testRoute,
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
