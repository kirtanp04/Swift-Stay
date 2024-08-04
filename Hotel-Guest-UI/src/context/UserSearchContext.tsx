import { createContext, ReactNode, useEffect, useState } from "react";
import { Storage } from "src/common/Storage";
import useAuth from "src/hooks/useAuth";

export class _UserSearchObj {
  selectedState: string = "";
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  totalRoom: number = 1;
  adults: number = 1;
  children: number = 0;
  selectedCountry: string = "India-IN";
}

interface CTX {
  UserSearchObj: _UserSearchObj;
  UpdateSearchObj: <K extends keyof _UserSearchObj>(
    PropertyName: K,
    value: _UserSearchObj[K]
  ) => void;
  UpdateFullobj: (obj: _UserSearchObj) => void;
}

const UserSearchContext = createContext<CTX | null>(null);

interface Props {
  children: ReactNode;
}

function UserSearchContextProvider({ children }: Props) {
  const [UserSearchObj, setUserSearchObj] = useState<_UserSearchObj>(
    new _UserSearchObj()
  );

  const {
    user: {
      userInfo: { country },
    },
  } = useAuth();

  useEffect(() => {
    let __UserSearchObj = new _UserSearchObj();
    try {
      const userSearchEncryptString =
        Storage.getFromSessionStorage("guest_search");
      if (userSearchEncryptString.error === "") {
        __UserSearchObj = userSearchEncryptString.data;
      } else {
        __UserSearchObj.selectedCountry = country !== "" ? country : "India-IN";

        __UserSearchObj = new _UserSearchObj();
      }
    } catch (error) {
      __UserSearchObj.selectedCountry = country !== "" ? country : "India-IN";
      __UserSearchObj = new _UserSearchObj();
    } finally {
      setUserSearchObj(__UserSearchObj);
    }
  }, []);

  useEffect(() => {
    if (country !== "") {
      UpdateSearchObj("selectedCountry", country);
    }
  }, []);

  const UpdateSearchObj = <K extends keyof _UserSearchObj>(
    PropertyName: K,
    value: _UserSearchObj[K]
  ) => {
    setUserSearchObj({ ...UserSearchObj, [PropertyName]: value });
  };

  const UpdateFullobj = (obj: _UserSearchObj) => {
    setUserSearchObj(obj);
    Storage.setToSessionStorage("guest_search", obj);
  };

  return (
    <UserSearchContext.Provider
      value={{ UserSearchObj, UpdateSearchObj, UpdateFullobj }}
    >
      {children}
    </UserSearchContext.Provider>
  );
}

export { UserSearchContext, UserSearchContextProvider };
