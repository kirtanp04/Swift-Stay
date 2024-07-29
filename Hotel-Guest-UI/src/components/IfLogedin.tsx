import { Fragment, ReactNode } from "react";
import useAuth from "src/hooks/useAuth";

type Props = {
  children: ReactNode;
  Else?: ReactNode;
};

export default function IfLogedin({ Else, children }: Props) {
  const { user } = useAuth();

  const CanRender = user.isAuthenticated === true;
  return (
    <Fragment>{CanRender ? children : Else !== undefined && Else}</Fragment>
  );
}
