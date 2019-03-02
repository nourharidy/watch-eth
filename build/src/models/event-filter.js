"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
/**
 * Represents an event filter.
 */
var EventFilter = /** @class */ (function () {
    function EventFilter(options) {
        this.options = options;
    }
    Object.defineProperty(EventFilter.prototype, "hash", {
        /**
         * @returns the unique hash for this filter.
         */
        get: function () {
            return utils_1.hash(JSON.stringify(this.options));
        },
        enumerable: true,
        configurable: true
    });
    return EventFilter;
}());
exports.EventFilter = EventFilter;
