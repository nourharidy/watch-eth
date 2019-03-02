"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
/**
 * Creates a simple (not cryptographically secure) hash.
 * @param message Message to be hashed.
 * @returns the hashed value.
 */
exports.hash = function (message) {
    return crypto_1.default
        .createHash('md5')
        .update(message)
        .digest('hex');
};
/**
 * Creates a promise that resolves after a certain period of time.
 * @param ms Number of milliseconds to sleep.
 * @returns a promise that resolves later.
 */
exports.sleep = function (ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
};
