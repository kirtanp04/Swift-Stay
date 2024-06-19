"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecrtKey = void 0;
exports.SecrtKey = {
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    JWT_KEY: process.env.JWT_KEY,
    Environment: process.env.NODE_ENV
};
