const { Sequelize } = require("sequelize");
const config = require("../lib/config");
const CharacterF = require("./models/Character");
const GenreF = require("./models/Genre");
const MovieF = require("./models/Movie");

const sequelize = new Sequelize(
  `postgres://${config.dbUser}:${config.dbPassword}@${config.dbHost}/${config.dbName}`,
  {
    logging: false,
    native: false,
  }
);

const Character = CharacterF(sequelize);
const Genre = GenreF(sequelize);
const Movie = MovieF(sequelize);

Character.belongsToMany(Movie, {
  through: "character_movie",
  as: "charmov",
});
Movie.belongsToMany(Character, {
  through: "character_movie",
  as: "charmov",
});
Genre.belongsToMany(Movie, {
  through: "genre_movie",
  as: "genremov",
});
Movie.belongsToMany(Genre, {
  through: "genre_movie",
  as: "genremov",
});

module.exports = {
  Character,
  Genre,
  Movie,
  conn: sequelize,
};
