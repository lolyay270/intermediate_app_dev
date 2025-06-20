import { Navigate, useLocation } from "react-router";
import Stories from "./Components/Stories";
import Story from "./Components/Story";
import Leaders from "./Components/Leaders";

const App = () => {
  let currentRoute = useLocation();

  //default route is ask stories
  if (currentRoute.pathname === '/') {
    return <Navigate to="/ask" replace />
  }

  let isShowingStory = false;

  let storyId = currentRoute.pathname.slice(currentRoute.pathname.lastIndexOf("/") + 1); // +1 on index to remove "/"
  
  //check if pathname is "/story/[number]"      
  if (currentRoute.pathname.includes("/story/") && !Number.isNaN(storyId)) {
    isShowingStory = true;
  }
  
  return (
    <>
      {currentRoute.pathname === "/leaders" ? (
        <Leaders />
      ) : (
        isShowingStory ? (
          <Story />
        ) : (
          <Stories />
        )
      )}
    </>
  );
};

export default App;
