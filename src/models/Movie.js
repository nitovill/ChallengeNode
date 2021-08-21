const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("movie", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creation_date: {
      type: DataTypes.INTEGER,
    },
    score: {
      type: DataTypes.INTEGER,
    },
    characters: {
      type: DataTypes.INTEGER,
    },
  });
};
/* Imagen.
○ Título.
○ Fecha de creación.
○ Calificación (del 1 al 5). */
