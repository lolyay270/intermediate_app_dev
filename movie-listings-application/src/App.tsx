import './App.css'
import { useQuery } from '@tanstack/react-query';
import Movie from './Components/movie';


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

  return (
    <>
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
