import { ReactNode, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingPage from "src/components/LoadingPage";
import useAuth from "src/hooks/useAuth";
import Login from "src/pages/Authentication/Login";

type Props = {
  children: ReactNode;
};

export default function AuthGaurd({ children }: Props) {
  const {
    user: { isAuthenticated, isProcessing },
  } = useAuth();

  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  );

  if (isProcessing) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
