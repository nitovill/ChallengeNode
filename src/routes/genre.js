const { Genre, Movie, User } = require("../db");
const { Router } = require("express");
const router = Router();
const verifyToken = require("../controlers/authControler");

router.get("/:id", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  const response = await Genre.findByPk(req.params.id, {
    include: { model: Movie, as: "genremov" },
  });
  if (response) {
    return res.send(response);
  }
  return res.status(404).json({ message: "movie not found" });
});
module.exports = router;
