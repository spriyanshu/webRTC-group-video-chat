const jwt = require("jsonwebtoken");

const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const isAuthanticated = (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  const authHeader = req.headers.cookie;

  const token = authHeader && authHeader.split("jwt=")[1];
  if (token == null)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ status: ReasonPhrases.UNAUTHORIZED });
  jwt.verify(token, "key", (err, user) => {
    if (err)
      return res.status(StatusCodes.FORBIDDEN).json({
        status: ReasonPhrases.FORBIDDEN,
        message: "please login to access data.",
      });
    req.user = user;
    next();
  });
};

module.exports = isAuthanticated;
