const { Router } = require("express");
const router = Router();
const verifyToken = require("../controlers/authControler");
const { Character, Movie, User } = require("../db");

router.get("/", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  var { name, ordering } = req.query;
  if (name) {
    const result = await Movie.findAll({ where: { name: name } });
    if (result) {
      return res.send(result);
    }
    return res.status(404).json({ message: "Movie not found" });
  }
  if (ordering) {
    const result = await Movie.findAll({
      order: [["creation_date", ordering]],
    });
    if (result) {
      return res.send(result);
    }
    return res.status(404).json({ message: "Movies not found" });
  }
  const result = await Movie.findAll();
  if (result) {
    return res.send(result);
  }
  return res.status(404).json({ message: "Movies not found" });
});

router.get("/:id", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  const response = await Movie.findByPk(req.params.id, {
    include: {
      model: Character,
      as: "charmov",
    },
  });
  if (response) {
    return res.send(response);
  }
  return res.status(404).json({ message: "movie not found" });
});
module.exports = router;
