import FavoritesButton from "../FavoritesButton/FavoritesButton";
import Loader from "../Loader/Loader";
import "./Dialog.css";
import { forwardRef, useEffect } from "react";

const Dialog = forwardRef(function Dialog(
  {
    toggleDialog,
    movieInfo,
    isLoading,
    favorites,
    setFavorites,
    isFavorite,
    setIsFavorite,
  },
  ref
) {
  return (
    <dialog
      className=" dialog text-white rounded-xl"
      ref={ref}
      onClick={(event) => {
        if (event.currentTarget == event.target) {
          toggleDialog();
        }
      }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="z-10 fixed ">
            <FavoritesButton
              imdbID={movieInfo.imdbID}
              Poster={movieInfo.Poster}
              Title={movieInfo.Title}
              favorites={favorites}
              setFavorites={setFavorites}
              isFavorite={isFavorite}
              setIsFavorite={setIsFavorite}
            />
          </div>
          <div className="poster md:rounded-l-xl sm:rounded-t-none rounded-t-xl ">
            <img
              src={movieInfo.Poster}
              className="md:rounded-l-xl sm:rounded-t-none rounded-t-xl "
            />
          </div>

          <div className="p-5 flex flex-col gap-9 movie-info relative">
            <h2 className="text-3xl text-center font-bold">
              {movieInfo.Title}
              <span className=" block text-sm font-normal">
                Released {movieInfo.Released}
              </span>
            </h2>
            <h4 className="text-lg">
              Directors:
              <span className="block">{movieInfo.Director}</span>
            </h4>
            <p className=" text-start plot">
              <span className="block">Plot:</span>
              {movieInfo.Plot}
            </p>
            {movieInfo?.Ratings?.map((rating, id) => (
              <h5 key={id} className="text-sm inline">
                {rating.Source}
                <span className="float-right ">{rating.Value}</span>
              </h5>
            ))}
          </div>
          <div className="absolute right-6 top-1">
            <button className="  font-bold close-btn " onClick={toggleDialog}>
              X
            </button>
          </div>
        </>
      )}
    </dialog>
  );
});
export default Dialog;
