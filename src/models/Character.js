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
      unique: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.INTEGER,
    },
    history: {
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
