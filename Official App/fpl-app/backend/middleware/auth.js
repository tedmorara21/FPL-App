const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const secret_key = process.env.SECRET_KEY;

function authenticateToken (req, res, next) {
   const authHeader = req.headers['authorization']; 

   if (!authHeader) {
      return res.status(401).json({ message: "No token provided "});
   }

   const token = authHeader.split(' ')[1];

   if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
   }

   try {
      const decodedToken = jwt.verify(token, secret_key);
      
      req.user = decodedToken; /* contains id(fpl_id), iat & exp */
      next();
   } catch (err) {
      return res.status(401).json({ message: `Invalid/expired token: ${err}` })
   }
}


function authorizeAdmin (req, res, next) {
   if ( req.user?.role !== "admin" ) {
      return res.status(403).json({ message: "Access denied. Admins only" });
   }

   next();
}


module.exports = {
   authenticateToken,
   authorizeAdmin
};
