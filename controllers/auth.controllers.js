import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.js';

export function logIn(req, res, next) {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        if (err || !user) {
          return res.status(401).json({ message: info.message })
        }

        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) return next(error);

            const body = { id: user.id, username: user.username };
            const token = jsonwebtoken.sign({ user: body }, process.env.TOKEN_SECRET, { expiresIn: '1d' });

            return res.status(200).json({ secret_token: token });

            /* OR */
            // return res.cookie('secret_token', jwt, { httpOnly: true, secure: false });
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
}

export async function register(req, res) {
  try {
    const user = await User.create({ username: req.body.username, password: req.body.password });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Пользователь уже существует' });
    } else {
      return res.status(500).json({ message: 'Сервис временно недоступен' });
    }
  }

  res.sendStatus(204);
}

export function logOut(req, res) {
  res.clearCookie('secret_token', { path: '/' }).redirect('/');
}
