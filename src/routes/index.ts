import { lazy } from "react";

let routes = [
  {
    path: "/login",
    key: "login",
    exact: true,
    component: lazy(() => import("../pages/Login")),
  },
  {
    path: "/",
    key: "home",
    component: lazy(() => import("../pages/Home")),
    children: [
      {
        path: "/peocenter",
        key: "peocenter",
        component: lazy(() => import("../pages/Home/PeoCenter/index")),
      },
      {
        path: "/login",
        key: "login",
        component: lazy(() => import("../pages/Login")),
      },
      {
        path: "/weblog",
        key: "weblog",
        component: lazy(() => import("../pages/Home/WeBlog/index")),
      },
    ],
  },
];

export default routes;
