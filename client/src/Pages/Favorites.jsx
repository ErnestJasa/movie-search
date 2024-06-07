import { useContext, useEffect, useRef, useState } from "react";
import Movies from "../Components/Movies/Movies";
import { AppContext } from "../Context/AppContext";

function Favorites() {
  // const moviesFromLocalStorage = useRef();
  let moviesFromLocalStorage =
    JSON.parse(localStorage.getItem("favorites")) ?? [];

  const [moviesFromServer, setMoviesFromServer] = useState([]);
  // const [mergedMovies, setMergedMovies] = useState([]);
  let mergedMovies = mergeMovies();
  const { loggedIn } = useContext(AppContext);

  function mergeMovies() {
    const uniqueArray = [];
    const combinedArray = moviesFromLocalStorage.concat(moviesFromServer);
    const seenKeys = new Set();
    combinedArray.forEach((item) => {
      const keyValue = item["imdbID"];
      if (!seenKeys.has(keyValue)) {
        seenKeys.add(keyValue);
        uniqueArray.push(item);
      }
    });
    localStorage.setItem("favorites", JSON.stringify(uniqueArray));
    return uniqueArray;
  }

  async function postFavoritesFromLocal(movie) {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_ADDRESS}favorites/`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(movie),
      }
    );
    const data = await response.json();
    console.log("response from posting movie: ", data);
  }

  useEffect(() => {
    async function getFavoritesFromServer() {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_ADDRESS}favorites/`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setMoviesFromServer(data.movies);
      } else {
        setMoviesFromServer([]);
      }
    }
    if (loggedIn) {
      getFavoritesFromServer();
    }
  }, [loggedIn]);
  useEffect(() => {
    if (
      moviesFromLocalStorage &&
      moviesFromLocalStorage.length !== 0
      // &&
      // moviesFromServer.length !== 0
    ) {
      moviesFromLocalStorage.forEach((movieFromLocalStorage) => {
        if (
          !moviesFromServer.some(
            (movie) => movie.imdbID === movieFromLocalStorage.imdbID
          )
        ) {
          if (loggedIn) {
            postFavoritesFromLocal(movieFromLocalStorage);
          }
        }
      });
    }
  }, [moviesFromServer]);

  const error =
    mergedMovies === undefined ||
    mergedMovies === null ||
    mergedMovies.length === 0
      ? "No favorites found."
      : "";
  return <Movies isLoading={false} movies={mergedMovies} error={error} />;
}
export default Favorites;
