const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const frontToken = req.headers.authorization;
  if (!frontToken) {
    return res.status(401).json({
      message: "cos poszło nie tak",
    });
  }

  const slicedFrontToken = frontToken.split(" ")[1];

  try {
    const verifiedToken = jwt.verify(slicedFrontToken, SECRET_KEY);
    req.user = verifiedToken;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "błąd uwierzytelniania",
    });
  }
};

const isAdmin = (req, res, next)=>{
  if(req.user.role !== "admin"){
    return res.status(403).json({
      message: "nie masz uprawnień"
    })
  }
  next();
}

const isLibrarian = (req, res, next)=>{
  if(req.user.role !== "admin" && req.user.role !== "librarian"){
    return res.status(403).json({
      message: "nie masz uprawnień"
    })
  }
  next();
}

module.exports = {
  verifyToken,
  isAdmin,
  isLibrarian
};
