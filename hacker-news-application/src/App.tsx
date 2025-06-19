import { useLocation } from "react-router";
import Stories from "./Components/Stories";
import Story from "./Components/Story";
import Leaders from "./Components/Leaders";

const App = () => {
  let currentRoute = useLocation();
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
          <Story id={Number(storyId)}/>
        ) : (
          <Stories localUrl={currentRoute.pathname} />
        )
      )}
    </>
  );
};

export default App;
