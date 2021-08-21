const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("genre", {
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
    movies: {
      type: DataTypes.STRING,
    },
  });
};
/* ● Género: deberá tener,
○ Nombre.
○ Imagen.
○ Películas o series asociadas. */
