require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rateLimiter');

const { PORT, DATABASE } = process.env;
const { DEFAULT_PORT, DEFAULT_DATABASE } = require('./utils/other');

mongoose.set('strictQuery', true);
mongoose.connect(DATABASE || DEFAULT_DATABASE);

const app = express();

app.use(helmet());
app.use(cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT || DEFAULT_PORT);
