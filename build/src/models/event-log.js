"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
/**
 * Represents a single event log.
 */
var EventLog = /** @class */ (function () {
    function EventLog(data) {
        this.data = data;
    }
    Object.defineProperty(EventLog.prototype, "hash", {
        /**
         * Returns a unique hash for this event log.
         */
        get: function () {
            return utils_1.hash(this.data.transactionHash + this.data.logIndex);
        },
        enumerable: true,
        configurable: true
    });
    return EventLog;
}());
exports.EventLog = EventLog;
