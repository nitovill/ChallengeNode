const { Router } = require("express");
const router = Router();
const verifyToken = require("../controlers/authControler");
const { Character, Movie, User } = require("../db");

router.get("/", verifyToken, async (req, res) => {
  var { name } = req.query;
  if (name) {
    const result = await Movie.findAll({ where: { name: name } });
    if (result) {
      return res.send(result);
    }
    return res.status(404).json({ message: "Movie not found" });
  }
});

module.exports = router;
