import sqlite3 from "sqlite3";
sqlite3.verbose();
const dbName = "favoriteMovies.db";

export let db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to Database");
  }
});

db.serialize(() => {
  db.run(
    `
        CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        given_name TEXT,
        picture TEXT
      )
    `,
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("users table created or existed");
      }
    }
  );
  db.run(
    `
        CREATE TABLE IF NOT EXISTS movies (
        imdbID TEXT PRIMARY KEY NOT NULL,
        Title TEXT NOT NULL,
        Poster TEXT NOT NULL)      
    `,
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("movies table created or existed");
      }
    }
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS user_movies (
    user_id TEXT NOT NULL,
    movie_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ,
    FOREIGN KEY (movie_id) REFERENCES movies(imdbID)
    PRIMARY KEY (user_id, movie_id)
  )`,
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("user+movies table created");
      }
    }
  );
});

export default db;
