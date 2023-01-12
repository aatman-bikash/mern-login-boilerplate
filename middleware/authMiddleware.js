const jwt = require("jsonwebtoken");
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  //Middlewares
  const { jwt: jwtToken } = req.cookies;
  if (jwtToken) {
    const isValid = jwt.verify(jwtToken, process.env.TOKEN_SECRET);
    if (isValid) {
      next();
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
};

const checkUser = async (req, res, next) => {
  const { jwt: token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      const user = await User.findById(decoded.user);
      res.locals.user = user;
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
