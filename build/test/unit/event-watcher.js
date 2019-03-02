"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var setup_1 = require("../setup");
var mockEth = __importStar(require("../mock/eth-provider"));
var event_watcher_1 = require("../../src/event-watcher");
var models_1 = require("../../src/models");
var utils_1 = require("../../src/utils");
/**
 * Small class for spying on listeners.
 */
var ListenerSpy = /** @class */ (function () {
    function ListenerSpy() {
    }
    ListenerSpy.prototype.listener = function (args) {
        this.args = args;
    };
    return ListenerSpy;
}());
describe('EventWatcher', function () {
    var watcher;
    beforeEach(function () {
        watcher = new event_watcher_1.EventWatcher({
            address: '0x0',
            abi: [
                {
                    anonymous: false,
                    inputs: [
                        {
                            indexed: false,
                            name: '_value',
                            type: 'uint256',
                        },
                    ],
                    name: 'TestEvent',
                    type: 'event',
                },
            ],
            finalityDepth: 0,
            pollInterval: 0,
            eth: mockEth.eth,
        });
    });
    afterEach(function () {
        watcher.stopPolling();
        mockEth.reset();
    });
    describe('subscribe', function () {
        it('should allow a user to subscribe to an event', function () {
            var filter = {
                event: 'TestEvent',
            };
            var listener = function () {
                return;
            };
            watcher.subscribe(filter, listener);
            watcher.isPolling.should.be.true;
        });
        it('should allow a user to subscribe twice with the same listener', function () {
            var filter = {
                event: 'TestEvent',
            };
            var listener = function () {
                return;
            };
            setup_1.should.not.Throw(function () {
                watcher.subscribe(filter, listener);
                watcher.subscribe(filter, listener);
            });
        });
    });
    describe('unsubscribe', function () {
        it('should allow a user to unsubscribe from an event', function () {
            var filter = {
                event: 'TestEvent',
            };
            var listener = function () {
                return;
            };
            watcher.subscribe(filter, listener);
            watcher.unsubscribe(filter, listener);
            watcher.isPolling.should.be.false;
        });
        it('should allow a user to unsubscribe even if not subscribed', function () {
            var filter = {
                event: 'TestEvent',
            };
            var listener = function () {
                return;
            };
            setup_1.should.not.Throw(function () {
                watcher.unsubscribe(filter, listener);
            });
        });
        it('should still be polling if other listeners exist', function () {
            var filter = {
                event: 'TestEvent',
            };
            var listener1 = function () {
                return true;
            };
            var listener2 = function () {
                return false;
            };
            watcher.subscribe(filter, listener1);
            watcher.subscribe(filter, listener2);
            watcher.unsubscribe(filter, listener1);
            watcher.isPolling.should.be.true;
        });
    });
    describe('events', function () {
        it('should alert a listener when it hears an event', function () { return __awaiter(_this, void 0, void 0, function () {
            var filter, spy, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = {
                            event: 'TestEvent',
                        };
                        spy = new ListenerSpy();
                        event = new models_1.EventLog({
                            transactionHash: '0x123',
                            logIndex: 0,
                        });
                        mockEth.setEvents([event]);
                        // Subscribe for new events.
                        watcher.subscribe(filter, spy.listener.bind(spy));
                        // Wait for events to be detected.
                        return [4 /*yield*/, utils_1.sleep(10)];
                    case 1:
                        // Wait for events to be detected.
                        _a.sent();
                        spy.args.should.deep.equal([event]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should alert multiple listeners on the same event', function () { return __awaiter(_this, void 0, void 0, function () {
            var filter, spy1, spy2, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = {
                            event: 'TestEvent',
                        };
                        spy1 = new ListenerSpy();
                        spy2 = new ListenerSpy();
                        event = new models_1.EventLog({
                            transactionHash: '0x123',
                            logIndex: 0,
                        });
                        mockEth.setEvents([event]);
                        // Subscribe for new events.
                        watcher.subscribe(filter, spy1.listener.bind(spy1));
                        watcher.subscribe(filter, spy2.listener.bind(spy2));
                        // Wait for events to be detected.
                        return [4 /*yield*/, utils_1.sleep(10)];
                    case 1:
                        // Wait for events to be detected.
                        _a.sent();
                        spy1.args.should.deep.equal([event]);
                        spy2.args.should.deep.equal([event]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should only alert the same event once', function () { return __awaiter(_this, void 0, void 0, function () {
            var filter, spy, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = {
                            event: 'TestEvent',
                        };
                        spy = new ListenerSpy();
                        event = new models_1.EventLog({
                            transactionHash: '0x123',
                            logIndex: 0,
                        });
                        mockEth.setEvents([event, event]);
                        // Subscribe for new events.
                        watcher.subscribe(filter, spy.listener.bind(spy));
                        // Wait for events to be detected.
                        return [4 /*yield*/, utils_1.sleep(10)];
                    case 1:
                        // Wait for events to be detected.
                        _a.sent();
                        spy.args.should.deep.equal([event]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
