const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.send("soy character");
});

module.exports = router;
