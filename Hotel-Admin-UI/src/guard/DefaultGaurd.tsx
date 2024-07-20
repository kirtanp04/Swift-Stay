import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// routes

// ----------------------------------------------------------------------

type DefaultGaurdProps = {
  children: ReactNode;
};

export default function DefaultGaurd({ children }: DefaultGaurdProps) {
  //   const { isAuthenticated } = useAuth();
  const isAuthenticated = true;

  if (isAuthenticated) {
    return <Navigate to={"dashboared"} />;
  }

  return <>{children}</>;
}
