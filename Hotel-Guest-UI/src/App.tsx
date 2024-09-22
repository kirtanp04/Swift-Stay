import { useEffect } from "react";
import Router from "./Router/Router";
import { AuthContexProvider } from "./context/AuthContex";
import setFavicon from "./components/Favicon";

function App() {
  useEffect(() => {
    setFavicon();
  }, []);
  return (
    <>
      <AuthContexProvider>
        <Router />
      </AuthContexProvider>
    </>
  );
}

export default App;
