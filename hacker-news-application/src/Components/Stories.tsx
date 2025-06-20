import { Link, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { navItems } from "./Nav";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Button } from "./ui/button";
import { useState } from "react";

import { StoryProps, emptyStory } from "./Story";

export const fetchUrlBase = "https://hacker-news.firebaseio.com/v0";
export const storyInfoUrlExtension = "/item/";   // full url is .../v0/item/[id].json

const Stories: React.FC = () => {
  let fetchUrl: string = "";
  const localUrl = useLocation().pathname;
  const [storyData, setStoryData] = useState<StoryProps[]>([])

  //set the fetch url based on the page were loading
  navItems.forEach(nav => {
    if (nav.localUrl === localUrl) {
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
      const fetchAllArray = storiesIds.map((id: number) =>
        fetch(fetchUrlBase + storyInfoUrlExtension + id + ".json").then((res) => res.json())
      );
      return Promise.all(fetchAllArray);
    },
  });

  //Data validation (no missing values)
  const checkStoryData = () => {
    if (allStoryInfo) {
      for (let i = 0; i < allStoryInfo.length; i++) {
        let story: StoryProps = emptyStory; //make variable defined to add correct values into

        if (allStoryInfo[i].by && typeof allStoryInfo[i].by === "string") story.by = allStoryInfo[i].by;
        else continue;

        if (allStoryInfo[i].descendants && typeof allStoryInfo[i].descendants === "number") story.descendants = allStoryInfo[i].descendants;
        else continue;

        if (allStoryInfo[i].id && typeof allStoryInfo[i].id === "number") story.id = allStoryInfo[i].id;
        else continue;

        if (allStoryInfo[i].kids && typeof allStoryInfo[i].kids === "object") story.kids = allStoryInfo[i].kids;
        else continue;

        if (allStoryInfo[i].score && typeof allStoryInfo[i].score === "number") story.score = allStoryInfo[i].score;
        else continue;

        if (allStoryInfo[i].time && typeof allStoryInfo[i].time === "number") story.time = new Date(allStoryInfo[i].time);
        else continue;

        if (allStoryInfo[i].title && typeof allStoryInfo[i].title === "string") story.title = allStoryInfo[i].title;
        else continue;

        if (allStoryInfo[i].type && typeof allStoryInfo[i].type === "string") story.type = allStoryInfo[i].type;
        else continue;

        story.url = fetchUrlBase + storyInfoUrlExtension + allStoryInfo[i].id + ".json";

        setStoryData((storyData) => [...storyData, story])
      }
    }
  }

  if(storyData.length < 25) checkStoryData(); //get 25 stories that all have data


  if (storiesIds === null || allStoryInfo === null) return <p>No data available</p>;
  if (isErrorIds || isErrorStories) return <p>Error: data cannot be shown</p>
  if (isLoadingIds || isLoadingStories) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-5 gap-4">
      {storyData && storyData.length > 0 && (
        storyData.map((story: any) => (
          <Card key={story.id} className="bg-blue-200">
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
              <CardDescription>By: {story.by}</CardDescription>
            </CardHeader>
            <CardContent>
              <CardAction>
                <Button className="bg-blue-400">
                  <Link to={"story/" + story.id}>
                    Open Story
                  </Link>
                </Button>
              </CardAction>
            </CardContent>
          </Card>
        )))
      }
    </div>
  );
};

export default Stories;
