import { ElementType, Suspense, lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import LoadingPage from "src/components/LoadingPage";
// import LoadingPage from "../components/LoadingPage";

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Component {...props} />
    </Suspense>
  );
};

// const Login = Loadable(lazy(() => import("src/pages/Authentication/Login")));
const SignUp = Loadable(
  lazy(() => import("src/pages/Authentication/Register"))
);

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <SignUp />,
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
