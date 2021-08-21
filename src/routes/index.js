const { Router } = require("express");
const charactersRoutes = require("./characters");
const moviesRoutes = require("./movies");
const authRoutes = require("./auth");
const router = Router();

router.use("/characters", charactersRoutes);
router.use("/movies", moviesRoutes);
router.use("/auth", authRoutes);

module.exports = router;
