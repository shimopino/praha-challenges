import express from 'express';
import loggingHandler from './middleware/logging';
import errorHandler from './middleware/error';
import staticHostingHandler from './middleware/staticHosting';
import allowCrossOrigin from './middleware/cors';
import router from './routes/router';

const PORT_CORS = process.env.PORT_CORS || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(loggingHandler('default'));
app.use(allowCrossOrigin);
app.use(errorHandler);
app.use(router);
app.listen(PORT_CORS, () => {
  console.log(`cors server listening on ${PORT_CORS}`);
});

const PORT_ALLOW = process.env.HOST_ALLOW || 8090;
const allowStaticServer = express();

allowStaticServer.use(staticHostingHandler);
allowStaticServer.listen(PORT_ALLOW, () => {
  console.log(`static server listening on ${PORT_ALLOW}`);
});

const PORT_DISALLOW = process.env.PORT_DISALLOW || 8091;
const disallowStaticServer = express();

disallowStaticServer.use(staticHostingHandler);
disallowStaticServer.listen(PORT_DISALLOW, () => {
  console.log(`static server listening on ${PORT_DISALLOW}`);
});
