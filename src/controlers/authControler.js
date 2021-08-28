const { PrivateKey } = require("../../lib/config");
var jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(404).json({ auth: false, message: "no token provider" });
  } else {
    const decoded = jwt.verify(token, PrivateKey);
    console.log(decoded);
    req.userId = decoded.id;
  }
  next();
}
module.exports = verifyToken;
