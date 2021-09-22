const { Router } = require("express");
const router = Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const { PrivateKey } = require("../../lib/config");
//const verifyToken = require("../controlers/authControler");
const { User } = require("../db");
const sgMail = require("@sendgrid/mail");

router.post("/register", async (req, res, next) => {
  const { email, username, password } = req.body;
  var hash = bcrypt.hashSync(password, 10);
  const user = await findOne(where({ email: email }));
  if (!user) {
    User.create({
      email,
      username,
      password: hash,
    })
      .then((resp) => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: "test@example.com", // Change to your recipient
          from: "test@example.com", // Change to your verified sender
          subject: "Sending with SendGrid is Fun",
          text: "and easy to do anywhere, even with Node.js",
          html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
        const token = jwt.sign({ id: resp.id }, PrivateKey, {
          expiresIn: 60 * 60 * 24,
        });
        return res.json({ resp, token });
      })
      .catch((err) => next(err));
  }
  res.status(409).json({ message: "This email is already registered" });
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
