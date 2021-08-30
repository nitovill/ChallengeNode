const { Router } = require("express");
const router = Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const { PrivateKey } = require("../../lib/config");
const verifyToken = require("../controlers/authControler");
const { User } = require("../db");

router.post("/register", (req, res, next) => {
  const { email, username, password } = req.body;
  var hash = bcrypt.hashSync(password, 10);
  User.create({
    email,
    username,
    password: hash,
  })
    .then((resp) => {
      const token = jwt.sign({ id: resp.id }, PrivateKey, {
        expiresIn: 60 * 60 * 24,
      });
      res.json({ resp, token });
    })
    .catch((err) => next(err));
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.json({ auth: false, message: "password invalid" });
    }
    const token = jwt.sign({ id: user.id }, PrivateKey, {
      expiresIn: 60 * 60 * 24,
    });
    res.json({ auth: true, token });
  }
});
/* router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).json({ auth: false, message: "no user find" });
  }
  res.send(user);
}); */
module.exports = router;
