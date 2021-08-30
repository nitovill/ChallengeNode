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
router.post("/", async (req, res) => {
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

router.put("/:id", async (req, res) => {
  const { name, image, weight, history, age, movies } = req.body;
  /*   Character.update(
    { name, weight, image, history, age },
    { where: { id: req.params.id } }
  )
    .then((result) => res.send(result))
    .catch((err) => next(err));
 */
  Character.findOne({ where: { id: req.params.id } })
    .then((record) => {
      if (!record) {
        throw new Error("No record found");
      }
      let values = {
        name,
        image,
        weight,
        history,
        age,
      };

      record.update(values).then((updatedRecord) => {
        movies.map((mov) => {
          updatedRecord.setCharmov(mov);
        });
        res.send(updatedRecord);
      });
    })
    .catch((error) => {
      // do seomthing with the error
      throw new Error(error);
    });
});
router.delete("/:id", async (req, res) => {
  Character.destroy({ where: { id: req.params.id } })
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
