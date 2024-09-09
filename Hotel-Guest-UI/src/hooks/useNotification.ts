import { useContext } from "react";
import { CreateNotificationContext } from "src/context/Notification";

export default function useNotification() {
    const context = useContext(CreateNotificationContext);
    if (context === null) {
        throw new Error('Context is null')
    }
    return context;
}