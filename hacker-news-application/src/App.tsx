import { useQuery } from "@tanstack/react-query";

const App = () => {
  const {
    data: storyData,
  } = useQuery({
    queryKey: ["storyData"],
    queryFn: () =>
      fetch("https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty").then((res) => res.json()),
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