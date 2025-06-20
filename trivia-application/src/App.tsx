import Categories from "./components/categories";

const App = () => {
  const categories = Categories();

  if (categories === "loading" /* add other loading states here */) return <p>Loading...</p>
  if (categories === "error" /* add other error states here */) return <p>Error: Cannot load data</p>

  return (
    <>
      {categories && typeof categories === "object" && categories.length > 0 && (
        categories.map((cat: any) => (
          <p key={cat.id}>{cat.id}:  {cat.name}</p>
        )))
      }
    </>
  )
}

export default App
