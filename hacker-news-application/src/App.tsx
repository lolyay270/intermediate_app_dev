import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { queryClient } from "./main";
import { navItems } from "./Components/Nav";

const App = () => {
  let currentRoute = useLocation();

  const fetchUrlBase = "https://hacker-news.firebaseio.com/v0";
  const [fetchUrl, setFetchUrl] = useState("");

  let { data: storyData } = useQuery({
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
        storyData = getStoryData;
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
      if (nav.localUrl == currentRoute.pathname)
        setFetchUrl(fetchUrlBase + nav.fetchUrl);
    });
    getStoryMutation();
  }, [currentRoute]);



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
