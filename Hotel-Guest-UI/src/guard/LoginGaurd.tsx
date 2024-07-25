import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Path } from "src/Router/path";
import useAuth from "src/hooks/useAuth";

type Props = {
  children: ReactNode;
};

export default function LoginGaurd({ children }: Props) {
  const {
    user: { isAuthenticated },
  } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={Path.root} />;
  }

  return <>{children}</>;
}
