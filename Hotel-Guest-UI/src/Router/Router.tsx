import { ElementType, Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import LoadingPage from "src/components/LoadingPage";
import NotificationContext from "src/context/Notification";
import { UserSearchContextProvider } from "src/context/UserSearchContext";
import AuthGaurd from "src/guard/AuthGaurd";
import LoginGaurd from "src/guard/LoginGaurd";
import Layout from "src/layout/NavBar";

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Component {...props} />
    </Suspense>
  );
};

// const Login = Loadable(lazy(() => import("src/pages/Authentication/Login")));
const HomePage = Loadable(lazy(() => import("src/pages/Home/HomePage")));
const BookingList = Loadable(
  lazy(() => import("src/pages/Booking/BookingList"))
);
const Errorage404 = Loadable(lazy(() => import("src/pages/Error/404")));

const SignUp = Loadable(
  lazy(() => import("src/pages/Authentication/Register"))
);
const Login = Loadable(lazy(() => import("src/pages/Authentication/Login")));
const PropertyDetails = Loadable(
  lazy(() => import("src/pages/property/PropertyDetails"))
);
const PropertyListByState = Loadable(
  lazy(() => import("src/pages/PropertylistByState/PropertyListByState"))
);

const JobDetail = Loadable(lazy(() => import("src/pages/Jobs/JobDetail")));
const Bookin = Loadable(lazy(() => import("src/pages/Booking/Booking")));

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: (
        <NotificationContext>
          <UserSearchContextProvider>
            <Layout />
          </UserSearchContextProvider>
        </NotificationContext>
      ),
      children: [
        { path: "", element: <HomePage />, index: true },
        {
          path: ":country/:state",
          children: [
            {
              index: true,
              element: <PropertyListByState />,
            },
            {
              path: ":propertyName/:propertyID/job-detail",
              element: <JobDetail />,
            },
          ],
        },
        {
          path: ":country/:state/:propertyName/:propertyID",
          element: <PropertyDetails />,
        },
        {
          path: "mybooking",
          element: <BookingList />,
        },
        {
          path: ":country/:state/:propertyName/:propertyID/booking/:roomType/:roomID",
          element: (
            <AuthGaurd>
              <Bookin />
            </AuthGaurd>
          ),
        },
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

    {
      path: "*",
      element: <Errorage404 />,
    },
  ]);
}
