"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var formatSize = exports.formatSize = function formatSize() {
    var byte = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    byte = parseInt(byte);
    if (byte / 1000000 > 1) {
        return (parseInt(byte) / 1000000).toFixed(2) + "m";
    }
    return (parseInt(byte) / 1000).toFixed(2) + "k";
};