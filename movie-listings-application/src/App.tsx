import './App.css'
import { useQuery } from '@tanstack/react-query';
import Card, { CardProps } from './Components/card';


function App() {
  const childRoute = "/trending/all/week"; //currently hardcoded, will change later
  const movieStartURL = 'https://image.tmdb.org/t/p/original'

  const {
    isLoading,
    error,
    data: fetchData,
  } = useQuery({
    queryKey: ["movieData"],
    queryFn: () =>
      fetch(`https://api.themoviedb.org/3${childRoute}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`).then((res) => res.json()),
  });

  //create new array of data that only holds 10 items, and that only has the info needed
  let movieData: CardProps[] = [];
  for (let i = 0; i < 10; i++) {
    let movie: CardProps = {
      id: fetchData.results[i].id,
      name: fetchData.results[i].name ? fetchData.results[i].name : fetchData.results[i].title, // movies and tv shows have dif var names
      date: fetchData.results[i].release_date ? fetchData.results[i].release_date : fetchData.results[i].first_air_date,
      posterPath: fetchData.results[i].poster_path,
      overview: fetchData.results[i].overview,
    };
    movieData.push(movie);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      {movieData.map((movie: CardProps) => (
        <Card 
          key={movie.id} 
          id={movie.id} 
          name={movie.name}
          date={movie.date}
          posterPath={movieStartURL + movie.posterPath}
          overview={movie.overview}/>
      ))}
    </>
  )
}

export default App
