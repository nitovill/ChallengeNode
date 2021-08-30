const { Router } = require("express");
const router = Router();
const axios = require("axios");
const { Character, Movie, User } = require("../db");
const verifyToken = require("../controlers/authControler");
const { v4: uuidv4 } = require("uuid");

router.get("/", verifyToken, async (req, res, next) => {
  const currentPage = req.params.currentPage || 1;
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  const api = axios(`https://api.disneyapi.dev/characters?page=${currentPage}`);
  const db = Character.findAll({
    include: {
      model: Movie,
      as: "charmov",
    },
  });
  Promise.all([api, db])
    .then((resp) => {
      const [apichars, dbchars] = resp;
      const response = dbchars.concat(apichars.data.data);
      // const limitedList = response.slice(0, 8);
      var characters = [];
      response.map((char) => {
        var nuevo = {
          name: char.name,
          image: char.imageUrl || char.image,
        };
        characters.push(nuevo);
      });
      return res.json(characters);
    })
    .catch((err) => next(err));
});
router.post("/create", async (req, res) => {
  const { name, image, weight, history, age, movies } = req.body;
  const newcharacter = await Character.create({
    name,
    weight,
    id: uuidv4(),
    image,
    history,
    age,
  });
  movies.map((mov) => {
    newcharacter.setCharmov(mov);
  });
  res.send(newcharacter);
});

router.post("/edit", async (req, res) => {
  const { name, image, weight, history, age, movies } = req.body;
  const newcharacter = await Character.create({
    name,
    weight,
    id: uuidv4(),
    image,
    history,
    age,
  });
  movies.map((mov) => {
    newcharacter.setCharmov(mov);
  });
  res.send(newcharacter);
});

module.exports = router;
