const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const prisma = require("../prisma");
const Roles = require("../constants/roles");

const options = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
};

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      options,
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await prisma.user.upsert({
            where: { googleId: profile.id },
            update: {},
            create: {
              googleId: profile.id,
              email: profile.emails[0].value,
              role: Roles.USER,
            },
          });
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
};
