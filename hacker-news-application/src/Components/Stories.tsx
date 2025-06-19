import { useQuery, useQueries, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryClient } from "../main";

import { navItems } from "./Nav";
import Story, { StoryProps } from "./Story";

interface StoriesProps {
  localUrl: String;
}

const Stories: React.FC<StoriesProps> = (props: StoriesProps) => {
  const fetchUrlBase = "https://hacker-news.firebaseio.com/v0";
  const storyInfoUrlExtension = "/item/";   // full url is .../v0/item/[id].json
  let fetchUrl: string = "";

  //set the fetch url based on the page were loading
  navItems.forEach(nav => {
    if (nav.localUrl === props.localUrl) {
      fetchUrl = fetchUrlBase + nav.fetchUrl;
    }
  });

  // Get story IDs
 const {
   data: storiesIds,
   isLoading: isLoadingIds,
   isError: isErrorIds,
 } = useQuery({
   queryKey: ["storyIds", fetchUrl],
   queryFn: () => fetch(fetchUrl).then((res) => res.json()),
 });

 // Get full story data for each ID
 const {
   data: allStoryInfo,
   isLoading: isLoadingStories,
   isError: isErrorStories,
 } = useQuery({
   queryKey: ["storyData", storiesIds],
   queryFn: async () => {
     const fetchAllArray = storiesIds.slice(0, 25).map((id: number) =>
       fetch(fetchUrlBase + storyInfoUrlExtension + id + ".json").then((res) => res.json())
     );
     return Promise.all(fetchAllArray);
   },
 });



  if (storiesIds === null || allStoryInfo === null) return <p>No data available</p>;
  if (isErrorIds || isErrorStories) return <p>Error: data cannot be shown</p>
  if (isLoadingIds || isLoadingStories) return <p>Loading...</p>;

  return (
    <>
      {allStoryInfo && allStoryInfo.length > 0 && (
        allStoryInfo.map((story: any) => (
          <button>
            <a href={"story/" + story.id}>
              <p>{story.title}</p>
              <p>By: {story.by}</p>
            </a>
          </button>
          // <Story
          //   by={story.by}
          //   descendants={story.descendants}
          //   id={story.id}
          //   kids={story.kids}
          //   score={story.score}
          //   time={story.time}
          //   title={story.title}
          //   type={story.type}
          //   url={story.url}
          // />
        )))
      }
    </>
  );
};

export default Stories;
