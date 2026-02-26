const errorHandler = require("../utils/errorHandler");
const authService = require("../services/auth.service");

const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

module.exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bycript.genSalt(10);
    const hashPassword = await bycript.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        // role: 'USER'; isBlocked: false
      },
    });

    res.status(201).json({ message: "User created succesfully" });
  } catch (error) {
    if (error.code === "P2002") {
      res.status(409).json({
        message: "This email is already registered. Try a different email."
      });
    }
    errorHandler(res, error);
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const candidate = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!candidate)
      return res.status(401).json({ message: "Incorrect email or password" });
    if (candidate.isBlocked)
      return res.status(403).json({ message: "Your account is blocked" });
    const isComparePassword = bycript.compareSync(
      password,
      candidate.password,
    );
    if (!isComparePassword)
      return res.status(401).json({ message: "Incorrect email or password" });

    const token = jwt.sign(
      {
        userId: candidate.id,
        email: candidate.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      token: `Bearer ${token}`,
      user: {
        id: candidate.id,
        email: candidate.email,
      },
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true
      }
    });
    res.status(200).json(user);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.socialCallback = async (req, res) => {
  const user = req.user;
  try {
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
    res.redirect(`http://localhost:4200/oauth-success?token=${token}`);
  } catch (error) {
    errorHandler(res, error);
  }
};
