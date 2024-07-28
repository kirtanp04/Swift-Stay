import { createContext, ReactNode, useEffect, useState } from "react";
import { Crypt } from "src/common/Crypt";
import { Storage } from "src/common/Storage";
import useAuth from "src/hooks/useAuth";

export class UserSearchObj {
  selectedState: string = "";
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  totalRoom: number = 1;
  adults: number = 1;
  children: number = 0;
  selectedCountry: string = "India-IN";
}

const getDefaultUserSearchObj = (): UserSearchObj => {
  let _UserSearchObj = new UserSearchObj();
  try {
    const userSearchEncryptString =
      Storage.getFromSessionStorage("guest_search");
    if (userSearchEncryptString.error === "") {
      const decryptObj = Crypt.Decryption(userSearchEncryptString.data);

      if (decryptObj.error === "") {
        _UserSearchObj = decryptObj.data;
      } else {
        _UserSearchObj = new UserSearchObj();
      }
    } else {
      _UserSearchObj = new UserSearchObj();
    }
  } catch (error) {
    _UserSearchObj = new UserSearchObj();
  } finally {
    return _UserSearchObj;
  }
};

interface CTX {
  UserSearchObj: UserSearchObj;
  UpdateSearchObj: <K extends keyof UserSearchObj>(
    PropertyName: K,
    value: UserSearchObj[K]
  ) => void;
}

const UserSearchContext = createContext<CTX>({
  UserSearchObj: getDefaultUserSearchObj(),
  UpdateSearchObj(PropertyName, value) {
    return {
      PropertyName,
      value,
    };
  },
});

interface Props {
  children: ReactNode;
}

function UserSearchContextProvider({ children }: Props) {
  const [UserSearchObj, setUserSearchObj] = useState<UserSearchObj>(
    getDefaultUserSearchObj()
  );

  const {
    user: {
      userInfo: { country },
    },
  } = useAuth();

  useEffect(() => {
    if (country !== "") {
      UpdateSearchObj("selectedCountry", country);
    }
  }, [country]);

  const UpdateSearchObj = <K extends keyof UserSearchObj>(
    PropertyName: K,
    value: UserSearchObj[K]
  ) => {
    setUserSearchObj({ ...UserSearchObj, [PropertyName]: value });
  };

  return (
    <UserSearchContext.Provider value={{ UserSearchObj, UpdateSearchObj }}>
      {children}
    </UserSearchContext.Provider>
  );
}

export { UserSearchContext, UserSearchContextProvider };
