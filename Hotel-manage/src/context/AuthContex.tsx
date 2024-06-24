import { ReactNode, createContext, useEffect, useState } from "react";
import { Storage } from "src/common/Storage";

type Props = {
  children: ReactNode;
};

export class TUser {
  email: string = "";
  profileImg: string = "";
  name: string = "";
}

export class TAuth {
  isProcessing: boolean = true;

  isAuthenticated: boolean = false;

  userInfo: TUser = new TUser();
}

type _TUser = {
  user: TAuth;
  UpdateUser: <K extends keyof TAuth>(propertyName: K, value: TAuth[K]) => void;
};

const CreateAuthContext = createContext<_TUser>({
  user: new TAuth(),
  UpdateUser: () => null,
});

function AuthContexProvider({ children }: Props) {
  const [user, setUser] = useState<TAuth>(new TAuth());

  useEffect(() => {
    const Authdata = Storage.getFromSessionStorage("Auth");
    if (Authdata.error === "") {
      setUser({
        isProcessing: false,
        userInfo: Authdata.data,
        isAuthenticated: true,
      });
    } else {
      setUser({
        ...user,
        isProcessing: false,
      });
    }
  }, []);

  const UpdateUser = <K extends keyof TAuth>(
    propertyName: K,
    value: TAuth[K]
  ): void => {
    setUser({ ...user, [propertyName]: value });
  };

  //   const ManageAuthUser = () => {};
  return (
    <CreateAuthContext.Provider value={{ user, UpdateUser }}>
      {children}
    </CreateAuthContext.Provider>
  );
}

export { CreateAuthContext, AuthContexProvider };
