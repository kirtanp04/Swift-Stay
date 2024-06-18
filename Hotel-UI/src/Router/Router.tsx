import { ElementType, Suspense } from "react";
import { useRoutes, Navigate } from "react-router-dom";

// const MultiWellDashboardPage = Loadable(lazy(() => import('../pages/multi-well-dashboard/MultiWellDashboardPage')));

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<div>loading</div>}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: (
        //   <GuestGuard>
        //     <Login />
        //   </GuestGuard>
        <></>
      ),
      children: [
        { path: "about-us", element: <>About</> },
        { path: "contact-us", element: <>About</> },
      ],
    },

    {
      path: "/k",
      element: <></>,
      children: [
        { element: <Navigate to="/k/index" replace />, index: true },
        { path: "index", element: <>ab</> },
        { path: "list", element: <>cg</> },
      ],
    },
  ]);
}
