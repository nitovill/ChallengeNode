const app = require("./src/app");
const { port } = require("./lib/config");

app.listen(port, () => {
  console.log(`server on port ${port}`);
});
