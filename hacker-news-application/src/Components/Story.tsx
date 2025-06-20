import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { fetchUrlBase, storyInfoUrlExtension } from "./Stories";

export interface StoryProps {
  by: string;
  descendants: number;
  id: number;
  kids: string[];   //fetch urls for each kid
  score: number;
  time: Date;       //Unix number converted to human readable
  title: string;
  type: string;
  url: string;
}


const Story: React.FC = () => {
  const storyId: number = Number(useParams().id);
  const fetchUrl = fetchUrlBase + storyInfoUrlExtension + storyId + ".json";
  let story: StoryProps;

  // Get story data
  const {
    data: storyData,
    isLoading: isLoadingData,
    isError: isErrorData,
  } = useQuery({
    queryKey: ["storyData", fetchUrl],
    queryFn: () => fetch(fetchUrl).then((res) => res.json()),
  });

  if (storyData) {
    story = {
      by: storyData.by,
      descendants: storyData.descendants,
      id: storyData.id,
      kids: storyData.kids ? storyData.kids.slice(0, 5).map((kid: string) => (
        kid = fetchUrlBase + storyInfoUrlExtension + kid + ".json"
      )) : "0",
      score: storyData.score,
      time: new Date(storyData.time * 1000), //hackerNews saves in seconds, JS creates from milliseconds
      title: storyData.title,
      type: storyData.type,
      url: fetchUrl,
    }
  }


  if (isLoadingData) return <p>Loading...</p>
  if (isErrorData) return <p>Error: Cannot load data</p>

  return (
    <>
      {story && (
        <>
          <p>By: {story.by}</p>
          <p>Descendant{story.descendants > 1 ? "s" : ""}: {story.descendants}</p>
          <p>ID: {story.id}</p>

          <p>
            Kids: {story.kids.length > 1 ? (
              story.kids.map((kid) => (
                <>
                  <br/>
                  <a href={kid} target="_blank">{kid}</a>
                </>
              ))
            ) : (
              "N/A"
            )}
          </p>
          
          <p>Score: {story.score}</p>
          <p>Time: {story.time.toString()}</p>
          <p>Title: {story.title}</p>
          <p>Type: {story.type}</p>
          <p>Url: <a href={fetchUrl} target="_blank">{fetchUrl}</a></p>
        </>
      )}
    </>
  );
}

export default Story;