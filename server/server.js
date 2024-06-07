import { config } from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";
import cookieParser from "cookie-parser";
import favoritesRouter from "./routes/favorites.js";
import usersRouter from "./routes/user.js";
import { createUser, getUserById } from "./crud.js";
config();

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/favorites", favoritesRouter);
app.use("/users", usersRouter);
app.options("*", cors(corsOptions));

async function getUserData(access_token) {
  const response = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );

  return response.data;
}
app.post("/google-auth", async (req, res) => {
  const { access_token } = req.body;
  console.log("endpoint working");
  try {
    const userData = await getUserData(access_token);
    getUserById(userData.sub, (err, rows) => {
      if (err) {
        console.log("Something broke checking if user exists");
        console.log(err);
      }
      if (!rows) {
        createUser(
          userData.sub,
          userData.email,
          userData.given_name,
          userData.picture,
          (err, data) => {
            if (err) {
              console.log("error creating user " + err);
            } else {
              console.log("user created " + data);
            }
          }
        );
      } else {
        console.log("user already existed");
      }
    });

    res.cookie("movie_search_user", userData.sub, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
      partitioned: true,
    });
    res.cookie("movie_search_loggedIn", true, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "None",
      httpOnly: false,
      secure: true,
      path: "/",
      partitioned: true,
    });
    res.status(200).send(userData);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.get("/", (req, res) => {
  res.cookie("movie_search_default", "default cookie", {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "none",
    secure: true,
    path: "/",
    partitioned: true,
  });
  res.status(200).send({ status: 200, message: "Server is working" });
});

app.get("/movies/:search", async (req, res) => {
  const response = await axios.get(
    `https://www.omdbapi.com/?s=${req.params.search}&apikey=22174c4a`
  );
  if (response.data.Search) {
    res.send(response.data);
  } else {
    res.send(response.data);
  }
});

app.get("/movie/:IMDb", async (req, res) => {
  const response = await axios.get(
    `https://www.omdbapi.com/?i=${req.params.IMDb}&plot=full&apikey=${process.env.MOVIE_API_KEY}`
  );
  res.send(response.data);
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`server is running on port ${PORT}`);
  } else {
    console.log("Error occured, server can't start", error);
  }
});
