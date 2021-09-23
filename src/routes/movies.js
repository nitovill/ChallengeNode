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
//Create a new movie
router.post("/", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  const { name, image, creation_date, score, characters } = req.body;
  const newmovie = await Movie.create({
    name,
    id: uuidv4(),
    image,
    creation_date: creation_date,
    score,
  });
  if (characters) {
    characters.map((char) => {
      newmovie.setCharmov(char);
    });
  }
  res.send(newmovie);
});

router.put("/:id", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  const { name, image, creation_date, score, characters } = req.body;
  /*   Character.update(
    { name, weight, image, history, age },
    { where: { id: req.params.id } }
  )
    .then((result) => res.send(result))
    .catch((err) => next(err));
 */
  Movie.findOne({ where: { id: req.params.id } })
    .then((record) => {
      if (!record) {
        throw new Error("No record found");
      }
      let values = {
        name,
        image,
        creation_date,
        score,
      };

      record.update(values).then((updatedRecord) => {
        characters.map((char) => {
          updatedRecord.setCharmov(char);
        });
        res.send(updatedRecord);
      });
    })
    .catch((error) => {
      // do seomthing with the error
      throw new Error(error);
    });
});
router.delete("/:id", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  Movie.destroy({ where: { id: req.params.id } })
    .then((rowDeleted) => {
      if (rowDeleted === 1) {
        return res.send("Deleted successfully");
      }
      res.send("Character not found");
    })
    .catch((error) => {
      throw new Error(error);
    });
});
module.exports = router;
