import { useQuery } from "@tanstack/react-query";

const App = () => {
  let {
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    data: categoryData,
  } = useQuery({
    queryKey: ["categoryData"],
    queryFn: () =>
      fetch("https://opentdb.com/api_category.php").then((res) => res.json()),
  });
  categoryData = categoryData.trivia_categories;

  if (isLoadingCategory) return <p>Loading...</p>
  if (isErrorCategory) return <p>Error: Cannot load data</p>

  return (
    <>
      {categoryData && (categoryData.map((cat: any) => (
        <p>{cat.id}:  {cat.name}</p>
      )))}
    </>
  )
}

export default App
