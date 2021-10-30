"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Logger = /*#__PURE__*/function () {
  function Logger() {
    (0, _classCallCheck2["default"])(this, Logger);
    this.logLevel = 0;
  }

  (0, _createClass2["default"])(Logger, [{
    key: "setLogLevel",
    value: function setLogLevel(l) {
      this.logLevel = l;
    }
  }, {
    key: "warn",
    value: function warn(msg, obj) {
      if (obj !== undefined) {
        console.warn(msg, obj);
      } else {
        console.warn(msg);
      }
    }
  }, {
    key: "error",
    value: function error(msg, obj) {
      if (obj !== undefined) {
        console.error(msg, obj);
      } else {
        console.error(msg);
      }
    }
  }, {
    key: "log",
    value: function log(level, msg, obj) {
      var obj2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";

      if (level < this.logLevel) {
        if (obj !== undefined) {
          console.debug(msg, obj, obj2);
        } else {
          console.debug(msg);
        }
      }
    }
  }]);
  return Logger;
}();

var _default = new Logger();

exports["default"] = _default;