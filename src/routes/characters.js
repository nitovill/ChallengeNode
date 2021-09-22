const { Router } = require("express");
const router = Router();
const axios = require("axios");
const { Character, Movie, User } = require("../db");
const verifyToken = require("../controlers/authControler");
const { v4: uuidv4 } = require("uuid");

router.get("/", verifyToken, async (req, res, next) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  var { name, age, movie, weight } = req.query;

  if (name) {
    const namemin = name.toLowerCase();
    function filtrar(char) {
      const charname = char.name.toLowerCase();
      return charname.includes(namemin);
    }
    /*     const api = axios(`https://api.disneyapi.dev/characters`);
     */ Character.findAll({
      include: {
        model: Movie,
        as: "charmov",
      },
    }).then((chardb) => {
      const response = chardb.filter(filtrar);
      return res.send(response);
    });
    /*    Promise.all([api, db]).then((resp) => {
      const [charapi, chardb] = resp;
      
      const apifiltrados = charapi.data.data.filter(filtrar);
      const response = dbfiltrados.concat(apifiltrados);
      if (response.length === 0) {
        return res.send([]);
      } else {
        // const limitedList = response.slice(0, 8);
        return res.json(response);
      }
    }); */
  }
  if (age) {
    function filtrarAge(char) {
      return char.age == age;
    }
    //const api = axios(`https://api.disneyapi.dev/characters`);
    Character.findAll().then((chardb) => {
      const response = chardb.filter(filtrarAge);
      return res.send(response);
    });
    /* Promise.all([api, db]).then((resp) => {
      const [charapi, chardb] = resp;
      const dbfiltrados = chardb.filter(filtrarage);
      const apifiltrados = charapi.data.data.filter(filtrarage);
      const response = dbfiltrados.concat(apifiltrados);
      if (response.length === 0) {
        return res.send([]);
      } else {
        // const limitedList = response.slice(0, 8);
        return res.json(response);
      }
    }); */
  }
  if (weight) {
    function filtrarWeight(char) {
      return char.weight == weight;
    }
    //const api = axios(`https://api.disneyapi.dev/characters`);
    Character.findAll().then((chardb) => {
      const response = chardb.filter(filtrarWeight);
      return res.send(response);
    });
    /* Promise.all([api, db]).then((resp) => {
      const [charapi, chardb] = resp;
      const dbfiltrados = chardb.filter(filtrarweight);
      const apifiltrados = charapi.data.data.filter(filtrarweight);
      const response = dbfiltrados.concat(apifiltrados);
      if (response.length === 0) {
        return res.send([]);
      } else {
        // const limitedList = response.slice(0, 8);
        return res.json(response);
      }
    }); */
  }
  if (movie) {
    Movie.findAll({
      where: { id: movie },
      include: {
        model: Character,
        as: "charmov",
      },
    }).then((resp) => {
      return res.send(resp);
    });
  }

  /*
  const currentPage = req.params.currentPage || 1;
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
    .catch((err) => next(err));*/
  Character.findAll({ include: { model: Movie, as: "charmov" } }).then(
    (resp) => {
      res.send(resp);
    }
  );
});
router.post("/", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
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

router.put("/:id", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
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
router.delete("/:id", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
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
router.get("/:id", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  const character = await Character.findByPk(req.params.id, {
    include: {
      model: Movie,
      as: "charmov",
    },
  });
  res.send(character);
});

module.exports = router;
