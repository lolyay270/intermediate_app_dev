import './App.css'
import { useQuery } from '@tanstack/react-query';
import Movie from './Components/movie';
import Nav, { NavProps } from './Components/nav';


function App() {
  const childRoute = "/trending/all/week"; //currently hardcoded, will change later
  const posterStartURL = 'https://image.tmdb.org/t/p/original'

  const {
    isLoading,
    error,
    data: fetchData,
  } = useQuery({
    queryKey: ["movieData"],
    queryFn: () =>
      fetch(`https://api.themoviedb.org/3${childRoute}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`).then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;


  // The endpoints for the movie types are as follows:
  // Trending -   https://api.themoviedb.org/3/trending/all/week?api_key=<API KEY>&language=en-US
  // Top Rated -  https://api.themoviedb.org/3/movie/top_rated?api_key=<API KEY>&language=en-US
  // Action -     https://api.themoviedb.org/3/discover/movie?api_key=<API KEY>&with_genres=28
  // Animation -  https://api.themoviedb.org/3/discover/movie?api_key=<API KEY>&with_genres=16
  // Comedy -     https://api.themoviedb.org/3/discover/movie?api_key=<API KEY>&with_genres=35
  const navItems = [
    {
      name: "hi",
      url: "/hi"
    },
    {
      name: "h2",
      url: "/h2"
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
