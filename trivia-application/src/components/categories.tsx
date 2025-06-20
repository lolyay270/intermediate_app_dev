import { useQuery } from "@tanstack/react-query";


const Categories = () => {
  const {
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
  if (categoryData && categoryData.trivia_categories && categoryData.trivia_categories.length > 0) {
    let categories: any[] = [ 
      {
        id: 0,
        name: "Any",
      }
    ]
    return categories.concat(categoryData.trivia_categories);
  }
}

export default Categories;