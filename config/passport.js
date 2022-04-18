import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import User from '../models/user.js';

const LocalStrategy = passportLocal.Strategy;
const JWTstrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies)
  {
      token = req.cookies['secret_token'];
  }
  return token;
};

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username: username.toLowerCase() } });

        if (!user) {
          return done(null, false, { message: 'Неверный логин или пароль' });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Неверный логин или пароль' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
    },
    async (token, done) => {
      try {
        if (Date.now() > token.expires) {
          return done('Token expired');
        }

        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
