import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "./main";
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';

import Movie from './Components/Movie.tsx';
import { NavItems } from './Components/Nav.tsx';


export const navItems: NavItems[] = [
  {
    name: "Trending",
    localUrl: "/trending",
    fetchUrl: "/trending/all/week?"
  },
  {
    name: "Top Rated",
    localUrl: "/top_rated",
    fetchUrl: "/movie/top_rated?"
  },
  {
    name: "Action",
    localUrl: "/action",
    fetchUrl: "/discover/movie?with_genres=28&"
  },
  {
    name: "Animation",
    localUrl: "/animation",
    fetchUrl: "/discover/movie?with_genres=16&"
  },
  {
    name: "Comedy",
    localUrl: "/comedy",
    fetchUrl: "/discover/movie?with_genres=35&"
  },
]

function App() {
  let currentRoute = useLocation();

  //default route is trending
  if (currentRoute.pathname === '/') {
    return <Navigate to="/trending" replace />
  }

  const fetchBaseUrl = 'https://api.themoviedb.org/3'
  const [fullFetchUrl, setFullFetchUrl] = useState(``);
  const posterStartURL = 'https://image.tmdb.org/t/p/original'

  let {
    data: fetchData,
  } = useQuery({
    queryKey: ["fetchData"],
    queryFn: () =>
      fetch(fullFetchUrl).then((res) => res.json()),
  });

  const { mutate: getMoviesMutation, data: getMoviesData } = useMutation({
    mutationFn: () =>
      fetch(fullFetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          fetchData = getMoviesData;
        }
        return res.json()
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["fetchData"],
      }),
  });

  //whenever the path changes, refetch the data
  useEffect(() => {
    navItems.forEach(nav => {
      if (nav.localUrl == currentRoute.pathname)
        setFullFetchUrl(`${fetchBaseUrl}${nav.fetchUrl}language=en-US&api_key=${import.meta.env.VITE_API_KEY}`);
    });
    getMoviesMutation();
  }, [currentRoute])



  if (!fetchData) return <p>Loading...</p>;
  if (fetchData.success === false) return (
    <>
      <h2>Error:</h2>
      <p>{fetchData.status_message}</p>
      {
        fetchData.status_code === 7 &&      //sometimes the API key is correct but it complains until you open the fetch url in a browser
        <p>If API Key error is unexpected, please open <a href={fullFetchUrl} target='_blank'>the fetch data</a> then check this page again</p>
      }
    </>
  );

  

  return (
    <div className="bg-slate-600">
      <div className='box-content grid grid-cols-5 gap-4 p-4'>
        {fetchData.results.slice(0, 10).map((movie: any) => (
          <Movie
            key={movie.id}
            id={movie.id}
            name={movie.name ? movie.name : movie.title}
            date={movie.release_date ? movie.release_date : movie.first_air_date}
            posterPath={posterStartURL + movie.poster_path}
            overview={movie.overview} />
        ))}
      </div>
    </div>
  )
}

export default App
