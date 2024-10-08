import httpStatus from 'http-status';
import JWT from 'jsonwebtoken';

const verifyToken = (token) => {
  // Verify JWT token for authentication
  return JWT.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    if (err) return { error: err };

    if (user._doc) {
      let userObject = { ...user._doc };
      delete userObject.password;
      return userObject;
    }
  });
};

const authenticateToken = (req, res, next) => {
  // Get token data from request headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If token is null, send error
  if (token === null) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ error: 'This process requires login' });
  }

  const user = verifyToken(token);
  if (user.error) {
    return res.status(httpStatus.FORBIDDEN).send({ error: user.error });
  }

  req.user = user;
  next();
};

export { authenticateToken, verifyToken };

