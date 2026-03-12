const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const createError = require("../utils/createError");

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
}

module.exports.register = async (req) => {
  const { name, email, password } = req.body;

  const salt = await bycript.genSalt(10);
  const hashPassword = await bycript.hash(password, salt);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  return { message: "User created succesfully" };
};

module.exports.login = async (req) => {
  const { email, password } = req.body;

  const candidate = await prisma.user.findUnique({
    where: { email: email },
  });
  
  if (!candidate) throw createError("Incorrect email or password", 401)
  if (candidate.isBlocked) throw createError("Your account is blocked", 403)
    
  const isComparePassword = bycript.compareSync(
    password,
    candidate.password,
  );
  
  if (!isComparePassword) throw createError("Incorrect email or password", 401)

  const token = generateToken(candidate);
  return {
    token,
    user: { id: candidate.id, email: candidate.email },
  };
};

module.exports.getProfile = async (req) => {
  const { id } = req.user;

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
  return user;
};

module.exports.socialCallback = async (req) => {
  const user = req.user;
  const token = generateToken(user);
  return `${process.env.CLIENT_URL}/oauth-success?token=${token}`;
};
