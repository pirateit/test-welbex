import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import multer from 'multer';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import './config/passport.js';
import './models/index.js';
import sequelize from './config/sequelize.js';
import authRouter from './routes/auth.routes.js';
import postsRouter from './routes/posts.routes.js';
// sequelize.sync({ alter: true });

var app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(authRouter);
app.use(postsRouter);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Express API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Alexander Saenko',
        url: 'http://test-welbex.pirateit.org',
        email: '',
      },
    },
    servers: [
      {
        url: 'http://test-welbex.pirateit.org/api',
      },
    ],
  },
  apis: [
    './routes/auth.routes.js',
    './routes/posts.routes.js'
  ],
};

const specs = swaggerJsdoc(options);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Сервис временно недоступен');
});

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server started successfully.`);
});
