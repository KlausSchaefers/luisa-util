"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Logger = _interopRequireDefault(require("../core/Logger"));

var _Const = require("../core/Const");

var _ExportUtil = require("../core/ExportUtil");

var FigmaService = /*#__PURE__*/function () {
  function FigmaService(key) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2["default"])(this, FigmaService);
    this.setAccessKey(key);
    this.baseURL = 'https://api.figma.com/v1/';
    this.vectorTypes = ['LINE', 'ELLIPSE', 'VECTOR'];
    this.buttonTypes = ['RECTANGLE', 'TEXT', 'FRAME', 'GROUP', 'INSTANCE', 'COMPONENT', 'VARIANT_COMPONENT', 'COMPONENT_SET'];
    this.ignoredTypes = []; // ['GROUP', 'INSTANCE']

    this.allAsVecor = false;
    this.max_ids = 50;
    this.pluginId = '858477504263032980';
    this.downloadVectors = true;
    this.imageScaleFactor = 2;
    this.throttleRequestThreshold = 10;
    this.throttleRequestTimeout = 1000;
    this.pinnRight = false;
    this.errors = [];
    this.autoLineHeightAsNormal = true;
    this.fixed2Fill = true;
    this.defaultFontFamily = 'Helvetica Neue,Helvetica,Arial,sans-serif';

    if (config.figma) {
      if (config.figma.throttleRequestThreshold) {
        this.throttleRequestThreshold = config.figma.throttleRequestThreshold;
      }

      if (config.figma.throttleRequestTimeout) {
        this.throttleRequestTimeout = config.figma.throttleRequestTimeout;
      }

      if (config.figma.throttleBatchSize) {
        this.max_ids = config.figma.throttleBatchSize;
      }

      if (config.figma.pinnRight) {
        this.pinnRight = config.figma.pinnRight;
      }

      if (config.figma.downloadVectors === false) {
        this.downloadVectors = false;
      }

      if (config.figma.fixed2Fill === false) {
        this.fixed2Fill = false;
      }

      if (config.figma.defaultFontFamily !== '') {
        this.defaultFontFamily = config.figma.defaultFontFamily;
      }
    }

    if (config.css && config.css.autoLineHeightAsNormal === false) {
      _Logger["default"].log(-1, 'FigmaService.constructor () > Auto Line === 150%');

      this.autoLineHeightAsNormal = false;
    }

    this.figmaAlignMapping = {
      MIN: 'flex-start',
      CENTER: 'center',
      MAX: 'flex-end',
      SPACE_BETWEEN: 'space-between'
    }; // https://www.figma.com/plugin-docs/api/Trigger/

    this.figmaAnimationTypeMapping = {
      'ON_CLICK': 'click',
      'ON_HOVER': 'hover',
      'MOUSE_LEAVE': 'mouseleave',
      'MOUSE_ENTER': 'mouseenter',
      "MOUSE_UP": 'mouseup',
      "MOUSE_DOWN": "mousedown"
    };
    this.figmaAnimationEasingMapping = {};
  }

  (0, _createClass2["default"])(FigmaService, [{
    key: "setImageScaleFactor",
    value: function setImageScaleFactor(factor) {
      this.imageScaleFactor = factor;
      return this;
    }
  }, {
    key: "setAccessKey",
    value: function setAccessKey(key) {
      this.key = key;
      return this;
    }
  }, {
    key: "setDownloadVectors",
    value: function setDownloadVectors(value) {
      this.downloadVectors = value;
      return this;
    }
  }, {
    key: "setBackgroundImages",
    value: function setBackgroundImages(app) {
      var _this = this;

      _Logger["default"].log('FigmaService.setBackgroundImages()');

      Object.values(app.screens).forEach(function (screen) {
        return _this.setBackgroundImage(screen);
      });
      Object.values(app.widgets).forEach(function (widget) {
        return _this.setBackgroundImage(widget);
      });
      return app;
    }
  }, {
    key: "setBackgroundImage",
    value: function setBackgroundImage(element) {
      if (element.props.figmaImage) {
        element.style.backgroundImage = {
          url: element.props.figmaImage
        };
      }
    }
  }, {
    key: "_createDefaultHeader",
    value: function _createDefaultHeader() {
      var headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Figma-Token': this.key
      });
      return headers;
    }
  }, {
    key: "getRaw",
    value: function () {
      var _getRaw = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(key) {
        var _this2 = this;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  var url = _this2.baseURL + 'files/' + key + '?geometry=paths&plugin_data=' + _this2.pluginId;
                  fetch(url, {
                    method: 'get',
                    credentials: "same-origin",
                    headers: _this2._createDefaultHeader()
                  }).then(function (resp) {
                    resp.json().then(function (json) {
                      try {
                        resolve(json);
                      } catch (e) {
                        _Logger["default"].error('FigmaService.getRaw() > Error', e);

                        resolve(null);
                      }
                    });
                  }, function (err) {
                    reject(err);
                  });
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getRaw(_x) {
        return _getRaw.apply(this, arguments);
      }

      return getRaw;
    }()
  }, {
    key: "getPages",
    value: function getPages(fModel) {
      _Logger["default"].log(-1, 'getPages() > enter');

      var pages = [];
      var fDoc = fModel.document;

      if (fDoc.children) {
        fDoc.children.forEach(function (page) {
          pages.push({
            id: page.id,
            value: page.id,
            label: page.name
          });
        });
      }

      _Logger["default"].log(-1, 'getPages() > exit', pages);

      return pages;
    }
  }, {
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(key) {
        var _this3 = this;

        var importChildren,
            allAsVecor,
            selectedPages,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                importChildren = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : true;
                allAsVecor = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;
                selectedPages = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : [];
                this.allAsVecor = allAsVecor;
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  var url = _this3.baseURL + 'files/' + key + '?geometry=paths&plugin_data=' + _this3.pluginId;
                  fetch(url, {
                    method: 'get',
                    credentials: "same-origin",
                    headers: _this3._createDefaultHeader()
                  }).then(function (resp) {
                    resp.json().then(function (json) {
                      try {
                        var app = _this3.parse(key, json, importChildren, selectedPages);

                        resolve(app);
                      } catch (e) {
                        _Logger["default"].error('FigmaService.get() > Error', e);

                        resolve(null);
                      }
                    });
                  }, function (err) {
                    reject(err);
                  });
                }));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function get(_x2) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "getImages",
    value: function getImages(key, ids) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        /**
         * Get in double resolution
         */
        var url = _this4.baseURL + 'images/' + key + "?format=png&scale=".concat(_this4.imageScaleFactor, "&ids=") + ids;
        fetch(url, {
          method: 'get',
          credentials: "same-origin",
          headers: _this4._createDefaultHeader()
        }).then(function (resp) {
          resp.json().then(function (json) {
            try {
              resolve(json);
            } catch (err) {
              _Logger["default"].error('FigmaService.getImages() > Error', err);

              reject(err);
            }
          });
        }, function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: "parse",
    value: function () {
      var _parse = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id, fModel) {
        var _this5 = this;

        var importChildren,
            selectedPages,
            model,
            fDoc,
            _args3 = arguments;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                importChildren = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : true;
                selectedPages = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : [];

                _Logger["default"].log(3, 'FigmaService.parse() > enter importChildren:' + importChildren, fModel);

                this.errors = [];
                model = this.createApp(id, fModel);
                fDoc = fModel.document; // add some lookup maps for speedy lookups later

                fModel._elementsById = {};
                fModel._elementsToWidgets = {};

                if (fDoc.children) {
                  fDoc.children.forEach(function (page) {
                    if (selectedPages.length === 0 || selectedPages.indexOf(page.name) >= 0) {
                      _Logger["default"].log(1, 'FigmaService.parse() > parse page:' + page.name);

                      if (page.children) {
                        page.children.forEach(function (child) {
                          if (!_this5.isInvisible(child)) {
                            if (_this5.isFrame(child)) {
                              _this5.parseScreen(child, model, fModel, importChildren, page);
                            }

                            if (_this5.isComponet(child) || _this5.isComponentSet(child)) {
                              _this5.parseComponent(child, model, fModel, importChildren, page);
                            }
                          }
                        });
                      }
                    }
                  });
                }
                /**
                 * Set varients for designlets
                 */


                this.setVarientComponents(model, fModel);
                /**
                 * Fix the lines that are until now with figma ids
                 */

                this.setLineTos(model, fModel);
                /**
                 * now find the dynamic components
                 */

                this.setDynamicComponents(model, fModel);
                /**
                 * Get download images for all
                 */

                _context3.next = 14;
                return this.addBackgroundImages(id, model, importChildren);

              case 14:
                return _context3.abrupt("return", model);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function parse(_x3, _x4) {
        return _parse.apply(this, arguments);
      }

      return parse;
    }()
  }, {
    key: "setDynamicComponents",
    value: function setDynamicComponents(qModel, fModel) {
      var _this6 = this;

      _Logger["default"].log(2, 'FigmaService.setDynamicComponents() > enter');
      /**
       * 1) Check all component lines
       *
       * 2) Take the source
       *
       * 3) Check of teh target is a componnt
       *
       * 5) Find out of the target is in a componentSet
       *
       * 5) If so, make it a dynamic component, including references of the
       */


      Object.values(qModel.widgets).forEach(function (qWidget) {
        if (qWidget.fimgaTransitionNodeID && qWidget.figmaType === 'INSTANCE') {
          var target = fModel._elementsById[qWidget.fimgaTransitionNodeID];

          if (target && target._parent) {
            var parent = target._parent;

            if (parent.type === 'COMPONENT_SET' && parent.children) {
              qWidget.type = _this6.getDynamicType(parent);
              qWidget.props.dynamicChildren = [];
              qWidget.props.dynamicLines = [];
              var parentWidgetId = fModel._elementsToWidgets[parent.id];
              qWidget.props.dynamicParent = parentWidgetId;
              /**
               * Check if the children are all the same, so we can set the animation type to transform...
               */

              parent.children.forEach(function (fChild) {
                var childId = fModel._elementsToWidgets[fChild.id];

                if (childId) {
                  var qChild = qModel.widgets[childId];
                  qWidget.props.dynamicChildren.push(childId);

                  if (fChild.id === qWidget.figmaComponentId) {
                    qWidget.props.dynamicStart = childId;
                  }

                  var figmaLines = _this6.parseFigmaAnitions(qChild.props.figmaAnimation);

                  if (figmaLines && figmaLines.length > 0) {
                    figmaLines.forEach(function (fLine) {
                      var targetId = fModel._elementsToWidgets[fLine.figmaTo];

                      if (targetId) {
                        console.debug('dynamic line', fLine.event, fLine.animation);
                        qWidget.props.dynamicLines.push({
                          from: childId,
                          to: targetId,
                          duration: fLine.duration,
                          animation: fLine.animation,
                          event: fLine.event
                        });
                      }
                    });
                  } else if (fChild.transitionNodeID) {
                    var targetId = fModel._elementsToWidgets[fChild.transitionNodeID];
                    qWidget.props.dynamicLines.push({
                      from: childId,
                      to: targetId,
                      duration: fChild.transitionDuration,
                      animation: 'none',
                      event: 'click'
                    });
                  }
                }
              });

              _Logger["default"].log(3, 'FigmaService.setDynamicComponents() > ' + qWidget.name, qWidget.props.dynamicStart, qWidget.props.dynamicChildren);

              _Logger["default"].log(3, 'FigmaService.setDynamicComponents() > ' + qWidget.name, qWidget.props.dynamicLines, qWidget.props.dynamicParent);
            }
          }
        }
      });
    }
  }, {
    key: "parseFigmaAnitions",
    value: function parseFigmaAnitions(figmaAnimations) {
      var _this7 = this;

      if (figmaAnimations) {
        var lines = figmaAnimations.map(function (anim) {
          var line = {};
          line.animation = 'none';
          line.duration = 200;

          if (anim.trigger && anim.action) {
            var trigger = anim.trigger.type;
            var action = anim.action;

            if (_this7.figmaAnimationTypeMapping[trigger]) {
              line.event = _this7.figmaAnimationTypeMapping[trigger];
            }

            line.figmaTo = action.destinationId;
            line.figmaFrom = '';

            if (action.transition) {
              var transition = action.transition;

              if (transition.type === 'SMART_ANIMATE') {
                line.animation = 'transform';
              }

              if (transition.easing && _this7.figmaAnimationEasingMapping[transition.easing]) {
                line.easing = _this7.figmaAnimationEasingMapping[transition.easing];
              }

              line.duration = Math.round(transition.duration * 1000);
            } //console.debug(JSON.stringify(anim), JSON.stringify(line))


            return line;
          }
        });
        return lines;
      }

      return null;
    }
  }, {
    key: "getDynamicType",
    value: function getDynamicType(fComponentSet) {
      _Logger["default"].log(3, 'FigmaService.getDynamicType()', fComponentSet.name);

      return 'DynamicContainer';
    }
    /**
     * Set for each instance the id to the parent. Why??
     */

  }, {
    key: "setVarientComponents",
    value: function setVarientComponents(qModel) {
      var _this8 = this;

      // console.debug('setInstanceComponents')

      /**
       * Mark all elements of a variant as a component for the
       * design lets
       */
      var varientComponents = {};
      Object.values(qModel.widgets).forEach(function (widget) {
        var parent = qModel.widgets[widget.parentId];

        if (parent && parent.figmaType === 'COMPONENT_SET') {
          widget.props.isComponet = true;
          widget.props.isVaraint = true;
          widget.variant = _this8.parseVariant(widget.name);

          if (!varientComponents[widget.parentId]) {
            varientComponents[widget.parentId] = [];
          }

          varientComponents[widget.parentId].push(widget);
          /**
           * Give a better na,e other wise css will fail
           */

          widget.name = parent.name + '-' + Object.values(widget.variant).join('-');
        }
      });
    }
  }, {
    key: "parseVariant",
    value: function parseVariant(str) {
      var result = {};
      /**
       * Figma somehpw changed the name of the varient...
       */

      if (str.indexOf('-') >= 0) {
        str.split('-').map(function (s) {
          return s.split('=');
        }).filter(function (pair) {
          return pair.length > 1;
        }).forEach(function (pair) {
          return result[pair[0].trim()] = pair[1].trim();
        });
      } else {
        str.split(',').map(function (s) {
          return s.split('=');
        }).filter(function (pair) {
          return pair.length > 1;
        }).forEach(function (pair) {
          return result[pair[0].trim()] = pair[1].trim();
        });
      }

      _Logger["default"].log(2, 'FigmaService.addBackgroundImages() > parseVariant', str, result);

      return result;
    }
  }, {
    key: "getParentVarientComponent",
    value: function getParentVarientComponent(widget, widgetsByFigmaID, qModel) {
      var parent = widgetsByFigmaID[widget.figmaComponentId];

      while (parent && parent.figmaType !== 'VARIANT_COMPONENT') {
        parent = qModel.widgets[parent.parentId];
      }

      return parent;
    }
  }, {
    key: "setLineTos",
    value: function setLineTos(model) {
      var widgetMapping = {};
      Object.values(model.widgets).forEach(function (w) {
        widgetMapping[w.figmaId] = w.id;
      });
      var screenMapping = {};
      Object.values(model.screens).forEach(function (s) {
        screenMapping[s.figmaId] = s.id;
      });
      Object.values(model.lines).forEach(function (line) {
        line.from = widgetMapping[line.figmaFrom];

        if (screenMapping[line.figmaTo]) {
          line.to = screenMapping[line.figmaTo];
        }

        if (widgetMapping[line.figmaTo]) {
          line.to = widgetMapping[line.figmaTo];
          line.isComponentLine = true;
        }
      });
    }
  }, {
    key: "addBackgroundImages",
    value: function () {
      var _addBackgroundImages = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(id, model, importChildren) {
        var _this9 = this;

        var vectorWidgets, batches, promisses;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _Logger["default"].log(1, 'FigmaService.addBackgroundImages() > importChildren', importChildren);

                if (!this.downloadVectors) {
                  _context4.next = 11;
                  break;
                }

                vectorWidgets = this.getElementsWithBackgroundIMage(model, importChildren);

                if (!(vectorWidgets.length > 0)) {
                  _context4.next = 9;
                  break;
                }

                _Logger["default"].log(-1, 'FigmaService.addBackgroundImages() > vectors', vectorWidgets.length);

                batches = this.getChunks(vectorWidgets, this.max_ids);
                promisses = batches.map(function (batch, i) {
                  return _this9.addBackgroundImagesBatch(id, batch, i, batches.length);
                });
                _context4.next = 9;
                return Promise.all(promisses);

              case 9:
                _context4.next = 12;
                break;

              case 11:
                _Logger["default"].log(3, 'FigmaService.addBackgroundImages() > Skip');

              case 12:
                _Logger["default"].log(3, 'FigmaService.addBackgroundImages() > exit');

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function addBackgroundImages(_x5, _x6, _x7) {
        return _addBackgroundImages.apply(this, arguments);
      }

      return addBackgroundImages;
    }()
  }, {
    key: "getElementsWithBackgroundIMage",
    value: function getElementsWithBackgroundIMage(model, importChildren) {
      if (importChildren) {
        return Object.values(model.widgets).filter(function (widget) {
          return widget.props.isVector || widget.hasBackgroundImage;
        });
      } else {
        return Object.values(model.screens);
      }
    }
  }, {
    key: "addBackgroundImagesBatch",
    value: function () {
      var _addBackgroundImagesBatch = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(id, batch, i, totalNumberOfBatches) {
        var _this10 = this;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _Logger["default"].log(1, 'FigmaService.addBackgroundImagesBatch() > start', i);

                return _context5.abrupt("return", new Promise(function (resolve, reject) {
                  setTimeout(function () {
                    var vectorWidgetIds = batch.map(function (w) {
                      return w.figmaId;
                    }).join(',');

                    _this10.getImages(id, vectorWidgetIds).then(function (imageResponse) {
                      if (imageResponse.err === null) {
                        _Logger["default"].log(3, 'FigmaService.addBackgroundImagesBatch () > end', i);

                        var images = imageResponse.images;
                        batch.forEach(function (w) {
                          var image = images[w.figmaId];

                          if (image) {
                            w.props.figmaImage = image;
                          } else {
                            _Logger["default"].error('FigmaService.addBackgroundImagesBatch() > Cannot get image for ', w);

                            _this10.errors.push({
                              type: 'ImageGetError',
                              data: w
                            });
                          }

                          resolve(batch);
                        });
                      } else {
                        _Logger["default"].error('FigmaService.addBackgroundImagesBatch () > Could not get images', imageResponse);

                        reject(imageResponse.err);
                      }
                    }, function (err) {
                      _Logger["default"].error('FigmaService.addBackgroundImagesBatch() > Could not get images', err);

                      reject(err);
                    });
                  }, _this10.getImageTimeout(i, totalNumberOfBatches));
                }));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function addBackgroundImagesBatch(_x8, _x9, _x10, _x11) {
        return _addBackgroundImagesBatch.apply(this, arguments);
      }

      return addBackgroundImagesBatch;
    }()
  }, {
    key: "getImageTimeout",
    value: function getImageTimeout(i, totalNumberOfBatches) {
      if (totalNumberOfBatches > this.throttleRequestThreshold) {
        _Logger["default"].warn("igmaService.getImageTimeout () > Throttle requests. Delay request ".concat(i, " by ").concat(i * this.throttleRequestTimeout, " ms"));

        return i * this.throttleRequestTimeout;
      }

      return 0;
    }
  }, {
    key: "getChunks",
    value: function getChunks(array, size) {
      var result = [];

      for (var i = 0; i < array.length; i += size) {
        var chunk = array.slice(i, i + size);
        result.push(chunk);
      }

      return result;
    }
  }, {
    key: "parseComponent",
    value: function parseComponent(fElement, qModel, fModel, importChildren, page) {
      _Logger["default"].log(3, 'FigmaService.parseComponent()', fElement.name);
      /**
       * We create a wrapper screen!
       */


      var pos = this.getPosition(fElement);
      var qScreen = {
        id: 's' + this.getUUID(qModel),
        figmaId: fElement.id,
        pageName: page.name,
        name: fElement.name + 'Wrapper',
        isComponentScreen: true,
        type: 'Screen',
        x: pos.x,
        y: pos.y,
        w: pos.w,
        h: pos.h,
        props: {},
        children: [],
        style: {
          background: 'transparent'
        }
      };
      qModel.screens[qScreen.id] = qScreen;
      this.getPluginData(fElement, qScreen, fModel);
      this.parseElement(fElement, qScreen, fElement, qModel, fModel, qScreen.id);
    }
  }, {
    key: "parseScreen",
    value: function parseScreen(fScreen, model, fModel, importChildren, page) {
      var _this11 = this;

      _Logger["default"].log(3, 'FigmaService.parseScreen()', fScreen.name);

      var pos = this.getPosition(fScreen);
      var qScreen = {
        id: 's' + this.getUUID(model),
        figmaId: fScreen.id,
        pageName: page.name,
        name: fScreen.name,
        type: 'Screen',
        x: pos.x,
        y: pos.y,
        w: pos.w,
        h: pos.h,
        props: {},
        children: [],
        layout: {},
        style: this.getStyle(fScreen)
      };
      qScreen = this.getLayout(fScreen, qScreen);
      this.getPluginData(fScreen, qScreen, fModel);

      if (fScreen.children) {
        fScreen.children.forEach(function (child) {
          child._parent = fScreen;

          _this11.parseElement(child, qScreen, fScreen, model, fModel, qScreen.id);
        });
      }
      /**
       * Or check prototypeDevice
       */


      model.screenSize.w = model.screenSize.w === -1 ? pos.w : Math.max(model.screenSize.w, pos.w);
      model.screenSize.h = model.screenSize.h === -1 ? pos.h : Math.max(model.screenSize.h, pos.h);
      model.screens[qScreen.id] = qScreen;

      _Logger["default"].log(4, 'FigmaService.parseScreen() exit ', fScreen.name, qScreen.id);

      return qScreen;
    }
  }, {
    key: "parseElement",
    value: function parseElement(element, qScreen, fScreen, model, fModel, qParentId, qParent) {
      var _this12 = this;

      _Logger["default"].log(5, 'FigmaService.parseElement() > enter: ' + element.name, element.type);

      var widget = null;

      if (!this.isIgnored(element) && !this.isInvisible(element)) {
        var pos = this.getPosition(element);
        var qID = 'w' + this.getUUID(model);
        widget = {
          id: qID,
          parentId: qParentId,
          name: this.getFigmaName(element, qID),
          type: this.getType(element),
          figmaId: element.id,
          figmaType: element.type,
          figmaComponentId: this.getFigmaComponentId(element),
          fimgaTransitionNodeID: element.transitionNodeID,
          x: pos.x,
          y: pos.y,
          w: pos.w,
          h: pos.h,
          layout: {},
          z: this.getZ(element, model)
        };
        widget.style = this.getStyle(element, widget);
        widget.props = this.getProps(element, widget);
        widget.has = this.getHas(element, widget);
        widget = this.getPluginData(element, widget, fModel);
        widget = this.getLayout(element, widget, qParent);
        fModel._elementsById[element.id] = element;
        fModel._elementsToWidgets[element.id] = qID;
        model.widgets[widget.id] = widget;
        qScreen.children.push(widget.id);
        /**
         * Update the parent id, so we can have the correct hierachy
         */

        qParentId = widget.id;
        qParent = widget;
      } else {
        _Logger["default"].log(4, 'FigmaService.parseElement() >Ignore: ' + element.name, element.type);
        /**
         * What if we have defined the callbacks and on a compomemt?
         */

      }
      /**
       * Go down recursive...
       */


      if (element.children) {
        /**
         * We do not go down on vector elements and hidden elements.
         */
        if (!this.isVector(element) && !this.isInvisible(element) && !this.isCustomVector(element)) {
          element.children.forEach(function (child) {
            if (child.visible !== false) {
              child._parent = element;

              _Logger["default"].log(3, 'FigmaService.parseElement() > go recursive', element);

              _this12.parseElement(child, qScreen, fScreen, model, fModel, qParentId, qParent);
            }
          });
        } else {
          _Logger["default"].log(6, 'FigmaService.parseElement() > No recursive: ' + element.name, element.type);
        }
      }

      this.addTempLine(element, model, widget);
      return widget;
    }
  }, {
    key: "getFigmaComponentId",
    value: function getFigmaComponentId(fElement) {
      if (fElement.type === 'INSTANCE') {
        return fElement.componentId;
      }

      if (fElement.id.indexOf('I') === 0) {
        var parts = fElement.id.split(';');

        if (parts.length === 2) {
          return parts[1];
        }
      }
    }
  }, {
    key: "getFigmaName",
    value: function getFigmaName(element, qID) {
      /**
       * FIXME: Check if teh name is tool long or has spaces or shit...
       */
      var name = element.name;

      if (name.length > 50) {
        name = qID;
      }

      return name.replace(/#/g, '').replace(/\//g, '-').replace(/&/g, '').replace(/,/g, '-');
    }
  }, {
    key: "addTempLine",
    value: function addTempLine(fElement, model, widget) {
      _Logger["default"].log(4, 'FigmaService.addLine() > enter', fElement.name, 'transition :' + fElement.transitionNodeID, fElement);

      if (fElement.transitionNodeID) {
        var clickChild = this.getFirstNoIgnoredChild(fElement);

        _Logger["default"].log(6, 'addLine() >  : ', fElement.name, clickChild);

        var line = {
          id: 'l' + this.getUUID(model),
          from: null,
          to: null,
          figmaFrom: clickChild.id,
          figmaTo: fElement.transitionNodeID,
          points: [],
          event: "click",
          animation: "",
          duration: fElement.transitionDuration
        };

        if (widget && widget.props.figmaAnimation) {// add animation stuff and easing...
        }

        model.lines[line.id] = line;
      }
    }
  }, {
    key: "getFirstNoIgnoredChild",
    value: function getFirstNoIgnoredChild(element) {
      /**
       * We do not render instance wrappers, so we take the first child.
       */
      if (this.isIgnored(element) && element.children.length > 0) {
        _Logger["default"].log(5, 'FigmaService.getFirstNoIgnoredChild() >  take child ', element.name);

        return this.getFirstNoIgnoredChild(element.children[0]);
      }

      return element;
    }
  }, {
    key: "getPluginData",
    value: function getPluginData(element, widget) {
      if (element.pluginData && element.pluginData[this.pluginId]) {
        var pluginData = element.pluginData[this.pluginId];

        if (pluginData.quxType) {
          _Logger["default"].log(2, 'FigmaService.getPluginData() > quxType : ', pluginData.quxType, element.name);

          widget.type = pluginData.quxType;
          widget.props.placeholder = true;
          /**
           * SmartContainer has a subType
           */

          if (pluginData.quxType === 'SmartContainer' && pluginData.quxSmartContainerType) {
            _Logger["default"].log(2, 'FigmaService.getPluginData() > quxSmartContainerType : ', pluginData.quxSmartContainerType, element.name);

            widget.type = pluginData.quxSmartContainerType;
            widget.smartContainerType = pluginData.quxSmartContainerType;
          }

          if (pluginData.quxType === 'Image' && pluginData.quxDataBindingDefault) {
            widget.type = 'UploadPreview';
          }

          if (pluginData.quxType === 'Vector') {
            widget.props.isVector = true;
          }
        }

        if (pluginData.quxMetaDescription) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxMetaDescription: ', pluginData.quxMetaDescription, element.name);

          if (!widget.meta) {
            widget.meta = {};
          }

          widget.meta.description = pluginData.quxMetaDescription;
        }

        if (pluginData.quxMetaKeyWords) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxMetaKeyWords: ', pluginData.quxMetaKeyWords, element.name);

          if (!widget.meta) {
            widget.meta = {};
          }

          widget.meta.keywords = pluginData.quxMetaKeyWords;
        }

        if (pluginData.quxDataValue) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxDataValue: ', pluginData.quxDataValue, element.name);

          widget.props.dataValue = pluginData.quxDataValue;
        }

        if (pluginData.quxLinkUrl) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxLinkUrl: ', pluginData.quxLinkUrl, element.name);

          widget.props.url = pluginData.quxLinkUrl;
        }

        if (pluginData.quxTypeCustom) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxTypeCustom: ', pluginData.quxOnChangeCallback, element.name);

          widget.props.customComponent = pluginData.quxTypeCustom;
        }

        if (pluginData.quxAnimationProps) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxAnimationProps: ', pluginData.quxAnimationProps, element.name);

          try {
            widget.props.figmaAnimation = JSON.parse(pluginData.quxAnimationProps);
          } catch (err) {
            _Logger["default"].error('FigmaService.getPluginData() > quxAnimationProps Could not parse ', pluginData.quxAnimationProps);
          }
        }

        if (pluginData.quxDataBindingDefault) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxDataBindingDefault : ', pluginData.quxDataBindingDefault, element.name);

          if (!widget.props.databinding) {
            widget.props.databinding = {};
          }

          widget.props.databinding['default'] = pluginData.quxDataBindingDefault;
        }

        if (pluginData.quxDataBindingOutput) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxDataBindingOutput : ', pluginData.quxDataBindingOutput, element.name);

          if (!widget.props.databinding) {
            widget.props.databinding = {};
          }

          widget.props.databinding['output'] = pluginData.quxDataBindingOutput;
        }

        if (pluginData.quxDataBindingOptions) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxDataBindingOptions : ', pluginData.quxDataBindingOptions, element.name);

          if (!widget.props.databinding) {
            widget.props.databinding = {};
          }

          widget.props.databinding['options'] = pluginData.quxDataBindingOptions;
        }

        if (pluginData.quxOnClickCallback) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxOnClickCallback: ', pluginData.quxOnClickCallback, element.name);

          if (!widget.props.callbacks) {
            widget.props.callbacks = {};
          }

          widget.props.callbacks.click = pluginData.quxOnClickCallback;
        }

        if (pluginData.quxOnLoadCallback) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxOnLoadCallback: ', pluginData.quxOnLoadCallback, element.name);

          if (!widget.props.callbacks) {
            widget.props.callbacks = {};
          }

          widget.props.callbacks.load = pluginData.quxOnLoadCallback;
        }

        if (pluginData.quxOnChangeCallback) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxOnChangeCallback: ', pluginData.quxOnChangeCallback, element.name);

          if (!widget.props.callbacks) {
            widget.props.callbacks = {};
          }

          widget.props.callbacks.change = pluginData.quxOnChangeCallback;
        }

        if (pluginData.quxOptions) {
          _Logger["default"].log(3, 'FigmaService.getPluginData() > quxOptions: ', pluginData.quxOptions, element.name);

          widget.props.options = pluginData.quxOptions.split(';');
        }
        /**
         * Hover
         */


        if (pluginData.quxStyleHoverBackground) {
          this.addDynamicStyle(widget, 'hover', 'background', pluginData.quxStyleHoverBackground);
        }

        if (pluginData.quxStyleHoverBorder) {
          this.addDynamicStyle(widget, 'hover', 'borderColor', pluginData.quxStyleHoverBorder);
        }

        if (pluginData.quxStyleHoverColor) {
          this.addDynamicStyle(widget, 'hover', 'color', pluginData.quxStyleHoverColor);
        }
        /**
         * DropDown
         */


        if (pluginData.quxStyleDropDownColor) {
          this.addDynamicStyle(widget, 'style', 'popupColor', pluginData.quxStyleDropDownColor);
        }

        if (pluginData.quxStyleDropDownBackground) {
          this.addDynamicStyle(widget, 'style', 'popupBackground', pluginData.quxStyleDropDownBackground);
        }

        if (pluginData.quxStyleDropDownBorder) {
          this.addDynamicStyle(widget, 'style', 'popupBorder', pluginData.quxStyleDropDownBorder);
        }
        /**
         * Focus
         */


        if (pluginData.quxStyleFocusBackground) {
          this.addDynamicStyle(widget, 'focus', 'background', pluginData.quxStyleFocusBackground);
        }

        if (pluginData.quxStyleFocusBorder) {
          this.addDynamicStyle(widget, 'focus', 'borderColor', pluginData.quxStyleFocusBorder);
        }

        if (pluginData.quxStyleFocusColor) {
          this.addDynamicStyle(widget, 'focus', 'color', pluginData.quxStyleFocusColor);
        }
        /**
         * Style stuff
         */


        if (pluginData.quxFixedHorizontal === 'true') {
          _Logger["default"].warn('FigmaService.getPluginData() > DEPRECTAED quxFixedHorizontal: ', pluginData.quxFixedHorizontal, element.name); //this.setFixedHozontal(widget, true)

        }

        if (pluginData.quxFixedVertical === 'true') {
          _Logger["default"].log('FigmaService.getPluginData() > DEPRECTAED quxFixedVertical: ', pluginData.quxFixedVertical, element.name); // this.setFixedVertical(widget)

        }
        /**
         * Screen stuff
         */


        if (pluginData.quxStartScreen === 'true') {
          _Logger["default"].log(1, 'FigmaService.getPluginData() > quxStartScreen: ', pluginData.quxStartScreen, element.name);

          widget.props.start = true;
        }

        if (pluginData.quxOverlayScreen === 'true') {
          _Logger["default"].log(4, 'FigmaService.getPluginData() > quxOverlayScreen: ', pluginData.quxOverlayScreen, element.name);

          widget.style.overlay = true;
        }

        if (pluginData.quxHasOverlayBackground === 'true') {
          _Logger["default"].log(4, 'FigmaService.getPluginData() > quxHasOverlayBackground: ', pluginData.quxHasOverlayBackground, element.name);

          widget.style.hasBackground = true;
        }
        /**
         * Breakpoints
         */


        if (pluginData.quxBreakpointMobile === 'true') {
          if (!widget.props.breakpoints) {
            widget.props.breakpoints = {};
          }

          _Logger["default"].log(4, 'FigmaService.getPluginData() > quxBreakpointMobile: ', pluginData.quxBreakpointMobile, element.name);

          widget.props.breakpoints.mobile = true;
        }

        if (pluginData.quxBreakpointTablet === 'true') {
          if (!widget.props.breakpoints) {
            widget.props.breakpoints = {};
          }

          _Logger["default"].log(4, 'FigmaService.getPluginData() > quxBreakpointTablet: ', pluginData.quxBreakpointTablet, element.name);

          widget.props.breakpoints.tablet = true;
        }

        if (pluginData.quxBreakpointDesktop === 'true') {
          if (!widget.props.breakpoints) {
            widget.props.breakpoints = {};
          }

          _Logger["default"].log(4, 'FigmaService.getPluginData() > quxBreakpointDesktop: ', pluginData.quxBreakpointDesktop, element.name);

          widget.props.breakpoints.desktop = true;
        }

        if (pluginData.quxStyleDisplay) {
          _Logger["default"].log(4, 'FigmaService.getPluginData() > quxStyleDisplay: ', pluginData.quxStyleDisplay, element.name);

          widget.style.display = pluginData.quxStyleDisplay;
        }

        if (pluginData.quxStyleCursor) {
          _Logger["default"].log(4, 'FigmaService.getPluginData() > quxStyleCursor: ', pluginData.quxStyleCursor, element.name);

          widget.style.cursor = pluginData.quxStyleCursor;
        }

        if (pluginData.quxStyleMaxWidth) {
          _Logger["default"].log(4, 'FigmaService.getPluginData() > quxStyleMaxWidth: ', pluginData.quxStyleMaxWidth, element.name);

          widget.style.maxWidth = pluginData.quxStyleMaxWidth;
        }

        if (pluginData.quxStyleMinWidth) {
          _Logger["default"].log(4, 'FigmaService.getPluginData() > quxStyleMinWidth: ', pluginData.quxStyleMinWidth, element.name);

          widget.style.minWidth = pluginData.quxStyleMinWidth;
        }

        if (pluginData.quxWrapContent) {
          _Logger["default"].log(-1, 'FigmaService.getPluginData() > quxWrapContent: ', pluginData.quxWrapContent, element.name);

          widget.style.layout = 'Wrap';
        }
      }

      return widget;
    }
  }, {
    key: "setFixedHozontal",
    value: function setFixedHozontal(widget) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!widget.props.resize) {
        widget.props.resize = {};
      }

      widget.props.resize.fixedHorizontal = value;
    }
  }, {
    key: "setHugHozontal",
    value: function setHugHozontal(widget) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!widget.props.resize) {
        widget.props.resize = {};
      }

      widget.props.resize.hugHorizontal = value;
    }
  }, {
    key: "setFixedVertical",
    value: function setFixedVertical(widget) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!widget.props.resize) {
        widget.props.resize = {};
      }

      widget.props.resize.fixedVertical = value;
    }
  }, {
    key: "setHugVertical",
    value: function setHugVertical(widget) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!widget.props.resize) {
        widget.props.resize = {};
      }

      widget.props.resize.hugVertical = value;
    }
  }, {
    key: "addDynamicStyle",
    value: function addDynamicStyle(widget, type, key, value) {
      if (!widget[type]) {
        widget[type] = {};
      }

      widget[type][key] = value;
    }
  }, {
    key: "getProps",
    value: function getProps(element, widget) {
      var props = {};

      if (this.isVector(element)) {
        //console.debug('FigmaService.getProps() > make vector', element)
        props.paths = element.strokeGeometry;
        props.relativeTransform = element.relativeTransform;
        props.isVector = true;
      }

      if (this.isLabel(widget)) {
        if (element.characters) {
          props.label = element.characters;
        } else {
          props.label = element.name;
        }
      }

      if (widget.type === 'RichText') {
        props.richTextLabel = this.getRichText(element, props.label);
      }
      /**
       * Add here constraints.
       * Since 0.5 keep the normaal figma constraints and make elements fixed and not pinned right
       */


      if (this.pinnRight) {
        props.resize = {
          right: true,
          left: true,
          up: false,
          down: false,
          fixedHorizontal: false,
          fixedVertical: false
        };
      } else {
        props.resize = {
          right: false,
          left: true,
          up: false,
          down: false,
          fixedHorizontal: true,
          fixedVertical: false
        };
      }
      /**
       * FIXME: Should come only after plugin data...
       */


      this.setContraints(element, props);
      return props;
    }
  }, {
    key: "getRichText",
    value: function getRichText(fElement, label) {
      _Logger["default"].log(2, 'FigmaService.getRichText() >', fElement.name, label);

      var children = [];
      var characterStyleOverrides = fElement.characterStyleOverrides;
      var currentChild = {};
      var lastOverride = -1;

      for (var i = 0; i < label.length; i++) {
        // ending zeros are not added
        var override = characterStyleOverrides[i] !== undefined ? characterStyleOverrides[i] : 0 + '';

        if (override !== lastOverride) {
          currentChild = {
            label: '',
            style: this.getRichTextStyle(fElement.styleOverrideTable[override])
          };
          children.push(currentChild);
        }

        currentChild.label += label[i];
        lastOverride = override;
      }

      return children;
    }
  }, {
    key: "getRichTextStyle",
    value: function getRichTextStyle(fStyle) {
      if (fStyle) {
        var result = {};

        if (fStyle.fills) {
          if (fStyle.fills.length === 1) {
            var fill = fStyle.fills[0];

            if (fill.type === 'SOLID') {
              result.color = this.getColor(fill.color, fill);
            }
          }
        }

        this.setTextStyle(fStyle, result);
        return result;
      }

      return undefined;
    }
  }, {
    key: "getLayout",
    value: function getLayout(fElement, qElement, qParentElement) {
      if (fElement.layoutMode === 'HORIZONTAL') {
        qElement.layout.type = _Const.Layout.AutoHorizontal;
        qElement.layout.justifyContent = this.mapAlign(fElement.primaryAxisAlignItems);
        qElement.layout.alignItems = this.mapAlign(fElement.counterAxisAlignItems);
      }

      if (fElement.layoutMode === 'VERTICAL') {
        qElement.layout.type = _Const.Layout.AutoVertical;
        qElement.layout.justifyContent = this.mapAlign(fElement.primaryAxisAlignItems);
        qElement.layout.alignItems = this.mapAlign(fElement.counterAxisAlignItems);
      }

      if (fElement.itemSpacing !== undefined) {
        qElement.layout.itemSpacing = fElement.itemSpacing;
      }
      /**
       * FXIME: This fucks up the reponsive ness
       */


      if (fElement.layoutGrow === 0.0) {
        this.setFixedHozontal(qElement, true);
      }

      if (fElement.layoutGrow === 1) {
        this.setFixedHozontal(qElement, false);
      }
      /**
       * We set also hug, as the absense of FIXED in a auto layout parent
       */


      if (fElement._parent) {
        if (fElement._parent.layoutMode === 'HORIZONTAL') {
          if (fElement.primaryAxisSizingMode !== "FIXED" && fElement.layoutGrow === 0 && this.hasFigmaChildren(fElement)) {
            // FIXME: We should set hug only on 
            this.setHugHozontal(qElement, true);
          }
        }

        if (fElement._parent.layoutMode === 'VERTICAL') {
          if (fElement.primaryAxisSizingMode !== "FIXED" && fElement.layoutGrow === 0 && this.hasFigmaChildren(fElement)) {
            this.setHugVertical(qElement, true);
          }
        }
      }

      if (fElement.layoutAlign !== undefined) {
        if (fElement.layoutAlign === 'STRETCH') {
          // FIXME: here is some werid figma behavior fElement.layoutGrow === 0.0
          this.setFixedHozontal(qElement, false);
        }

        qElement.layout.align = fElement.layoutAlign;
      }
      /** 
       * I am not sure what this means
      if (fElement.primaryAxisSizingMode === "FIXED") {
        this.setFixedHozontal(qElement, true)
      }
      */


      qElement.layout.grow = fElement.layoutGrow;
      /**
       * We have to substract borders, because of the outer border of Figma
       */

      qElement.layout.paddingLeft = this.mapPadding(fElement.paddingLeft, qElement.style.borderLeftWidth);
      qElement.layout.paddingRight = this.mapPadding(fElement.paddingRight, qElement.style.borderRightWidth);
      qElement.layout.paddingTop = this.mapPadding(fElement.paddingTop, qElement.style.borderTopWidth);
      qElement.layout.paddingBottom = this.mapPadding(fElement.paddingBottom, qElement.style.borderBottomWidth);

      if (this.isFixedChildInAutoParentWithSameWidth(qElement, qParentElement)) {
        this.setFixedHozontal(qElement, false);
      }

      return qElement;
    }
  }, {
    key: "hasFigmaChildren",
    value: function hasFigmaChildren(fElement) {
      return fElement.children && fElement.children.length > 0;
    }
  }, {
    key: "isFixedChildInAutoParentWithSameWidth",
    value: function isFixedChildInAutoParentWithSameWidth(qElement, qParentElement) {
      if (this.fixed2Fill && qParentElement && (0, _ExportUtil.isFixedHorizontal)(qElement) && (0, _ExportUtil.isLayoutAutovertical)(qParentElement)) {
        var parentPaddingHorizontal = (0, _ExportUtil.getAutoPaddingHorizontal)(qParentElement);
        var dif = Math.abs(qParentElement.w - parentPaddingHorizontal) - qElement.w;

        if (dif < 1) {
          _Logger["default"].log(-1, "FigmaService.isFixedChildInAutoParentWithSameWidth() > fix " + qElement.name, dif);

          return true;
        }
      }

      return false;
    }
  }, {
    key: "mapPadding",
    value: function mapPadding(padding, border) {
      var p = padding ? padding : 0;
      var b = border ? border : 0;
      return p - b;
    }
  }, {
    key: "mapAlign",
    value: function mapAlign(v) {
      if (this.figmaAlignMapping[v]) {
        return this.figmaAlignMapping[v];
      } // default is start


      return 'flex-start';
    }
  }, {
    key: "setContraints",
    value: function setContraints(element, props) {
      if (element.constraints) {
        var horizontal = element.constraints.horizontal;

        switch (horizontal) {
          case 'RIGHT':
            props.resize.left = false;
            props.resize.right = true;
            props.resize.fixedHorizontal = false;
            break;

          case 'LEFT_RIGHT':
            _Logger["default"].log(2, 'FigmaService.setContraints() > LEFT_RIGHT', element.name);

            props.resize.left = true;
            props.resize.right = true;
            props.resize.fixedHorizontal = false;
            break;

          default:
            break;
        }

        var vertical = element.constraints.vertical;

        switch (vertical) {
          case 'TOP_BOTTOM':
            _Logger["default"].log(2, 'FigmaService.setContraints() > TOP_BOTTOM', element.name);

            props.resize.up = true;
            props.resize.down = true;
            props.resize.fixedVertical = false;
            break;

          case 'BOTTOM':
            _Logger["default"].log(2, 'FigmaService.setContraints() > BOTTOM', element.name);

            props.resize.up = false;
            props.resize.down = true;
            break;

          default:
            break;
        }
      }
    }
  }, {
    key: "isIgnored",
    value: function isIgnored(element) {
      // FIXME: check for empty frames
      return this.ignoredTypes.indexOf(element.type) >= 0;
    }
  }, {
    key: "isInvisible",
    value: function isInvisible(element) {
      if (element.visible === false) {
        _Logger["default"].log(5, 'FigmaService.isInvisible() > exit (visible): ' + element.name, element.type);

        return true;
      }

      if (element.opacity <= 0) {
        _Logger["default"].log(5, 'FigmaService.isInvisible() > exit (opacity): ' + element.name, element.type);

        return true;
      }

      return false;
    }
  }, {
    key: "isFrame",
    value: function isFrame(element) {
      return element.type === 'FRAME';
    }
  }, {
    key: "isComponet",
    value: function isComponet(element) {
      return element.type === 'COMPONENT';
    }
  }, {
    key: "isComponentSet",
    value: function isComponentSet(element) {
      return element.type === 'COMPONENT_SET';
    }
  }, {
    key: "isVector",
    value: function isVector(element) {
      return this.allAsVecor || !this.isButton(element);
    }
  }, {
    key: "isCustomVector",
    value: function isCustomVector(fElement) {
      if (fElement.pluginData) {
        var pluginData = fElement.pluginData[this.pluginId];

        if (pluginData && pluginData.quxType === 'Vector') {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "isLabel",
    value: function isLabel(widget) {
      return widget && (widget.type === 'Label' || widget.type === 'RichText');
    }
    /**
     * We map to a button / box iff it is not rectangle kind of
     * element (as defined in buttonTypes) and the style is not too
     * complex
     */

  }, {
    key: "isButton",
    value: function isButton(element) {
      if (this.buttonTypes.indexOf(element.type) >= 0) {
        return !this.isTooComplexStyle(element);
      }

      return false;
    }
  }, {
    key: "isVariantContainer",
    value: function isVariantContainer(fElement) {
      return fElement.type === 'VARIANT_COMPONENT';
    }
  }, {
    key: "isTooComplexStyle",
    value: function isTooComplexStyle(element) {
      if (element.fills && element.fills.length > 1) {
        return true;
      }

      if (element.fills && element.fills.length === 1) {
        /**
         * FIXME: Some times elements have iamge fills. They should be containers,
         * but for now there is a weird layout bug
         */
        var fill = element.fills[0];
        return fill.type !== 'SOLID' && fill.type !== 'GRADIENT_LINEAR' && fill.type !== 'GRADIENT_RADIAL'; // && fill.type !== 'IMAGE'
      }

      if (element.effects && element.effects.length > 1) {
        return true;
      }

      if (element.strokes && element.strokes.length > 1) {
        return true;
      }

      return false;
    }
  }, {
    key: "getHas",
    value: function getHas(element, widget) {
      if (widget.type === 'Label') {
        return {
          label: true,
          padding: true,
          advancedText: true
        };
      }

      if (widget.type === 'Button') {
        return {
          label: true,
          backgroundColor: true,
          border: true,
          onclick: true,
          padding: true
        };
      }

      return {};
    }
  }, {
    key: "getStyle",
    value: function getStyle(element, widget) {
      var _this13 = this;

      var style = {
        fontFamily: this.defaultFontFamily,
        borderBottomWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0
      };
      /**
       * How is this rendered. Which has priority
       */

      if (element.backgroundColor) {
        style.backgroundColor = this.getColor(element.backgroundColor, element);
      }

      if (element.isFixed) {
        style.fixed = true;
        this.setAllChildrenFixed(element);
      }

      if (element.fills) {
        if (element.fills.length === 1) {
          var fill = element.fills[0];

          if (fill.type === 'SOLID') {
            if (this.isLabel(widget)) {
              style.color = this.getColor(fill.color, fill);
              style.backgroundColor = 'transparent';
            } else {
              style.backgroundColor = this.getColor(fill.color, fill);
            }
          }

          if (fill.type === 'GRADIENT_LINEAR') {
            if (!this.isLabel(widget)) {
              style.background = this.getLinearGradient(fill);
            } else {
              _Logger["default"].log(1, 'getStyle() > gradients not supported fotr labels...');
            }
          }

          if (fill.type === 'GRADIENT_RADIAL') {
            if (!this.isLabel(widget)) {
              style.background = this.getRadialGradient(fill);
            } else {
              _Logger["default"].log(1, 'getStyle() > gradients not supported for labels...');
            }
          }

          if (fill.type === 'IMAGE') {// Logger.warn('getStyle() > elements with background images cannot have children. all will be rendered as PNG')
            // for now this stuff will be handled as a vector, which cannot have children.
            // maybe we have to change this at some point
            // widget.hasBackgroundImage = true
          }
        }
      }

      if (element.cornerRadius) {
        style.borderBottomLeftRadius = element.cornerRadius;
        style.borderTopLeftRadius = element.cornerRadius;
        style.borderBottomRightRadius = element.cornerRadius;
        style.borderTopRightRadius = element.cornerRadius;
      }

      if (element.rectangleCornerRadii) {
        style.borderTopLeftRadius = element.rectangleCornerRadii[0];
        style.borderTopRightRadius = element.rectangleCornerRadii[1];
        style.borderBottomRightRadius = element.rectangleCornerRadii[2];
        style.borderBottomLeftRadius = element.rectangleCornerRadii[3];
      }
      /**
       * The border stuff we just do for rects and text
       */


      if (!this.isVector(element)) {
        if (element.strokes && element.strokes.length > 0) {
          var stroke = element.strokes[0];

          if (stroke.color) {
            style.borderBottomColor = this.getColor(stroke.color, element);
            style.borderTopColor = this.getColor(stroke.color, element);
            style.borderLeftColor = this.getColor(stroke.color, element);
            style.borderRightColor = this.getColor(stroke.color, element);
          }

          if (element.strokeWeight) {
            style.borderBottomWidth = element.strokeWeight;
            style.borderTopWidth = element.strokeWeight;
            style.borderLeftWidth = element.strokeWeight;
            style.borderRightWidth = element.strokeWeight;
          } // FIXME: add here something about stroke geometry to get 


          if (element.strokeAlign !== 'INSIDE' && element.strokeWeight) {
            widget.x -= element.strokeWeight;
            widget.w += element.strokeWeight * 2;
            widget.y -= element.strokeWeight;
            widget.h += element.strokeWeight * 2;
          }
        }

        if (element.individualStrokeWeights) {
          var individualStrokeWeights = element.individualStrokeWeights;
          style.borderBottomWidth = individualStrokeWeights.bottom;
          style.borderTopWidth = individualStrokeWeights.top;
          style.borderLeftWidth = individualStrokeWeights.left;
          style.borderRightWidth = individualStrokeWeights.right;
        }

        if (element.effects) {
          element.effects.forEach(function (effect) {
            if (effect.type === 'DROP_SHADOW') {
              style.boxShadow = {
                v: effect.offset.y,
                h: effect.offset.x,
                b: effect.radius,
                s: 0,
                i: false,
                c: _this13.getColor(effect.color, element)
              };
            }

            if (effect.type === 'INNER_SHADOW') {
              style.boxShadow = {
                v: effect.offset.y,
                h: effect.offset.x,
                b: effect.radius,
                s: 0,
                i: true,
                c: _this13.getColor(effect.color, element)
              };
            }
          });
        }

        if (element.style) {
          this.setTextStyle(element.style, style);
        }
      }
      /**
       * Labels with constraints can be vertical middle
       */


      if (this.isLabel(widget) && style.verticalAlign !== 'bottom') {
        if (element.constraints) {
          var constraints = element.constraints;

          if (constraints.vertical === 'TOP_BOTTOM') {
            style.verticalAlign = 'middle';
          }
        }
      }

      return style;
    }
  }, {
    key: "setTextStyle",
    value: function setTextStyle(fStyle, style) {
      style.fontFamily = fStyle.fontFamily;
      style.fontSize = fStyle.fontSize;
      style.fontWeight = fStyle.fontWeight;
      this.setLineHeight(style, fStyle);
      style.letterSpacing = fStyle.letterSpacing;

      if (fStyle.textCase === 'UPPER') {
        style.textTransform = 'uppercase';
      }

      if (fStyle.textCase === 'LOWER') {
        style.textTransform = 'lowercase';
      }

      if (fStyle.textCase === 'TITLE') {
        style.textTransform = 'capitalize';
      }

      if (fStyle.textAlignHorizontal) {
        style.textAlign = fStyle.textAlignHorizontal.toLowerCase();
      }

      if (fStyle.textAlignVertical) {
        var textAlignVertical = fStyle.textAlignVertical;

        switch (textAlignVertical) {
          case 'CENTER':
            style.verticalAlign = 'middle';
            break;

          case 'TOP':
            style.verticalAlign = 'top';
            break;

          case 'BOTTOM':
            style.verticalAlign = 'bottom';
            break;

          default:
            break;
        }
      }
    }
  }, {
    key: "setLineHeight",
    value: function setLineHeight(style, fStyle) {
      /**
       * If we have pixel line height, everything is easy.
       */
      if (fStyle.lineHeightUnit === 'PIXELS') {
        style.lineHeightPX = fStyle.lineHeightPx;
        return;
      }
      /**
       * we might have 'normal', which seems 150%. We set as pixel, because
       * Figma inspect gives the same values.
       */


      if (fStyle.lineHeightUnit === 'INTRINSIC_%' && fStyle.lineHeightPercent) {
        if (this.autoLineHeightAsNormal) {
          style.lineHeight = 'normal';
        } else {
          style.lineHeightPX = Math.round(style.fontSize * 1.5);
        }

        return;
      }
      /**
       * For % we have to take the lineHeightPercentFontSize
       */


      if (fStyle.lineHeightUnit === 'FONT_SIZE_%') {
        style.lineHeight = fStyle.lineHeightPercentFontSize / 100;
        return;
      }
      /**
       * Defautl is line-heigth in percentage
       */


      style.lineHeight = fStyle.lineHeightPercent / 100;
    }
  }, {
    key: "setAllChildrenFixed",
    value: function setAllChildrenFixed(element) {
      var _this14 = this;

      if (element.children) {
        element.children.forEach(function (c) {
          c.isFixed = true;

          _this14.setAllChildrenFixed(c);
        });
      }
    }
  }, {
    key: "getType",
    value: function getType(element) {
      if (this.isVector(element)) {
        return 'Vector';
      }
      /**
       * FIXME: We could have somehow super complex nested shapes that should be handled as a vector...
       */


      if (element.type === 'TEXT') {
        if (element.characterStyleOverrides && element.characterStyleOverrides.length > 0 && element.styleOverrideTable) {
          return 'RichText';
        }

        return 'Label';
      }

      return 'Button';
    }
  }, {
    key: "getLinearGradient",
    value: function getLinearGradient(fill) {
      var _this15 = this;

      _Logger["default"].log(3, 'getLinearGradient() > enter', fill);

      var start = fill.gradientHandlePositions[0];
      var end = fill.gradientHandlePositions[1];
      var xDiff = start.x - end.x;
      var yDiff = start.y - end.y;
      var dir = Math.round(Math.atan2(yDiff, xDiff) * 180 / Math.PI + 270) % 360;
      var gradientStops = fill.gradientStops;
      var colors = gradientStops.map(function (stop) {
        return {
          c: _this15.getColor(stop.color),
          p: stop.position * 100
        };
      });
      return {
        direction: dir,
        colors: colors
      };
    }
  }, {
    key: "getRadialGradient",
    value: function getRadialGradient(fill) {
      var _this16 = this;

      _Logger["default"].log(3, 'getLinearGradient() > enter', fill);

      var gradientStops = fill.gradientStops;
      var colors = gradientStops.map(function (stop) {
        return {
          c: _this16.getColor(stop.color),
          p: stop.position * 100
        };
      });
      return {
        radial: true,
        colors: colors
      };
    }
  }, {
    key: "calculateAngle",
    value: function calculateAngle(startHandle, endHandle) {
      var radians = Math.atan(this.calculateGradient(startHandle, endHandle));
      return parseInt(this.radToDeg(radians).toFixed(1));
    }
  }, {
    key: "calculateGradient",
    value: function calculateGradient(startHandle, endHandle) {
      return (endHandle.y - startHandle.y) / (endHandle.x - startHandle.x) * -1;
    }
  }, {
    key: "radToDeg",
    value: function radToDeg(radian) {
      return 180 * radian / Math.PI;
    }
  }, {
    key: "getColor",
    value: function getColor(c, element) {
      if (element && element.visible === false) {
        return '';
      }

      var a = c.a;

      if (element && element.opacity < 1) {
        a = element.opacity;
      }

      return "rgba(".concat(Math.round(c.r * 255), ", ").concat(Math.round(c.g * 255), ", ").concat(Math.round(c.b * 255), ", ").concat(a, ")");
    }
  }, {
    key: "getPosition",
    value: function getPosition(element) {
      if (element.absoluteBoundingBox) {
        var pos = {
          x: Math.round(element.absoluteBoundingBox.x),
          y: Math.round(element.absoluteBoundingBox.y),
          w: Math.round(element.absoluteBoundingBox.width),
          h: Math.round(element.absoluteBoundingBox.height)
        };
        /**
         * We can ignore transformMatrix because absolutePositon gives the right values
         */

        return pos;
      }

      _Logger["default"].warn('FigmaService.getPosition() > No abs pos', element);

      return {};
    }
  }, {
    key: "getTransformParent",
    value: function getTransformParent(element) {
      if (element._parent) {
        if (element._parent.type === 'FRAME') {
          return element._parent;
        }
      }

      return;
    }
  }, {
    key: "getZ",
    value: function getZ(element, model) {
      model.lastZ++;
      return model.lastZ;
    }
  }, {
    key: "createApp",
    value: function createApp(id, data) {
      return {
        version: 2.1,
        id: id,
        figmaId: id,
        name: data.name,
        description: '',
        screenSize: {
          "w": -1,
          "h": -1
        },
        type: 'smartphone',
        screens: {},
        widgets: {},
        lines: {},
        groups: {},
        lastUUID: 10000,
        lastZ: 1,
        lastUpdate: 0,
        created: 0,
        startScreen: "",
        grid: {
          w: 8,
          h: 8,
          style: "line",
          color: "#cecece",
          visible: false,
          enabled: false
        }
      };
    }
  }, {
    key: "getUUID",
    value: function getUUID(model) {
      var uuid = model.lastUUID++ + "";
      return uuid;
    }
  }]);
  return FigmaService;
}();

exports["default"] = FigmaService;