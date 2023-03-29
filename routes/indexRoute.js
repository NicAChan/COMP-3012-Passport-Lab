const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const { getUserById } = require("../controllers/userController")

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", isAdmin, (req, res) => {
  req.sessionStore.all((err, sessions) => {
    if (err) console.log(err);
    for (const sessionId in sessions) {
      const userId = sessions[sessionId].passport.user
      if (getUserById(userId).role === "admin") {
        delete sessions[sessionId]
        break;
      }
    }
    res.render("admin", {
      user: req.user,
      sessions: sessions
    });
  })
});

module.exports = router;
