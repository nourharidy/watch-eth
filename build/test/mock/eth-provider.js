"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_mockito_1 = require("ts-mockito");
var default_eth_provider_1 = require("../../src/eth-provider/default-eth-provider");
var mockEthProvider = ts_mockito_1.mock(default_eth_provider_1.DefaultEthProvider);
ts_mockito_1.when(mockEthProvider.connected()).thenCall(function () {
    return true;
});
var block = 1;
ts_mockito_1.when(mockEthProvider.getCurrentBlock()).thenCall(function () {
    return block;
});
exports.setBlock = function (newBlock) {
    block = newBlock;
};
var events = [];
ts_mockito_1.when(mockEthProvider.getEvents(ts_mockito_1.anything())).thenCall(function () {
    return events;
});
exports.setEvents = function (newEvents) {
    events = newEvents;
};
exports.reset = function () {
    block = 1;
    events = [];
};
exports.eth = ts_mockito_1.instance(mockEthProvider);
