const app = require("./src/app");
const { port } = require("./lib/config");
const { conn } = require("./src/db");

conn.sync({ force: true }).then(() => {
  console.log("database conected");
  app.listen(port, () => {
    console.log(`server on port ${port}`);
  });
});
