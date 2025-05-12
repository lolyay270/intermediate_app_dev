import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryClient } from "../main";
import { navItems } from "./Nav";

interface StoriesProps {
  localUrl: String;
}

const Stories: React.FC<StoriesProps> = (props: StoriesProps) => {
  const fetchUrlBase = "https://hacker-news.firebaseio.com/v0";
  const [fetchUrl, setFetchUrl] = useState("");
  const [movieTitles, setMovieTitles] = useState([]);

  let { data: storiesCodes } = useQuery({
    queryKey: ["storyData"],
    queryFn: () => fetch(fetchUrl).then((res) => res.json()),
  });

  const { mutate: getStoryMutation, data: getStoryData } = useMutation({
    mutationFn: () =>
      fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        storiesCodes = getStoryData;
        res.json();
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["storyData"],
      }),
  });

  //whenever the path changes, refetch the data
  useEffect(() => {
    navItems.forEach((nav) => {
      if (nav.localUrl == props.localUrl)
        setFetchUrl(fetchUrlBase + nav.fetchUrl);
    });
    getStoryMutation();
  }, [props.localUrl]);

  console.log("storiesCodes", storiesCodes)
  console.log("movieTitles", movieTitles)

  if (storiesCodes === null) return <p>No data available</p>;
  if (storiesCodes && storiesCodes.error) return <p>Error: {storiesCodes.error}</p>;
  if (!storiesCodes) return <p>Loading...</p>;

  return (
    <>
      {movieTitles && movieTitles.length > 0 && (
        <p>
          {movieTitles.map((title: any) => (
            title
          ))}
        </p>
      )}
      <p>hi</p>
    </>
  );
};

export default Stories;
