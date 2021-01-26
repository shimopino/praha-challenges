"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logging_1 = __importDefault(require("./middleware/logging"));
const error_1 = __importDefault(require("./middleware/error"));
const staticHosting_1 = __importDefault(require("./middleware/staticHosting"));
const cors_1 = __importDefault(require("./middleware/cors"));
const router_1 = __importDefault(require("./routes/router"));
const PORT_CORS = process.env.PORT_CORS || 8080;
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(logging_1.default('default'));
app.use(cors_1.default);
app.use(error_1.default);
app.use(router_1.default);
app.listen(PORT_CORS, () => {
    console.log(`cors server listening on ${PORT_CORS}`);
});
const PORT_ALLOW = process.env.HOST_ALLOW || 8090;
const allowStaticServer = express_1.default();
allowStaticServer.use(staticHosting_1.default);
allowStaticServer.listen(PORT_ALLOW, () => {
    console.log(`static server listening on ${PORT_ALLOW}`);
});
const PORT_DISALLOW = process.env.PORT_DISALLOW || 8091;
const disallowStaticServer = express_1.default();
disallowStaticServer.use(staticHosting_1.default);
disallowStaticServer.listen(PORT_DISALLOW, () => {
    console.log(`static server listening on ${PORT_DISALLOW}`);
});
