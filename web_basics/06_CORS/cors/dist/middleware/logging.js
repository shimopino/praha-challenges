"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggingHandler = (option) => {
    console.log(`logging setting: ${option}`);
    return (req, res, next) => {
        console.log(req.headers);
        next();
    };
};
exports.default = loggingHandler;
