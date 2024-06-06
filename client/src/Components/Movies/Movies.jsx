import { useEffect, useRef, useState } from "react";
import Movie from "../Movie/Movie";
import Loader from "../Loader/Loader";
import Favorites from "./../../Pages/Favorites";

function Movies({ movies, isLoading, error }) {
  // let favorites = JSON.parse(localStorage.getItem("favorites"));
  let favorites = useRef();
  favorites.current = JSON.parse(localStorage.getItem("favorites"));
  // console.log(favorites);
  return (
    <>
      <div className="flex justify-center items-center flex-col content-center relative">
        {isLoading ? <Loader /> : ""}

        <div className="flex w-[70%] sm:w-[90%] md:w-[80%] lg:w-[70%] justify-center items-center gap-5 sm:gap-8 flex-wrap py-5 mb-10 ">
          {movies && movies.length !== 0 ? (
            movies?.map((movie) => (
              <Movie
                favorites={favorites}
                key={movie.imdbID}
                title={movie.Title}
                imdbID={movie.imdbID}
                poster={movie.Poster}
              />
            ))
          ) : (
            <h1 className=" text-3xl">{error}</h1>
          )}
        </div>
      </div>
    </>
  );
}
export default Movies;
