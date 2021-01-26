"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isPreflight = (req) => {
    const isHttpOptions = req.method === 'OPTIONS';
    const hasOriginHeader = 'origin' in req.headers;
    const hasRequestMethod = 'access-control-request-method' in req.headers;
    return isHttpOptions && hasOriginHeader && hasRequestMethod;
};
const allowCrossOrigin = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8090');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'x-api-key');
    if (isPreflight(req)) {
        res.status(204).end();
    }
    else {
        next();
    }
};
exports.default = allowCrossOrigin;
