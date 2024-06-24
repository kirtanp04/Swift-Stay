import { ElementType, Suspense, lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import LoadingPage from "src/components/LoadingPage";
import AuthGaurd from "src/guard/AuthGaurd";
import LoginGaurd from "src/guard/LoginGaurd";
// import LoadingPage from "../components/LoadingPage";

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Component {...props} />
    </Suspense>
  );
};

const Login = Loadable(lazy(() => import("src/pages/Authentication/Login")));
const Layout = Loadable(lazy(() => import("src/layout/SideMenu")));
const SignUp = Loadable(
  lazy(() => import("src/pages/Authentication/Register"))
);

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Outlet />,
      children: [
        {
          path: "",
          element: (
            <LoginGaurd>
              <Login />
            </LoginGaurd>
          ),
          index: true,
        },
        { path: "register", element: <SignUp /> },
        { path: "about", element: <>About</> },
        { path: "contact", element: <>About</> },
      ],
    },

    {
      path: "swiftstay",
      element: (
        <AuthGaurd>
          <Layout />
        </AuthGaurd>
      ),
      children: [
        {
          element: <Navigate to="/swiftstay/dashboard" replace />,
          index: true,
        },
        { path: "dashboard", element: <>progress</> },
      ],
    },
  ]);
}
