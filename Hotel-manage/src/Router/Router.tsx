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
const SignUp = Loadable(
  lazy(() => import("src/pages/Authentication/Register"))
);

export default function Router() {
  return useRoutes([
    // {
    //   path: "swiftstay",
    //   element: (
    //     <LoginGaurd>
    //       <Login />
    //     </LoginGaurd>
    //   ),
    //   children: [
    //     { path: "register", element: <SignUp /> },
    //     { path: "about-us", element: <>About</> },
    //     { path: "contact-us", element: <>About</> },
    //   ],
    // },

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
          {/* header */}
          <Outlet />
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
