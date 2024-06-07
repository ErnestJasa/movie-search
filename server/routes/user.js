import {
  getUserById,
  getUsers,
  deleteUser,
  deleteUserFavorites,
} from "../crud.js";
import { Router } from "express";
const router = Router();
router.get("/login", (req, res) => {
  const userId = req.cookies.movie_search_user;
  console.log(userId);
  if (userId) {
    getUserById(userId, (err, rows) => {
      if (err) {
        res.status(500).send({ status: 500, message: err.message });
      } else {
        console.log(rows);
        if (rows) {
          return res.status(200).send({
            status: 200,
            user: rows,
            message: "Successfully logged in",
          });
        } else {
          res.clearCookie("movie_search_user", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            path: "/",
            partitioned: true,
          });
          return res
            .status(404)
            .send({ status: 404, message: "User not found" });
        }
      }
    });
  } else {
    return res.status(403).send({ status: 403, message: "Access denied" });
  }
});

router.post("/logout", (req, res) => {
  const userId = req.cookies.movie_search_user;
  if (userId) {
    res.clearCookie("movie_search_user");
    res.status(200).send({ status: 200, message: "Successfully logged out" });
  } else {
    res.status(403).send({ status: 403, message: "Forbidden" });
  }
});

router.delete("/", (req, res) => {
  const userId = req.cookies.movie_search_user;
  if (userId) {
    deleteUserFavorites(userId, (err) => {
      if (err) {
        return res.status(500).send({ status: 500, message: err.message });
      } else {
        deleteUser(userId, (err, changes) => {
          if (err) {
            return res.status(500).send({ status: 500, message: err.message });
          }
          if (changes === 0) {
            return res.status(404).send({
              status: 404,
              message: "User not found or no data to delete",
            });
          }
          res.clearCookie("movie_search_user", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            path: "/",
            partitioned: true,
          });
          res.status(200).send({ status: 200, message: "User data deleted" });
        });
      }
    });
  } else {
    res.status(403).send({ status: 403, message: "Forbidden" });
  }
});
export default router;
