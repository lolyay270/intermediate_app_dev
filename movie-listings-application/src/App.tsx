import './App.css'
import { useQuery } from '@tanstack/react-query';
import Movie from './Components/movie';
import Nav, { NavProps } from './Components/nav';


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
