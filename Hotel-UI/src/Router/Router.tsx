import { ElementType, Suspense, lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<div>loading</div>}>
      <Component {...props} />
    </Suspense>
  );
};

const Login = Loadable(lazy(() => import("src/pages/Login")));

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Login />,
      children: [
        { path: "about-us", element: <>About</> },
        { path: "contact-us", element: <>About</> },
      ],
    },

    {
      path: "k",
      element: (
        <>
          <Outlet />
        </>
      ),
      children: [
        { element: <Navigate to="k/index" replace />, index: true },
        { path: "index", element: <>ab</> },
        { path: "list", element: <>cg</> },
      ],
    },
  ]);
}
