import { useContext, useState } from "react";
import FavoriteSvg from "../../assets/FavoriteSvg";
import "./FavoritesButton.css";
import { AppContext } from "../../Context/AppContext";

function FavoritesButton({
  imdbID,
  Poster,
  Title,
  favorites,
  isFavorite,
  setIsFavorite,
}) {
  const movieInfo = { imdbID, Poster, Title };
  const { loggedIn } = useContext(AppContext);
  function postFavorite() {
    fetch(`${import.meta.env.VITE_APP_API_ADDRESS}favorites`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(movieInfo),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  function deleteFavorite() {
    fetch(
      `${import.meta.env.VITE_APP_API_ADDRESS}favorites/${movieInfo.imdbID}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
  function addToFavorites() {
    let newFavorites = favorites.current;
    if (newFavorites !== null) {
      if (isFavorite) {
        const index = newFavorites.findIndex(
          (x) => x.imdbID === movieInfo.imdbID
        );
        newFavorites.splice(index, 1);
        if (loggedIn) {
          deleteFavorite();
        }
        setIsFavorite(false);
      } else {
        newFavorites = [...favorites.current, movieInfo];
        if (loggedIn) {
          postFavorite();
        }
        setIsFavorite(true);
      }
    } else {
      newFavorites = [movieInfo];
      setIsFavorite(true);
    }
    favorites.current = newFavorites;
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  }

  return (
    <button onClick={addToFavorites}>
      <FavoriteSvg
        width={40}
        className={`hover:opacity-100 opacity-75  ${
          isFavorite
            ? " fill-rose-800 hover:fill-rose-600 svg-shadow"
            : " fill-gray-200 hover:fill-white svg-shadow"
        }`}
      />
    </button>
  );
}
export default FavoritesButton;
