import { useQuery } from "@tanstack/react-query";


const Categories = () => {
  let {
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    data: categoryData,
  } = useQuery({
    queryKey: ["categoryData"],
    queryFn: () =>
      fetch("https://opentdb.com/api_category.php").then((res) => res.json()),
  });


  if (isLoadingCategory) return "loading";
  if (isErrorCategory) return "error";
  if (categoryData) return categoryData.trivia_categories;
}

export default Categories;