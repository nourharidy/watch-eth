"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var utils_1 = require("./utils");
var models_1 = require("./models");
var default_event_db_1 = require("./event-db/default-event-db");
var default_eth_provider_1 = require("./eth-provider/default-eth-provider");
var defaultOptions = {
    finalityDepth: 12,
    pollInterval: 10000,
};
/**
 * Watches for events on a given contract.
 */
var EventWatcher = /** @class */ (function (_super) {
    __extends(EventWatcher, _super);
    function EventWatcher(options) {
        var _this = _super.call(this) || this;
        _this.polling = false;
        _this.subscriptions = {};
        options = __assign({}, defaultOptions, options);
        _this.eth = options.eth || new default_eth_provider_1.DefaultEthProvider();
        _this.db = options.db || new default_event_db_1.DefaultEventDB();
        _this.options = options;
        return _this;
    }
    Object.defineProperty(EventWatcher.prototype, "isPolling", {
        /**
         * @returns `true` if polling, `false` otherwise.
         */
        get: function () {
            return this.polling;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Starts the polling loop.
     * Can only be called once.
     */
    EventWatcher.prototype.startPolling = function () {
        if (this.polling) {
            return;
        }
        this.polling = true;
        this.pollEvents();
    };
    /**
     * Stops the polling loop.
     */
    EventWatcher.prototype.stopPolling = function () {
        this.polling = false;
    };
    /**
     * Subscribes to an event with a given callback.
     * @param options Event filter to subscribe to.
     * @param listener Function to be called when the event is triggered.
     */
    EventWatcher.prototype.subscribe = function (options, listener) {
        // Start polling if we haven't already.
        this.startPolling();
        // Store the filter.
        var filter = new models_1.EventFilter(options);
        // Initialize the subscriber if it doesn't exist.
        if (!(filter.hash in this.subscriptions)) {
            this.subscriptions[filter.hash] = {
                filter: filter,
                listeners: [],
            };
        }
        // Register the event.
        this.subscriptions[filter.hash].listeners.push(listener);
    };
    /**
     * Unsubscribes from an event with a given callback.
     * @param options Event filter to unsubscribe from.
     * @param listener Function that was used to subscribe.
     */
    EventWatcher.prototype.unsubscribe = function (options, listener) {
        var filter = new models_1.EventFilter(options);
        var subscription = this.subscriptions[filter.hash];
        // Can't unsubscribe if we aren't subscribed in the first place.
        if (subscription === undefined) {
            return;
        }
        // Remove the listener.
        subscription.listeners = subscription.listeners.filter(function (l) {
            return l !== listener;
        });
        // No more listeners on this event, can remove the filter.
        if (subscription.listeners.length === 0) {
            delete this.subscriptions[filter.hash];
        }
        // No more subscriptions, can stop polling.
        if (Object.keys(this.subscriptions).length === 0) {
            this.polling = false;
        }
    };
    /**
     * Polling loop.
     * Checks events then sleeps before calling itself again.
     * Stops polling if the service is stopped.
     */
    EventWatcher.prototype.pollEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.polling) {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 5]);
                        return [4 /*yield*/, this.checkEvents()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, utils_1.sleep(this.options.pollInterval)];
                    case 4:
                        _a.sent();
                        this.pollEvents();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks for new events and triggers any listeners on those events.
     * Will only check for events that are currently being listened to.
     */
    EventWatcher.prototype.checkEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connected, block, lastFinalBlock;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eth.connected()];
                    case 1:
                        connected = _a.sent();
                        if (!connected) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.eth.getCurrentBlock()];
                    case 2:
                        block = _a.sent();
                        lastFinalBlock = Math.max(0, block - this.options.finalityDepth);
                        // Check all subscribed events.
                        return [4 /*yield*/, Promise.all(Object.values(this.subscriptions).map(function (subscription) {
                                return _this.checkEvent(subscription.filter, lastFinalBlock);
                            }))];
                    case 3:
                        // Check all subscribed events.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks for new instances of an event.
     * @param filter Event filter to check.
     * @param lastFinalBlock Number of the latest block known to be final.
     */
    EventWatcher.prototype.checkEvent = function (filter, lastFinalBlock) {
        return __awaiter(this, void 0, void 0, function () {
            var lastLoggedBlock, firstUnsyncedBlock, events, unique;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getLastLoggedBlock(filter.hash)];
                    case 1:
                        lastLoggedBlock = _a.sent();
                        firstUnsyncedBlock = lastLoggedBlock + 1;
                        // Don't do anything if we've already seen the latest final block.
                        if (firstUnsyncedBlock > lastFinalBlock) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.eth.getEvents(__assign({}, filter.options, { address: this.options.address, abi: this.options.abi, fromBlock: firstUnsyncedBlock, toBlock: lastFinalBlock }))
                            // Filter out events that we've already seen.
                        ];
                    case 2:
                        events = _a.sent();
                        return [4 /*yield*/, this.getUniqueEvents(events)
                            // Emit the events.
                        ];
                    case 3:
                        unique = _a.sent();
                        // Emit the events.
                        return [4 /*yield*/, this.emitEvents(filter.hash, unique)
                            // Update the last block that we've seen based on what we just queried.
                        ];
                    case 4:
                        // Emit the events.
                        _a.sent();
                        // Update the last block that we've seen based on what we just queried.
                        return [4 /*yield*/, this.db.setLastLoggedBlock(filter.hash, lastFinalBlock)];
                    case 5:
                        // Update the last block that we've seen based on what we just queried.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Filters out any events we've already seen.
     * @param events A series of Ethereum events.
     * @returns any events we haven't seen already.
     */
    EventWatcher.prototype.getUniqueEvents = function (events) {
        return __awaiter(this, void 0, void 0, function () {
            var isUnique;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Filter out duplicated events.
                        events = events.filter(function (event, index, self) {
                            return (index ===
                                self.findIndex(function (e) {
                                    return e.hash === event.hash;
                                }));
                        });
                        return [4 /*yield*/, Promise.all(events.map(function (event) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.db.getEventSeen(event.hash)];
                                        case 1: return [2 /*return*/, !(_a.sent())];
                                    }
                                });
                            }); }))];
                    case 1:
                        isUnique = _a.sent();
                        return [2 /*return*/, events.filter(function (_, i) { return isUnique[i]; })];
                }
            });
        });
    };
    /**
     * Emits events for a given event name.
     * @param filterHash Hash of the event filter to emit.
     * @param events Event objects for that event.
     */
    EventWatcher.prototype.emitEvents = function (filterHash, events) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, events_2, event_1, _a, _b, listener;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Nothing to emit.
                        if (events.length === 0) {
                            return [2 /*return*/];
                        }
                        _i = 0, events_2 = events;
                        _c.label = 1;
                    case 1:
                        if (!(_i < events_2.length)) return [3 /*break*/, 4];
                        event_1 = events_2[_i];
                        return [4 /*yield*/, this.db.setEventSeen(event_1.hash)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        // Alert any listeners.
                        for (_a = 0, _b = this.subscriptions[filterHash].listeners; _a < _b.length; _a++) {
                            listener = _b[_a];
                            try {
                                listener(events);
                            }
                            catch (_d) { }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return EventWatcher;
}(events_1.EventEmitter));
exports.EventWatcher = EventWatcher;
