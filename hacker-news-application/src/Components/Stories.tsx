import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryClient } from "../main";

import { navItems } from "./Nav";
import Story, { StoryProps } from "./Story";

interface StoriesProps {
  localUrl: String;
}

const Stories: React.FC<StoriesProps> = (props: StoriesProps) => {
  const fetchUrlBase = "https://hacker-news.firebaseio.com/v0";
  const storyInfoUrlExtension = "/item/";   // full url is .../v0/item/[code].json
  const [fetchUrl, setFetchUrl] = useState<string>("");
  const [fetchAllArray, setFetchAllArray] = useState<Promise<Response>[]>([]);
  const [allStoryInfo, setAllStoryInfo] = useState<StoryProps[]>([]);


  //get the codes for all stories
  let { data: storiesIds } = useQuery({
    queryKey: ["storyData"],
    queryFn: () => fetch(fetchUrl).then((res) => res.json()),
  });

  const { mutate: getStoriesIdsMutation, data: getStoriesIdsData } = useMutation({
    mutationFn: () =>
      fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        storiesIds = getStoriesIdsData;
        res.json();
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["storyData"],
      }),
  });


  //get the data for each story
  const { mutate: getStoryInfoMutation, data: getStoryInfoData } = useMutation({
    mutationFn: () => 
      fetchAllStoryData().then((resArray: Response[]) => {
        console.log("getStoryData", getStoryInfoData);
        if (getStoryInfoData)
        {
          let data: any = getStoryInfoData; //stop getting typescript error by assigning to any type
          let newStory: StoryProps; 
          data.map((story: any) => {
            try{
              newStory = {
                by: story.by,
                descendants: story.descendants,
                id: story.id,
                kids: story.kids,
                score: story.score,
                time: story.time,
                title: story.title,
                type: story.type,
                url: story.url,
              }
              setAllStoryInfo(allStoryInfo.concat([newStory]))
            }
            catch (error)
            {
              console.log(error);
            }
          })
        }
        resArray.map((res) => {
          console.log("res", res)
          res.json();
        });
      })
  });
  
  const fetchAllStoryData = () => {
    storiesIds.map((id: string) => {
      let newFetch = fetch(fetchUrlBase + storyInfoUrlExtension + id + ".json", {
        method: "GET",
        headers: { "Content-Type": "application/json", },
      })
      setFetchAllArray(fetchAllArray.concat([newFetch]));
    })
    return Promise.all(fetchAllArray)
  };
  
  //whenever the path changes, refetch the data
  useEffect(() => {
    navItems.forEach((nav) => {
      if (nav.localUrl == props.localUrl)
        setFetchUrl(fetchUrlBase + nav.fetchUrl);
    });
    getStoriesIdsMutation();
    getStoryInfoMutation();
    console.log("getStoryData", getStoryInfoData);
  }, [props.localUrl]);


  console.log("storiesids", storiesIds)

  if (storiesIds === null) return <p>No data available</p>;
  if (storiesIds && storiesIds.error) return <p>Error: {storiesIds.error}</p>;
  if (!storiesIds) return <p>Loading...</p>;

  console.log("getStoryInfoData", getStoryInfoData)
  return (
    <>
      {allStoryInfo && allStoryInfo.length > 0 && (
        <p>
          {allStoryInfo.map((id: any) => (
            // <Story  id={Number(id)}/>
            <p>{id}</p>
          ))}
        </p>
      )}
      <p>hi</p>
    </>
  );
};

export default Stories;
