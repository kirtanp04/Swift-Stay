import Router from "./Router/Router";
import { AuthContexProvider } from "./context/AuthContex";

function App() {
  return (
    <>
      <AuthContexProvider>
        <Router />
      </AuthContexProvider>
    </>
  );
}

export default App;
