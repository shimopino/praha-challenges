"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    res.status(500).json({
        message: err.message,
    });
};
exports.default = errorHandler;
