import './App.css'
import { useQuery } from '@tanstack/react-query';
import Movie from './Components/movie';
import Nav, { NavItems } from './Components/nav';


function App() {
  const fetchBaseUrl = 'https://api.themoviedb.org/3'
  const childRoute = "/trending/all/week?"; //currently hardcoded, will change later
  const posterStartURL = 'https://image.tmdb.org/t/p/original'

  const {
    data: fetchData,
  } = useQuery({
    queryKey: ["fetchData"],
    queryFn: () =>
      fetch(`${fetchBaseUrl}${childRoute}language=en-US&api_key=${import.meta.env.VITE_API_KEY}`).then((res) => res.json()),
  });

  if (!fetchData) return <p>Loading...</p>;
  if (fetchData.success === false) return (
    <>
      <h2>Error:</h2>
      <p>{fetchData.status_message}</p>
    </>
  );



  const navItems: NavItems[] = [
    {
      name: "Trending",
      localUrl: "/",
      fetchUrl: "/trending/all/week?"
    },
    {
      name: "Top Rated",
      localUrl: "top_rated",
      fetchUrl: "/movie/top_rated?"
    },
    {
      name: "Action",
      localUrl: "action",
      fetchUrl: "/discover/movie?with_genres=28&"
    },
    {
      name: "Animation",
      localUrl: "animation",
      fetchUrl: "/discover/movie?with_genres=16&"
    },
    {
      name: "Comedy",
      localUrl: "comedy",
      fetchUrl: "/discover/movie?with_genres=35&"
    },
  ]

  return (
    <>
      <Nav navItems={navItems} />
      {fetchData.results.slice(0, 10).map((movie: any) => (
        <Movie
          key={movie.id}
          id={movie.id}
          name={movie.name ? movie.name : movie.title}
          date={movie.release_date ? movie.release_date : movie.first_air_date}
          posterPath={posterStartURL + movie.poster_path}
          overview={movie.overview} />
      ))}
    </>
  )
}

export default App
