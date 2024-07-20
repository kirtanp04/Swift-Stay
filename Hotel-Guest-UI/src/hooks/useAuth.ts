import { useContext } from "react";
import { CreateAuthContext } from "src/context/AuthContex";

export default function useAuth() {
  const context = useContext(CreateAuthContext);
  return context;
}
