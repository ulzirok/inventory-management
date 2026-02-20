const { Strategy: FacebookStrategy } = require('passport-facebook');
const prisma = require('../prisma');

const options = {
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name']
};

module.exports = (passport) => {
  passport.use(
    new FacebookStrategy(options, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await prisma.user.upsert({
          where: { facebookId: profile.id },
          update: {},
          create: {
            facebookId: profile.id,
            email: profile.emails ? profile.emails[0].value : `fb_${profile.id}@example.com`,
            role: 'USER'
          }
        });
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    })
  );
};