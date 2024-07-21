import { createContext, ReactNode, useState } from "react";
import { Crypt } from "src/common/Crypt";
import { Storage } from "src/common/Storage";

export class UserSearchObj {
  selectedCity: string = "";
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  totalRoom: number = 1;
  adults: number = 1;
  children: number = 0;
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
}

const UserSearchContext = createContext<CTX>({
  UserSearchObj: getDefaultUserSearchObj(),
});

interface Props {
  children: ReactNode;
}

function UserSearchContextProvider({ children }: Props) {
  const [UserSearchObj] = useState<UserSearchObj>(getDefaultUserSearchObj());

  return (
    <UserSearchContext.Provider value={{ UserSearchObj }}>
      {children}
    </UserSearchContext.Provider>
  );
}

export { UserSearchContext, UserSearchContextProvider };
