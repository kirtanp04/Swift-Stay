import { ElementType, Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import LoadingPage from "src/components/LoadingPage";
import { UserSearchContextProvider } from "src/context/UserSearchContext";
import AuthGaurd from "src/guard/AuthGaurd";
import LoginGaurd from "src/guard/LoginGaurd";
import Layout from "src/layout/NavBar";
// import Login from "src/pages/Authentication/Login";

// import LoadingPage from "../components/LoadingPage";

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Component {...props} />
    </Suspense>
  );
};

// const Login = Loadable(lazy(() => import("src/pages/Authentication/Login")));
const HomePage = Loadable(lazy(() => import("src/pages/Home/HomePage")));

const SignUp = Loadable(
  lazy(() => import("src/pages/Authentication/Register"))
);
const Login = Loadable(lazy(() => import("src/pages/Authentication/Login")));

export default function Router() {
  return useRoutes([
    // {
    //   path: "/",
    //   element: <Outlet />,
    //   children: [
    //     {
    //       path: "",
    //       element: (
    //         <LoginGaurd>
    //           <Login />
    //         </LoginGaurd>
    //       ),
    //       index: true,
    //     },
    //     { path: "register", element: <SignUp /> },
    //     { path: "about", element: <>About</> },
    //     { path: "contact", element: <>About</> },
    //   ],
    // },

    {
      path: "/",
      element: (
        <AuthGaurd>
          <UserSearchContextProvider>
            <Layout />
          </UserSearchContextProvider>
        </AuthGaurd>
      ),
      children: [
        { path: "", element: <HomePage />, index: true },

        { path: "about", element: <>About</> },
        { path: "contact", element: <>Contact</> },
      ],
    },
    { path: "/signup", element: <SignUp /> },
    {
      path: "/signin",
      element: (
        <LoginGaurd>
          <Login />
        </LoginGaurd>
      ),
    },
  ]);
}
