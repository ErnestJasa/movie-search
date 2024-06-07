import db from "./database.js";

// USER
export function createUser(id, email, given_name, picture, callback) {
  console.log("creating user");
  const sql = `INSERT INTO users (id, email, given_name, picture) VALUES (?, ?, ?, ?)`;
  db.run(sql, [id, email, given_name, picture], function (err) {
    callback(err, { id: this.lastID });
  });
  console.log("created user");
}

export function getUserById(id, callback) {
  const sql = `SELECT * FROM users
    WHERE id = ?`;
  db.get(sql, [id], callback);
}

export function getUsers(callback) {
  const sql = `SELECT * FROM users`;
  db.all(sql, [], callback);
}

export function deleteUser(id, callback) {
  const sql = `DELETE FROM users
    WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, this.changes);
  });
}

//MOVIE
export function createMovie(imdbID, title, poster, callback) {
  const sql = `INSERT INTO movies (imdbID, Title, Poster) VALUES (?, ?, ?)`;
  db.run(sql, [imdbID, title, poster], function (err) {
    callback(err, { id: this.lastID });
  });
}

export function getMovies(callback) {
  const sql = `SELECT * FROM movies`;
  db.all(sql, [], callback);
}

export function getMovieByImdbID(imdbID, callback) {
  const sql = `SELECT * FROM movies 
    WHERE imdbID = ?
  `;
  db.get(sql, [imdbID], callback);
}

// FAVORITES
export function getFavorites(userId, callback) {
  const sql = `
    SELECT m.imdbID, m.Title, m.Poster FROM movies m
    JOIN user_movies um ON m.imdbID = um.movie_id
    WHERE um.user_id = ?`;
  db.all(sql, userId, callback);
}

export function addMovieToFavorites(userId, imdbID, callback) {
  const sql = `INSERT INTO user_movies (user_id, movie_id) VALUES (?, ?)`;
  db.run(sql, [userId, imdbID], callback);
}

export function removeMovieFromFavorites(userId, imdbID, callback) {
  const sql = `DELETE FROM user_movies WHERE user_id = ? AND movie_id = ?`;
  db.run(sql, [userId, imdbID], function (err) {
    callback(err, this.changes);
  });
}

export function deleteUserFavorites(userId, callback) {
  const sql = `DELETE FROM user_movies WHERE user_id = ?`;
  db.run(sql, [userId], callback);
}
