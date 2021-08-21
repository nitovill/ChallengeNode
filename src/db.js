const { Sequelize } = require("sequelize");
const config = require("../lib/config");
const DogS = require("./models/Dog");
const TemperamentS = require("./models/Temperament");

console.log(config.dbPassword, config.dbUser);
const sequelize = new Sequelize(
  `postgres://${config.dbUser}:${config.dbPassword}@${config.dbHost}/${config.dbName}`,
  {
    logging: false,
    native: false,
  }
);

const Dog = DogS(sequelize);
const Temperament = TemperamentS(sequelize);

Dog.belongsToMany(Temperament, {
  through: "dog_temperament",
  as: "temperament",
});
Temperament.belongsToMany(Dog, {
  through: "dog_temperament",
  as: "temperament",
});

module.exports = {
  Dog,
  Temperament,
  conn: sequelize,
};
