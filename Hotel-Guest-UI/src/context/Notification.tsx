import { createContext, ReactNode, useState } from "react";

interface TCreateNotificationContext {
  Message: any;
}

export const CreateNotificationContext =
  createContext<TCreateNotificationContext | null>(null);

export default function NotificationContext({
  children,
}: {
  children: ReactNode;
}) {
  const [Message, setmessage] = useState<any>();
  return (
    <CreateNotificationContext.Provider value={{ Message }}>
      {children}
    </CreateNotificationContext.Provider>
  );
}
