import { useContext } from "react";
import { UserSearchContext } from "src/context/UserSearchContext";

export default function useUserSearch() {
    const context = useContext(UserSearchContext);
    if (context === null) {
        throw new Error('Context is null')
    }
    return context;
}