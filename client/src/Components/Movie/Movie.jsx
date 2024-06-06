import "./Movie.css";
import { useRef, useState } from "react";
import Dialog from "../Dialog/Dialog";
import FavoritesButton from "../FavoritesButton/FavoritesButton";
import Loader from "../Loader/Loader";

function Movie({ title, imdbID, poster, favorites }) {
  const [movieInfo, setMovieInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(
    favorites.current?.some((x) => x.imdbID === imdbID)
  );

  const dialogRef = useRef(null);

  async function getInfo(e) {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${
        import.meta.env.VITE_APP_MOVIE_API_KEY
      }`
      // `${import.meta.env.VITE_APP_API_ADDRESS}movie/${imdbID}`
    );
    const data = await response.json();
    setMovieInfo(data);
    setIsLoading(false);
    toggleDialog();
  }

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  return poster === "N/A" ? (
    ""
  ) : (
    <>
      <div className=" w-[275px] text-center relative card cursor-pointer rounded-xl h-[400px]">
        {isLoading ? <Loader /> : ""}
        <div className="absolute text-4xl">
          <FavoritesButton
            imdbID={imdbID}
            Poster={poster}
            Title={title}
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
            favorites={favorites}
          />
        </div>
        <div onClick={getInfo} className="w-full h-full">
          <img
            className=" object-fill rounded-xl w-full h-full"
            src={poster}
            alt={title}
          />
          <div className="title-backdrop"></div>
          <h3 className="title">{title}</h3>
        </div>
      </div>

      <Dialog
        toggleDialog={toggleDialog}
        movieInfo={movieInfo}
        ref={dialogRef}
        isLoading={isLoading}
        favorites={favorites}
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
      />
    </>
  );
}
export default Movie;
