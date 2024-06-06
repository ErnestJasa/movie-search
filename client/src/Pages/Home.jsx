import Search from "../Components/Search/Search";
import Movies from "../Components/Movies/Movies";
import { useState } from "react";
function Home() {
  const [movies, setMovies] = useState();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch(
      // `https://www.omdbapi.com/?s=${search}&apikey=${
      //   import.meta.env.VITE_APP_MOVIE_API_KEY
      // }`
      `${import.meta.env.VITE_APP_API_ADDRESS}movies/${search}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      setMovies(null);
      setError(data.Error);
    } else {
      setMovies(data.Search);
    }
    setIsLoading(false);
  }
  return (
    <>
      <Search setSearch={setSearch} handleSearch={handleSearch} />
      <Movies isLoading={isLoading} movies={movies} error={error} />
    </>
  );
}
export default Home;
