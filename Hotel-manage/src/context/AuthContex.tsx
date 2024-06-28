import { useTheme } from "@mui/material";
import { ReactNode, createContext, useEffect, useState } from "react";
import { Storage } from "src/common/Storage";
import { Auth, _Login } from "src/pages/Authentication/AuthMgr";
import showMessage from "src/util/ShowMessage";
import { StoreError } from "src/util/StoreError";

type Props = {
  children: ReactNode;
};

export class TUser {
  email: string = "";
  profileImg: string = "";
  name: string = "";
  role: string = "";
}

export class TAuth {
  isProcessing: boolean = true;

  isAuthenticated: boolean = false;

  userInfo: TUser = new TUser();
}

type _TUser = {
  user: TAuth;
  UpdateUser: <K extends keyof TAuth>(propertyName: K, value: TAuth[K]) => void;
  LoginManager: (objLoginDetail: _Login) => void;
};

const CreateAuthContext = createContext<_TUser>({
  user: new TAuth(),
  UpdateUser: () => null,
  LoginManager: () => null,
});

function AuthContexProvider({ children }: Props) {
  const [user, setUser] = useState<TAuth>(new TAuth());
  const theme = useTheme();

  const checkUserToken = () => {
    const Authdata = Storage.getFromSessionStorage("Auth");
    if (Authdata.error !== "") {
      setUser({
        isProcessing: false,
        isAuthenticated: false,
        userInfo: new TUser(),
      });
      return;
    }
  };

  useEffect(() => {
    let _TimeInterval: any;

    _TimeInterval = setInterval(() => {
      checkUserToken();
    }, 1500);

    return () => {
      clearInterval(_TimeInterval);
    };
  }, []);

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
      // showMessage("You must login to access.", theme, () => {});
    }
  }, []);

  const UpdateUser = <K extends keyof TAuth>(
    propertyName: K,
    value: TAuth[K]
  ): void => {
    setUser({ ...user, [propertyName]: value });
  };

  const LoginManager = async (objLogindetail: _Login): Promise<void> => {
    await Auth.Login(
      objLogindetail,
      (res) => {
        let _user = new TUser();
        _user.email = res.email;
        _user.name = res.name;
        _user.profileImg = res.profile;
        _user.role = res.role;
        setUser({ ...user, isAuthenticated: true, userInfo: _user });
        Storage.setToSessionStorage("Auth", _user);
      },
      (err) => {
        StoreError("login", err);
        showMessage(err, theme, () => {});
      }
    );
  };
  return (
    <CreateAuthContext.Provider value={{ user, UpdateUser, LoginManager }}>
      {children}
    </CreateAuthContext.Provider>
  );
}

export { AuthContexProvider, CreateAuthContext };
