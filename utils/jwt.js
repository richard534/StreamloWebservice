var jwt = require("jsonwebtoken");

module.exports = {
  // Generate Token using secret from process.env.JWT_SECRET
  generateToken: function(user) {
    var u = {
      userId: user._id
    };

    let token;
    return (token = jwt.sign(u, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
    }));
  },

  // middleware that checks if JWT token exists and verifies it if it does exist.
  // check header or url parameters or post parameters for token
  verifyToken: function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
          return res.status(401).json({
            success: false,
            message: "Failed to authenticate token."
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // if there is no token
      // return an error
      return res.status(401).send({
        success: false,
        message: "No token provided."
      });
    }
  }
};
