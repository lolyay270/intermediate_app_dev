import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { queryClient } from "./main";

const App = () => {
  const fetchUrlBase = "https://hacker-news.firebaseio.com/v0/";
  const [fetchUrl, setFetchUrl] = useState("");

  const {
    data: storyData,
  } = useQuery({
    queryKey: ["storyData"],
    queryFn: () =>
      fetch(fetchUrlBase + fetchUrl).then((res) => res.json()),
  });

  const { mutate: getStoryMutation, data: getStoryData } =
  useMutation({
    mutationFn: () =>
      fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["storyData"],
      }),
  });


  if (storyData === null) return <p>No data available</p>;
  if (storyData && !Array.isArray(storyData)) return <p>Loading...</p>;
  if (storyData && storyData.error) return <p>{storyData.error}</p>;

  return (
    <>
      {storyData && storyData.length > 0 && (
        <p>{storyData.toString()}</p>
      )}
    </>
  );
};

export default App;