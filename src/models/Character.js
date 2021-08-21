const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("character", {
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
    age: {
      type: DataTypes.NUMBER,
    },
    weight: {
      type: DataTypes.NUMBER,
    },
    history: {
      type: DataTypes.STRING,
    },
    movies: {
      type: DataTypes.STRING,
    },
  });
};
/*○ Imagen.
○ Nombre.
○ Edad.
○ Peso.
○ Historia.
○ Películas o series asociadas.*/
