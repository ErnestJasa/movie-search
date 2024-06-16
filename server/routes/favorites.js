import { Router } from "express";
import {
  createMovie,
  addMovieToFavorites,
  getMovieByImdbID,
  getFavorites,
  removeMovieFromFavorites,
} from "../services.js";

const router = Router();

// FAVORITES
router.get("/", (req, res) => {
  //   const userId = req.params.userId;
  const userId = req.cookies.movie_search_user;
  if (userId) {
    getFavorites(userId, (err, rows) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (rows) {
        return res
          .status(200)
          .send({ status: 200, message: "Favorite movies", movies: rows });
      } else {
        return res
          .status(404)
          .send({ status: 404, message: "Favorites not found" });
      }
    });
  } else {
    return res.status(403).send({ status: 403, message: "Forbidden" });
  }
});
router.post("/", (req, res) => {
  // const userId = req.params.userId;
  const userId = req.cookies.movie_search_user;
  console.log("user id " + userId);
  const { imdbID, Title, Poster } = req.body;
  let movie = req.body;
  console.log(req.cookies.movie_search_user);
  if (userId) {
    getMovieByImdbID(imdbID, (err, rows) => {
      if (err) {
        console.log(err);
      }
      if (!rows) {
        createMovie(imdbID, Title, Poster, (err) => {
          if (err) {
            res.status(500).send({ status: 500, message: err.message });
          }
        });
      } else {
        movie = rows;
      }
      addMovieToFavorites(userId, imdbID, (err) => {
        if (err) {
          if (
            err.message ===
            "SQLITE_CONSTRAINT: UNIQUE constraint failed: user_movies.user_id, user_movies.movie_id"
          ) {
            return res.status(409).send({
              status: 409,
              message: `Movie with imdb: ${imdbID} already exists in favorites`,
              movie: movie,
            });
          } else {
            return res.status(500).send({
              status: 500,
              message: err.message,
            });
          }
        } else {
          console.log("added to favorites");
          res.status(200).send({
            status: 200,
            message: `added ${imdbID} movie to favorites`,
            movie: movie,
          });
        }
      });
    });
  } else {
    return res.status(403).send({ status: 403, message: "Forbidden" });
  }
});
router.delete("/:imdbID", (req, res) => {
  // const userId = req.params.userId;
  const userId = req.cookies.movie_search_user;
  const imdbID = req.params.imdbID;
  if (userId) {
    getMovieByImdbID(imdbID, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send({ status: 500, message: "Internal error" });
      }
      if (!rows) {
        console.log("movie not found");
        res.status(404).send({ status: 404, message: "Movie not found" });
      } else {
        let movie = rows;
        removeMovieFromFavorites(userId, imdbID, (err, rows) => {
          if (err) {
            res.status(500).send({ status: 500, message: err.message });
          } else {
            if (rows === 0) {
              console.log("movie not found in favorites");
              res
                .status(404)
                .send({ status: 404, message: "Movie not found in favorites" });
            } else {
              console.log("movie removed");
              res.status(200).send({
                status: 200,
                message: "Successfully removed movie",
                movie: movie,
              });
            }
          }
        });
      }
    });
  } else {
    return res.status(403).send({ status: 403, message: "Forbidden" });
  }
});

export default router;
