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
  const storyInfoUrlExtension = "/item/";   // full url is .../v0/item/[code].json
  const [fetchUrl, setFetchUrl] = useState<string>("");
  const [fetchAllArray, setFetchAllArray] = useState<Promise<Response>[]>([]);
  const [allStoryInfo, setAllStoryInfo] = useState<any[]>([]);




  
  //get the codes for all stories
  let { data: storiesIds } = useQuery({
    queryKey: ["storyIds"],
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
        queryKey: ["storyIds"],
      }),
  });

  //get the data for each story
  const { mutate: getStoryInfoMutation, data: getStoryInfoData, status: getStoryInfoStatus, error: getStoryInfoError} = useMutation({
    mutationFn: () => 
      Promise.all(fetchAllArray).then((resArray) => {
        let storyDatas: any[] = [];
        
        resArray.map(async(res) => {
          const story: any = await res.json();
          storyDatas.push(story)

          // try{
          //   const newStory: StoryProps = {
          //     by: story.by,
          //     descendants: story.descendants,
          //     id: story.id,
          //     kids: story.kids,
          //     score: story.score,
          //     time: story.time,
          //     title: story.title,
          //     type: story.type,
          //     url: story.url,
          //   }
          //   // console.log("new story", newStory)
          //   storyDatas = [...storyDatas, newStory]
          // }
          // catch (error)
          // {
          //   console.log("fetching story data error", error);
          // }

        });
        return storyDatas;
      }),
    onError: (error) => console.log(error)
  });

  const fetchAllStoryData = () => {
    let localFetchAllArray: Promise<Response>[] = []

    //collect all fetches into a single array
    storiesIds.map((id: string) => {
      const newFetch = fetch(fetchUrlBase + storyInfoUrlExtension + id + ".json", {
        method: "GET",
        headers: { "Content-Type": "application/json", },
      })
      localFetchAllArray = [...localFetchAllArray, newFetch]
    })
    setFetchAllArray(localFetchAllArray)
  };





  //-----------whenever the path changes, refetch the data-----------\\
  useEffect(() => {
    navItems.forEach((nav) => {
      if (nav.localUrl == props.localUrl)
        setFetchUrl(fetchUrlBase + nav.fetchUrl);
    });
    getStoriesIdsMutation();
  }, [props.localUrl]);

  useEffect(() => {
    if (storiesIds) {
      fetchAllStoryData();
    } 
  }, [storiesIds])

  useEffect(() => {
    const data = getStoryInfoMutation();
    if (data !== undefined && data !== null) setAllStoryInfo(data);
  }, [fetchAllArray])

  useEffect(() => {
    console.log("storyData", getStoryInfoData)
    console.log("length", allStoryInfo.length)
  }, [getStoryInfoData])





  if (storiesIds === null) return <p>No data available</p>;
  if (storiesIds && storiesIds.error) return <p>Error: {storiesIds.error}</p>;
  if (getStoryInfoStatus === "error") return <p>Error: {getStoryInfoError.name + " " + getStoryInfoError.message}</p>
  if (!storiesIds || getStoryInfoStatus !== "success") return <p>Loading...</p>;

  return (
    <>
      {allStoryInfo && allStoryInfo.length > 0 && (
        allStoryInfo.map((story: any) => (
          // <Story  id={Number(id)}/>
          <p>hi {story.id}</p>
        )))
      }
    </>
  );
};

export default Stories;
