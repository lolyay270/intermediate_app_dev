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

export const fetchUrlBase = "https://hacker-news.firebaseio.com/v0";
export const storyInfoUrlExtension = "/item/";   // full url is .../v0/item/[id].json

const Stories: React.FC = () => {
  let fetchUrl: string = "";
  const localUrl = useLocation().pathname;

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
    <div className="grid grid-cols-5 gap-4">
      {allStoryInfo && allStoryInfo.length > 0 && (
        allStoryInfo.map((story: any) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
              <CardDescription>By: {story.by}</CardDescription>
            </CardHeader>
            <CardContent>
              <CardAction><Link to={"story/" + story.id}>Open Story</Link></CardAction>
            </CardContent>
          </Card>
        )))
      }
    </div>
  );
};

export default Stories;
