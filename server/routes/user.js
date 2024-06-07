import { getUserById, getUsers } from "../crud.js";
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
        return res
          .status(200)
          .json({ status: 200, user: rows, message: "Successfully logged in" });
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
export default router;
