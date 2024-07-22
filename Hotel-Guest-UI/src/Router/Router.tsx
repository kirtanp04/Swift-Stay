import { ElementType, Suspense, lazy } from "react";
import { Outlet, useRoutes } from "react-router-dom";
import LoadingPage from "src/components/LoadingPage";
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
  ]);
}
