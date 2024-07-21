import { useContext } from "react";
import { UserSearchContext } from "src/context/UserSearchContext";

export default function useUserSearch() {
    const context = useContext(UserSearchContext);
    return context;
}