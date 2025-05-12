import { useLocation } from "react-router";
import Stories from "./Components/Stories";
import Leaders from "./Components/Leaders";

const App = () => {
  let currentRoute = useLocation();

  return (
    <>
      {currentRoute.pathname === "/leaders" ? <Leaders /> : <Stories localUrl={currentRoute.pathname} />}
    </>
  );
};

export default App;
