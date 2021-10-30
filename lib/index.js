"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _FigmaService = _interopRequireDefault(require("./qux/figma/FigmaService"));

var _Logger = _interopRequireDefault(require("./qux/core/Logger"));

var _fs = _interopRequireDefault(require("fs"));

var _inquirer = require("inquirer");

var _chalk = _interopRequireDefault(require("chalk"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _util = _interopRequireDefault(require("util"));

/**
 * Enable fetch polyfill
 */
if (!globalThis.fetch) {
  globalThis.fetch = _nodeFetch["default"];
  globalThis.Headers = _nodeFetch["default"].Headers;
}

_Logger["default"].setLogLevel(-10);

function download() {
  return _download.apply(this, arguments);
}

function _download() {
  _download = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var confFile,
        defaultConf,
        config,
        figma,
        qux,
        save,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            confFile = _args.length > 0 && _args[0] !== undefined ? _args[0] : './.luisa';
            console.debug(_chalk["default"].blue('---------------------------------------'));
            console.debug(_chalk["default"].blue(' Luisa Downlaoder - v. 1.0.3'));
            console.debug(_chalk["default"].blue('---------------------------------------'));
            defaultConf = read_config(confFile);
            _context.next = 7;
            return ask_conf(defaultConf);

          case 7:
            config = _context.sent;
            figma = {};
            qux = {};

            if (!(config.type === 'Figma')) {
              _context.next = 18;
              break;
            }

            _context.next = 13;
            return ask_figma(defaultConf);

          case 13:
            figma = _context.sent;
            _context.next = 16;
            return download_figma(figma.token, figma.id, figma.pages, config.appFile, config.imageFolder);

          case 16:
            _context.next = 23;
            break;

          case 18:
            _context.next = 20;
            return ask_qux(defaultConf);

          case 20:
            qux = _context.sent;
            _context.next = 23;
            return download_qux(qux.token, config.appFile, config.imageFolder);

          case 23:
            _context.next = 25;
            return ask_save();

          case 25:
            save = _context.sent;

            if (save) {
              save_config(config, figma, qux, confFile);
            }

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _download.apply(this, arguments);
}

function read_config(confFile) {
  var defaultConfig = {
    config: {
      appFile: 'src/views/app.json',
      imageFolder: 'public/img'
    },
    figma: {
      token: '',
      id: '',
      pages: ''
    },
    qux: {
      token: ''
    }
  };

  if (_fs["default"].existsSync(confFile)) {
    console.debug(_chalk["default"].green('Using .luisa file to read default config'));

    var content = _fs["default"].readFileSync(confFile, 'UTF-8');

    var loadedConf = JSON.parse(content);

    if (loadedConf.config) {
      defaultConfig.config = loadedConf.config;
    }

    if (loadedConf.figma) {
      defaultConfig.figma = loadedConf.figma;
    }

    if (loadedConf.qux) {
      defaultConfig.qux = loadedConf.qux;
    }
  }

  return defaultConfig;
}

function save_config(config, figma, qux, confFile) {
  console.debug(_chalk["default"].red('Save config to .luisa. DO NOT FORGET TO ADD TO .GITIGNORE'));
  var content = JSON.stringify({
    config: config,
    figma: figma,
    qux: qux
  }, null, 2);

  _fs["default"].writeFileSync(confFile, content);
}

function ask_qux(_x) {
  return _ask_qux.apply(this, arguments);
}

function _ask_qux() {
  _ask_qux = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(defaultConf) {
    var questions, answers;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            questions = [{
              type: 'input',
              name: 'token',
              "default": defaultConf.qux.token,
              message: 'Your Quant-UX Share Token'
            }];
            _context2.next = 3;
            return (0, _inquirer.prompt)(questions);

          case 3:
            answers = _context2.sent;
            return _context2.abrupt("return", answers);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _ask_qux.apply(this, arguments);
}

function download_qux(_x2, _x3, _x4) {
  return _download_qux.apply(this, arguments);
}

function _download_qux() {
  _download_qux = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(quxToken, jsonFileTarget, fileFolderTarget) {
    var quxServer,
        _args5 = arguments;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            quxServer = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : 'https://quant-ux.com';
            return _context5.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(resolve, reject) {
                var url, response, app, widgetsWithImages, promisses;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        url = "".concat(quxServer, "/rest/invitation/").concat(quxToken, "/app.json");
                        _context4.next = 3;
                        return (0, _nodeFetch["default"])(url);

                      case 3:
                        response = _context4.sent;

                        if (!(response.status === 200)) {
                          _context4.next = 14;
                          break;
                        }

                        _context4.next = 7;
                        return response.json();

                      case 7:
                        app = _context4.sent;
                        widgetsWithImages = get_images(app);
                        promisses = widgetsWithImages.map( /*#__PURE__*/function () {
                          var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(w) {
                            var streamPipeline, image, imageURL, imageFileTarget, _response;

                            return _regenerator["default"].wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    streamPipeline = _util["default"].promisify(require('stream').pipeline);
                                    image = w.style.backgroundImage;
                                    imageURL = "".concat(quxServer, "/rest/images/").concat(quxToken, "/").concat(image.url);
                                    _context3.prev = 3;
                                    imageFileTarget = fileFolderTarget + '/' + w.id + '.png';
                                    console.debug(_chalk["default"].blueBright('  - Write Image: ' + imageFileTarget));
                                    _context3.next = 8;
                                    return (0, _nodeFetch["default"])(imageURL);

                                  case 8:
                                    _response = _context3.sent;

                                    if (!_response.ok) {
                                      _context3.next = 14;
                                      break;
                                    }

                                    w.style.backgroundImage = {
                                      url: w.id + '.png'
                                    };
                                    return _context3.abrupt("return", streamPipeline(_response.body, _fs["default"].createWriteStream(imageFileTarget)));

                                  case 14:
                                    console.debug(_chalk["default"].red(' ! Could not download element: ' + w.name + ' url:' + imageURL));

                                  case 15:
                                    _context3.next = 21;
                                    break;

                                  case 17:
                                    _context3.prev = 17;
                                    _context3.t0 = _context3["catch"](3);
                                    console.debug(_chalk["default"].red(' ! Could not download element: ' + w.name + ' url:' + imageURL));
                                    return _context3.abrupt("return", new Promise(function (resolve) {
                                      return resolve();
                                    }));

                                  case 21:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3, null, [[3, 17]]);
                          }));

                          return function (_x14) {
                            return _ref2.apply(this, arguments);
                          };
                        }());
                        _context4.next = 12;
                        return Promise.all(promisses);

                      case 12:
                        write_app(app, jsonFileTarget);
                        resolve();

                      case 14:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x12, _x13) {
                return _ref.apply(this, arguments);
              };
            }()));

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _download_qux.apply(this, arguments);
}

function get_images(model) {
  var result = [];

  for (var id in model.screens) {
    var screen = model.screens[id];

    if (screen.style && screen.style.backgroundImage) {
      result.push(screen);
    }
  }

  for (var _id in model.widgets) {
    var widget = model.widgets[_id];

    if (widget.style && widget.style.backgroundImage) {
      result.push(widget);
    }
  }

  return result;
}

function write_app(app, jsonFileTarget) {
  console.debug(_chalk["default"].blue('  - Write Design: ' + jsonFileTarget));
  var content = JSON.stringify(app, null, 2);

  _fs["default"].writeFileSync(jsonFileTarget, content);
}

function download_figma(_x5, _x6, _x7, _x8, _x9) {
  return _download_figma.apply(this, arguments);
}

function _download_figma() {
  _download_figma = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(figmaAccessKey, figmaFileId, figmaPageId, jsonFileTarget, fileFolderTarget) {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!(!figmaAccessKey || !figmaFileId)) {
              _context8.next = 3;
              break;
            }

            console.debug(_chalk["default"].red('Plesse add the figma access token and file id'));
            return _context8.abrupt("return");

          case 3:
            return _context8.abrupt("return", new Promise(function (resolve, reject) {
              var selectedPages = figmaPageId ? figmaPageId.split(',') : [];
              /**
               * Start downloading
               */

              /**
               * Start downloading
               */
              var figmaService = new _FigmaService["default"](figmaAccessKey);
              console.debug(_chalk["default"].blue('Download Figma file...'));

              if (figmaPageId) {
                console.debug(_chalk["default"].blue('Limit to page...' + selectedPages));
              }

              try {
                figmaService.get(figmaFileId, true, false, selectedPages).then( /*#__PURE__*/function () {
                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(app) {
                    var streamPipeline, widgetsWithImages, promisses;
                    return _regenerator["default"].wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            console.debug(_chalk["default"].blue('Download images:'));
                            streamPipeline = _util["default"].promisify(require('stream').pipeline);
                            widgetsWithImages = Object.values(app.widgets).filter(function (w) {
                              return w.props.figmaImage;
                            });
                            promisses = widgetsWithImages.map( /*#__PURE__*/function () {
                              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(w) {
                                var imageURL, imageFileTarget, response;
                                return _regenerator["default"].wrap(function _callee6$(_context6) {
                                  while (1) {
                                    switch (_context6.prev = _context6.next) {
                                      case 0:
                                        imageURL = w.props.figmaImage;
                                        _context6.prev = 1;
                                        imageFileTarget = fileFolderTarget + '/' + w.id + '.png';
                                        console.debug(_chalk["default"].blueBright('  -  Write image: ' + imageFileTarget), _chalk["default"].gray('(' + imageURL + ')'));
                                        _context6.next = 6;
                                        return (0, _nodeFetch["default"])(imageURL);

                                      case 6:
                                        response = _context6.sent;

                                        if (!response.ok) {
                                          _context6.next = 10;
                                          break;
                                        }

                                        w.style.backgroundImage = {
                                          url: w.id + '.png'
                                        };
                                        return _context6.abrupt("return", streamPipeline(response.body, _fs["default"].createWriteStream(imageFileTarget)));

                                      case 10:
                                        _context6.next = 16;
                                        break;

                                      case 12:
                                        _context6.prev = 12;
                                        _context6.t0 = _context6["catch"](1);
                                        console.debug(_chalk["default"].red(' ! Could not download element: ' + w.name + ' url:' + imageURL));
                                        return _context6.abrupt("return", new Promise(function (resolve) {
                                          return resolve();
                                        }));

                                      case 16:
                                      case "end":
                                        return _context6.stop();
                                    }
                                  }
                                }, _callee6, null, [[1, 12]]);
                              }));

                              return function (_x16) {
                                return _ref4.apply(this, arguments);
                              };
                            }());
                            _context7.next = 6;
                            return Promise.all(promisses);

                          case 6:
                            write_app(app, jsonFileTarget);
                            console.debug("\n\n");
                            console.debug(_chalk["default"].green('Done!'), 'Now import the JSON file in', _chalk["default"].green('Home.vue'));
                            resolve();

                          case 10:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  }));

                  return function (_x15) {
                    return _ref3.apply(this, arguments);
                  };
                }());
              } catch (err) {
                console.debug(err);
                reject(err);
              }
            }));

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _download_figma.apply(this, arguments);
}

function ask_figma(_x10) {
  return _ask_figma.apply(this, arguments);
}

function _ask_figma() {
  _ask_figma = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(defaultConf) {
    var questions, answers;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            questions = [{
              type: 'input',
              name: 'token',
              "default": defaultConf.figma.token,
              message: 'Your Figma Token'
            }, {
              type: 'input',
              name: 'id',
              "default": defaultConf.figma.id,
              message: 'Figma File ID'
            }, {
              type: 'input',
              name: 'pages',
              "default": defaultConf.figma.pages,
              message: 'Pages (as comma seperated list)'
            }];
            _context9.next = 3;
            return (0, _inquirer.prompt)(questions);

          case 3:
            answers = _context9.sent;
            return _context9.abrupt("return", answers);

          case 5:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _ask_figma.apply(this, arguments);
}

function ask_save() {
  return _ask_save.apply(this, arguments);
}

function _ask_save() {
  _ask_save = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    var questions, answers;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            questions = [{
              type: 'list',
              name: 'save',
              choices: ["No, do not remember", "Yes, remember"],
              message: 'Remeber Values for next time?'
            }];
            _context10.next = 3;
            return (0, _inquirer.prompt)(questions);

          case 3:
            answers = _context10.sent;
            return _context10.abrupt("return", answers.save === 'Yes, remember');

          case 5:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _ask_save.apply(this, arguments);
}

function ask_conf(_x11) {
  return _ask_conf.apply(this, arguments);
}

function _ask_conf() {
  _ask_conf = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(defaultConf) {
    var questions, answers;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            questions = [{
              type: 'list',
              name: 'type',
              choices: ["Figma", "Quant-UX"],
              message: 'From which design tool do you want to download?'
            }, {
              type: 'input',
              name: 'imageFolder',
              "default": defaultConf.config.imageFolder,
              message: 'Image downlaod folder'
            }, {
              type: 'input',
              name: 'appFile',
              "default": defaultConf.config.appFile,
              message: 'App.json location'
            }];
            _context11.next = 3;
            return (0, _inquirer.prompt)(questions);

          case 3:
            answers = _context11.sent;
            return _context11.abrupt("return", answers);

          case 5:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _ask_conf.apply(this, arguments);
}

download();