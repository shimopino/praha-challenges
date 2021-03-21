import express from 'express';
import cookieParser from 'cookie-parser';
import staticHosting from './middleware/hosting';
import router from './routes/router';

const PORT_CORS = process.env.PORT_CORS || 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);
app.listen(PORT_CORS, () => {
  console.log(`listening on port: ${PORT_CORS}`);
});

const PORT_OK = process.env.PORT_OK || 8090;
const allowStaticApp = express();
allowStaticApp.use(staticHosting);
allowStaticApp.listen(PORT_OK, () => {
  console.log(`static hosting on ${PORT_OK}`);
});
