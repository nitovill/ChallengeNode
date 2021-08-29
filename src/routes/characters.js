const { Router } = require("express");
const router = Router();
const axios = require("axios");
const { Character, Movie, User } = require("../db");
const verifyToken = require("../controlers/authControler");

router.get("/", verifyToken, async (req, res, next) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  const api = axios(`https://api.disneyapi.dev/characters`);
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

module.exports = router;
