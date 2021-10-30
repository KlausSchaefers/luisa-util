"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addContainerChildrenToModel = addContainerChildrenToModel;
exports.allChildrenAreFixedHorizontal = allChildrenAreFixedHorizontal;
exports.canBeChild = canBeChild;
exports.canHaveChildren = canHaveChildren;
exports.clone = clone;
exports.copyTemplateStyles = copyTemplateStyles;
exports.createContaineredModel = createContaineredModel;
exports.createInheritedModel = createInheritedModel;
exports.fixAutos = fixAutos;
exports.getAllChildren = getAllChildren;
exports.getAllChildrenForScreen = getAllChildrenForScreen;
exports.getAllChildrenWithPosition = getAllChildrenWithPosition;
exports.getAllGroupChildren = getAllGroupChildren;
exports.getAllGroupsForScreen = getAllGroupsForScreen;
exports.getBoundingBoxByBoxes = getBoundingBoxByBoxes;
exports.getBoundingBoxByIds = getBoundingBoxByIds;
exports.getBoxById = getBoxById;
exports.getClickLine = getClickLine;
exports.getDistanceFromScreenBottom = getDistanceFromScreenBottom;
exports.getElementsAsRows = getElementsAsRows;
exports.getFileName = getFileName;
exports.getGroup = getGroup;
exports.getImageLocation = getImageLocation;
exports.getImages = getImages;
exports.getLines = getLines;
exports.getOrderedWidgets = getOrderedWidgets;
exports.getParentGroup = getParentGroup;
exports.getScreenCSS = getScreenCSS;
exports.getTemplatedStyle = getTemplatedStyle;
exports.getTopParentGroup = getTopParentGroup;
exports.hasChildren = hasChildren;
exports.hasComponentScreenParent = hasComponentScreenParent;
exports.hasMinMaxWdith = hasMinMaxWdith;
exports.hasNoChildren = hasNoChildren;
exports.hasOverlayBackground = hasOverlayBackground;
exports.hasParentRepeaterGrid = hasParentRepeaterGrid;
exports.hasRowLayout = hasRowLayout;
exports.inlineTemplateStyles = inlineTemplateStyles;
exports.isAutoLayoutSpaceBetween = isAutoLayoutSpaceBetween;
exports.isBlock = isBlock;
exports.isBottom = isBottom;
exports.isCentered = isCentered;
exports.isChildrenToggle = isChildrenToggle;
exports.isComponentSet = isComponentSet;
exports.isContainedInBox = isContainedInBox;
exports.isContainerElement = isContainerElement;
exports.isDesignSystemRoot = isDesignSystemRoot;
exports.isFixedHorizontal = isFixedHorizontal;
exports.isFixedPosition = isFixedPosition;
exports.isFixedVertical = isFixedVertical;
exports.isFullWidth = isFullWidth;
exports.isGridContainer = isGridContainer;
exports.isHugHorizontal = isHugHorizontal;
exports.isHugVerticall = isHugVerticall;
exports.isInputElement = isInputElement;
exports.isLastChild = isLastChild;
exports.isLayoutAuto = isLayoutAuto;
exports.isLayoutAutoHorizontal = isLayoutAutoHorizontal;
exports.isLayoutAutovertical = isLayoutAutovertical;
exports.isLayoutGrid = isLayoutGrid;
exports.isLayoutGrow = isLayoutGrow;
exports.isLayoutRow = isLayoutRow;
exports.isLayoutWrap = isLayoutWrap;
exports.isLeft = isLeft;
exports.isOverLappingX = isOverLappingX;
exports.isOverLappingY = isOverLappingY;
exports.isOverlay = isOverlay;
exports.isPinnedDown = isPinnedDown;
exports.isPinnedLeft = isPinnedLeft;
exports.isPinnedRight = isPinnedRight;
exports.isPinnedUp = isPinnedUp;
exports.isRepeater = isRepeater;
exports.isRepeaterAuto = isRepeaterAuto;
exports.isRepeaterGrid = isRepeaterGrid;
exports.isRight = isRight;
exports.isRowGrid = isRowGrid;
exports.isScreen = isScreen;
exports.isSingleChildInRow = isSingleChildInRow;
exports.isStartingLeft = isStartingLeft;
exports.isStartingTop = isStartingTop;
exports.isTop = isTop;
exports.isWrappedContainer = isWrappedContainer;
exports.mixin = mixin;
exports.mixinNotOverwriten = mixinNotOverwriten;
exports.print = print;
exports.removeCommonPath = removeCommonPath;
exports.setCSSClassNames = setCSSClassNames;
exports.sortWidgetList = sortWidgetList;
exports.stringToType = stringToType;

var _Logger = _interopRequireDefault(require("./Logger"));

var _Const = require("./Const");

function isLayoutWrap(e) {
  return e.layout && e.layout.type === _Const.Layout.Wrap;
}

function isLayoutRow(e) {
  return e.layout && e.layout.type === _Const.Layout.Row;
}

function isLayoutGrid(e) {
  return e.layout && e.layout.type === _Const.Layout.Grid;
}

function isLayoutGrow(e) {
  return e.layout && e.layout.grow > 0;
}

function isLayoutAuto(e) {
  // why did check for this??? || e.layout.align !== undefined Take a look at auto fixed. This is somehow needed for the growth
  return e.layout !== undefined && (e.layout.type === _Const.Layout.AutoHorizontal || e.layout.type === _Const.Layout.AutoVertical); //|| e.layout.align !== undefined
}

function isLayoutAutoHorizontal(e) {
  return e.layout && e.layout.type === _Const.Layout.AutoHorizontal;
}

function isLayoutAutovertical(e) {
  return e.layout && e.layout.type === _Const.Layout.AutoVertical;
}

function getFileName(name) {
  return name.replace(/\s/g, '_');
}

function hasNoChildren(widget) {
  return widget.children && widget.children.length === 0;
}

function hasChildren(widget) {
  return widget.children && widget.children.length > 0;
}

function isScreen(e) {
  return e.type === 'Screen';
}

function isLastChild(widget) {
  if (widget.parent && widget.parent.children) {
    var parent = widget.parent;
    var last = parent.children[parent.children.length - 1];
    return last.id === widget.id;
  }

  return false;
}
/**
 * Advanced widgets cannot have children, e.g. stacked rings
 */


function canHaveChildren(element) {
  if (element.props && element.props.customComponent) {
    return false;
  }

  if (isContainerElement(element) || isInputElement(element)) {
    return true;
  }

  return false;
}

function isInputElement(element) {
  var type = element.type;
  return type === 'TextBox' || type === 'TextArea' || type === 'Password' || type === 'DropDown';
}

function isContainerElement(element) {
  var type = element.type;
  return type === 'Box' || type === 'Button' || type === 'Image' || type === 'ChildrenToggle' || type === 'Repeater' || type === 'DynamicContainer' || type === 'ContainerDropDown';
}
/**
 * Check if the child can be nested in a parent
 * @param {} child The child to be nested
 * @param {*} parent The parent to receiveo
 */


function canBeChild(child, parent) {
  /**
   * Costum widgets cannot have children
   */
  if (parent.props && parent.props.customComponent) {
    return false;
  }
  /**
   * Box likes element can always have children
   */


  if (isContainerElement(parent)) {
    return true;
  }
  /**
   * Input elements can have labels embedded. This is needed to attach the label later
   */


  if (isInputElement(parent) && child.type === 'Label') {
    return true;
  }

  return false;
}
/**
 * Determine if the grid is collection
 * of stacked rows. This is true of arwew no overlaps
 */


function hasRowLayout(widget) {
  if (widget) {
    var nodes = widget.children;
    var length = nodes.length;

    for (var i = 0; i < length; i++) {
      for (var j = 0; j < length; j++) {
        var a = nodes[i];
        var b = nodes[j];

        if (a.id !== b.id) {
          if (isOverLappingY(a, b)) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

function isWrappedContainer(e) {
  return e.style.wrap || e.style.layout === 'Wrap';
}

function isAutoLayoutSpaceBetween(e) {
  return e.layout && e.layout.justifyContent === 'space-between';
}

function isGridContainer(e) {
  return e.style.grid;
}

function isDesignSystemRoot(e) {
  return e.isDesignSystemRoot;
}

function isRepeater(e) {
  if (e) {
    return e.type === 'Repeater';
  }

  return false;
}

function hasComponentScreenParent(e) {
  return e.hasComponentScreenParent;
}

function isRepeaterAuto(e) {
  if (e.type === 'Repeater' && e.props.layout == 'grid' && e.props.auto === true) {
    return true;
  }

  return false;
}

function isFixedPosition(widget) {
  return widget.style.fixed && widget.type !== 'Screen';
}

function isRepeaterGrid(e) {
  if (e.type === 'Repeater' && e.props.layout === 'grid') {
    return true;
  }

  return false;
}

function isBlock(e) {
  return e && e.style && e.style.display === 'block';
}

function hasParentRepeaterGrid(e) {
  if (e.parent) {
    return isRepeaterGrid(e.parent);
  }

  return false;
}
/**
 * Determine if the grid is collection
 * of stacked rows. This is true of arwew no overlaps
 */


function isRowGrid(widget) {
  //console.debug('DEPREACTED isRowGrid()')
  if (widget) {
    var nodes = widget.children;
    var length = nodes.length;

    for (var i = 0; i < length; i++) {
      for (var j = 0; j < length; j++) {
        var a = nodes[i];
        var b = nodes[j];

        if (a.id !== b.id) {
          if (isOverLappingY(a, b)) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

function isOverLappingX(pos, box) {
  return !isLeft(pos, box) && !isRight(pos, box);
}

function isOverLappingY(pos, box) {
  return !isTop(pos, box) && !isBottom(pos, box);
}

function isTop(from, to) {
  return from.y >= to.y + to.h;
}

function isStartingTop(from, to) {
  return from.y >= to.y; // && (from.y + from.h) <= (to.y + to.h);
}

function isBottom(from, to) {
  return from.y + from.h <= to.y;
}

function isLeft(from, to) {
  return from.x > to.x + to.w;
}

function isStartingLeft(from, to) {
  return from.x >= to.x;
}

function isRight(from, to) {
  return from.x + from.w < to.x;
}

function isFixedHorizontal(e) {
  return e.props && e.props.resize && e.props.resize.fixedHorizontal;
}

function isHugHorizontal(e) {
  return e.props && e.props.resize && e.props.resize.hugHorizontal === true;
}

function isHugVerticall(e) {
  return e.props && e.props.resize && e.props.resize.hugVertical === true;
}

function isFixedVertical(e) {
  if (e.type === 'Box' || e.type === 'Button' || e.type === 'Label' || e.type === 'Container' || e.type === 'Repeater' || e.children && e.children.length > 0) {
    return e.props && e.props.resize && e.props.resize.fixedVertical;
  }

  return true;
}

function isPinnedLeft(e) {
  return e.props && e.props.resize && e.props.resize.left;
}

function isPinnedRight(e) {
  return e.props && e.props.resize && e.props.resize.right;
}

function isPinnedUp(e) {
  return e.props && e.props.resize && e.props.resize.up;
}

function isPinnedDown(e) {
  return e.props && e.props.resize && e.props.resize.down;
}

function isFullWidth(e) {
  return e.props && e.props.resize && e.props.resize.fullWidth;
}

function isSingleChildInRow() {
  //if (e.parent){
  //   let inSameRow = e.parent.children.filter(c => c.r === e.r)
  //   console.debug('isSIngleChild', e.name, e.parent.name, inSameRow)
  //    //return inSameRow.length === 1
  //}
  return false;
}
/*
export function isAtBottom(element, model, threshold = 10) {
    if (element && model.screenSize) {
        let dif = getDistanceFromScreenBottom(element, model)
        return dif < threshold
    }
    return false
}
*/


function getDistanceFromScreenBottom(element, model, parentScreen) {
  if (element && model.screenSize && parentScreen) {
    var h = Math.min(parentScreen.h, model.screenSize.h);
    var dif = h - (element.y + element.h);
    return dif;
  }

  return 0;
}

function isCentered(e) {
  if (e.parent) {
    var dif = e.parent.w - (2 * e.x + e.w); // We have a minimum threshold of 3px

    return Math.abs(dif) < Math.max(3, e.parent.w * 0.003);
  }

  return false;
}

function getClickLine(element) {
  if (element.lines) {
    return element.lines.find(function (l) {
      return l.event === 'click';
    });
  }

  return null;
}

function allChildrenAreFixedHorizontal(children) {
  var fixedChildren = children.filter(function (f) {
    return f.props && f.props.resize && f.props.resize.fixedHorizontal;
  });
  return fixedChildren.length === children.length;
}

function isOverlay(screen) {
  return screen.style && screen.style.overlay;
}

function isComponentSet(e) {
  return e.figmaType === 'COMPONENT_SET';
}

function isChildrenToggle(e) {
  return e.type === 'ChildrenToggle' || e.smartContainerType === 'ChildrenToggle';
}

function hasOverlayBackground(screen) {
  return screen.style && screen.style.hasBackground;
}

function hasMinMaxWdith(screen) {
  return screen.style !== undefined && (screen.style.minWidth > 0 || screen.style.maxWidth > 0);
}

function getImages(app) {
  var images = [];
  var urls = {};
  Object.values(app.widgets).forEach(function (w) {
    if (w.style && w.style.backgroundImage) {
      var backgroundImage = w.style.backgroundImage;
      var url = getImageLocation(w, backgroundImage.url);

      if (!urls[url]) {
        images.push({
          name: url,
          type: 'images',
          id: w.id,
          src: backgroundImage.url
        });
        urls[url] = true;
      }
    }
  });
  Object.values(app.screens).forEach(function (w) {
    if (w.style && w.style.backgroundImage) {
      var backgroundImage = w.style.backgroundImage;
      var url = getImageLocation(w, backgroundImage.url);

      if (!urls[url]) {
        images.push({
          name: url,
          type: 'images',
          id: w.id,
          src: backgroundImage.url
        });
        urls[url] = true;
      }
    }
  });
  return images;
}

function getImageLocation(w, url) {
  var parts = url.split('/');

  if (parts.length === 2) {
    return parts[1];
  }

  return url;
}

function removeCommonPath(a, b) {
  var path = [];
  var aParts = a.split('/');
  var bParts = b.split('/');
  var different = false;
  aParts.forEach(function (p, i) {
    if (p !== bParts[i] || different) {
      path.push(p);
      different = true;
    }
  });
  return path.join('/');
}
/**
 * Generates the css for a given screen. Includes the styles for the screen and all
 * its children. Certain elements, like common, might be excluded.
 *
 * @param {*} screen The screen to genearte for
 * @param {*} code The code object with the styles
 * @param {*} exclude An array of types to be exluded, e.g ['template']
 */


function getScreenCSS(screen, code, exclude) {
  var css = '';
  var normalize = code.styles['$NORMALIZE'];

  if (normalize) {
    css += normalize.map(function (s) {
      return s.code;
    }).join('\n');
  }

  css += screen.styles.map(function (s) {
    return s.code;
  }).join('\n');
  var elements = getAllChildrenForScreen(screen);
  var written = [];
  elements.forEach(function (element) {
    var styles = code.styles[element.id];

    if (exclude) {
      styles = styles.filter(function (s) {
        return exclude.indexOf(s.type) < 0;
      });
    }

    styles.forEach(function (s) {
      if (!written[s.css]) {
        css += s.code + '\n';
        written[s.css] = true;
      }
    }); // css += styles.map(s => s.code).join('\n')
  });
  return css;
}

function getAllChildrenForScreen(screen) {
  var result = [];

  if (screen.model.children) {
    screen.model.children.forEach(function (child) {
      result.push(child);
      getAllChildren(child, result);
    });
  }

  if (screen.model.fixedChildren) {
    screen.model.fixedChildren.forEach(function (child) {
      result.push(child);
    });
  }

  return result;
}

function fixAutos(style, widget) {
  if (style.fontSize === 'Auto') {
    style.fontSize = widget.h;
  }

  return style;
}
/**
 * FIX for old models without z-value
 */


function fixMissingZValue(box) {
  if (box.z === null || box.z === undefined) {
    box.z = 0;
  }
}
/**
 * Get children
 */


function getOrderedWidgets(widgets) {
  var result = [];

  for (var id in widgets) {
    var widget = widgets[id];

    if (widget) {
      fixMissingZValue(widget);
      result.push(widget);
    }
  }

  sortWidgetList(result);
  return result;
}
/**
 * This method is super important for the correct rendering!
 *
 * We sort by:
 *
 *  1) style.fixed: fixed elements will be renderd last, therefore they come
 *  as the last elements in the list
 *
 * 	2) inherited : inherited values come first. They shall be rendered below the
 *  widget of the new screen
 *
 *  3) z : High z values come later
 *
 *  4) id: if the z value is the same, sort by id, which means the order the widgets have been
 *  added to the screen.
 */


function sortWidgetList(result) {
  /**
   * Inline function to determine if a widget is fixed.
   * we have to check if style exists, because the Toolbar.onToolWidgetLayer()
   * call the method without styles.
   */
  var isFixed = function isFixed(w) {
    if (w.style && w.style.fixed) {
      return true;
    }

    return false;
  };

  result.sort(function (a, b) {
    var aFix = isFixed(a);
    var bFix = isFixed(b);
    /**
     * 1) Sort by fixed. If both are fixed or not fixed,
     * continue sorting by inherited.
     */

    if (aFix == bFix) {
      /**
       * If both a inherited or not inherited,
       * continue sorting by z & id
       */
      if (a.inherited && b.inherited || !a.inherited && !b.inherited) {
        /**
         * 4) if the have the same z, sot by id
         */
        if (a.z == b.z && a.id && b.id) {
          return a.id.localeCompare(b.id);
        }
        /**
         * 3) Sort by z. Attention, Chrome
         * needs -1, 0, 1 or one. > does not work
         */


        return a.z - b.z;
      }

      if (a.inherited) {
        return -1;
      }

      return 1;
    }

    if (aFix) {
      return 1;
    }

    return -1;
  });
}

function getAllChildren(node, result) {
  if (node.children) {
    node.children.forEach(function (child) {
      result.push(child);
      getAllChildren(child, result);
    });
  }
}

function isContainedInBox(obj, parent) {
  if (parent) {
    if (obj.x >= parent.x && obj.x + obj.w <= parent.w + parent.x && obj.y >= parent.y && obj.y + obj.h <= parent.y + parent.h) {
      return true;
    }
  }

  return false;
}

function getBoundingBoxByIds(ids, model) {
  var children = ids.map(function (id) {
    if (model.widgets && model.widgets[id]) {
      return model.widgets[id];
    } else {
      _Logger["default"].log(1, 'ExportUtil.getBoundingBoxByIds() > No child with id', id);
    }

    return null;
  }).filter(function (child) {
    return child !== null;
  });
  return getBoundingBoxByBoxes(children);
}

function getBoundingBoxByBoxes(boxes) {
  var result = {
    x: 100000000,
    y: 100000000,
    w: 0,
    h: 0,
    z: 100000000,
    props: {
      resize: {}
    },
    style: {}
  };

  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    result.x = Math.min(result.x, box.x);
    result.y = Math.min(result.y, box.y);
    result.w = Math.max(result.w, box.x + box.w);
    result.h = Math.max(result.h, box.y + box.h);
    result.z = Math.max(result.z, box.z);

    if (isFixedHorizontal(box)) {
      result.props.resize.fixedHorizontal = true;
    }

    if (isFixedVertical(box)) {
      result.props.resize.fixedVertical = true;
    }
  }

  result.h -= result.y;
  result.w -= result.x;
  return result;
}

function createInheritedModel(model) {
  /**
   * Build lookup map for overwrites
   */
  var overwritenWidgets = {};

  for (var screenID in model.screens) {
    var screen = model.screens[screenID];
    overwritenWidgets[screenID] = {};

    for (var i = 0; i < screen.children.length; i++) {
      var widgetID = screen.children[i];
      var widget = model.widgets[widgetID];

      if (widget && widget.parentWidget) {
        overwritenWidgets[screenID][widget.parentWidget] = widgetID;
      }
    }
  }

  var inModel = clone(model);
  inModel.inherited = true;
  /**
   * add container widgets
   */

  createContaineredModel(inModel);
  /**
   * add widgets from parent (master) screens
   */

  for (var _screenID in inModel.screens) {
    /**
     * *ATTENTION* We read from the org model, otherwise we have
     * issues in the loop as we change the screen.
     */
    var _screen = model.screens[_screenID];

    if (_screen.parents && _screen.parents.length > 0) {
      /**
       * add widgets from parent screens
       */
      for (var _i = 0; _i < _screen.parents.length; _i++) {
        var parentID = _screen.parents[_i];

        if (parentID != _screenID) {
          if (model.screens[parentID]) {
            /**
             * *ATTENTION* We read from the org model, otherwise we have
             * issues in the loop as we change the screen!
             */
            var parentScreen = model.screens[parentID];
            var difX = parentScreen.x - _screen.x;
            var difY = parentScreen.y - _screen.y;
            var parentChildren = parentScreen.children;

            for (var j = 0; j < parentChildren.length; j++) {
              var parentWidgetID = parentChildren[j];
              /**
               * *ATTENTION* We read from the org model, otherwise we have
               * issues in the loop as we change the screen!
               */

              var parentWidget = model.widgets[parentWidgetID];

              if (parentWidget) {
                var overwritenWidgetID = overwritenWidgets[_screenID][parentWidgetID];

                if (!overwritenWidgetID) {
                  var copy = clone(parentWidget);
                  /**
                   * Super important the ID mapping!!
                   */

                  copy.id = parentWidget.id + "@" + _screenID;
                  copy.inherited = parentWidget.id;
                  copy.inheritedScreen = _screenID;
                  copy.inheritedOrder = _i + 1;
                  /**
                   * Now lets also put it at the right position!
                   */

                  copy.x -= difX;
                  copy.y -= difY;
                  /**
                   * We write the new widget to the inherited model!
                   *
                   */

                  inModel.widgets[copy.id] = copy;

                  inModel.screens[_screenID].children.push(copy.id);
                  /**
                   * Also add a to the inherited copies
                   * so we can to live updates in canvas
                   */


                  var parentCopy = inModel.widgets[parentWidget.id];

                  if (!parentCopy.copies) {
                    parentCopy.copies = [];
                  }

                  parentCopy.copies.push(copy.id);
                } else {
                  var overwritenWidget = inModel.widgets[overwritenWidgetID];

                  if (overwritenWidget) {
                    overwritenWidget.props = mixin(clone(parentWidget.props), overwritenWidget.props, true);
                    overwritenWidget.style = mixin(clone(parentWidget.style), overwritenWidget.style, true);

                    if (overwritenWidget.hover) {
                      overwritenWidget.hover = mixin(clone(parentWidget.hover), overwritenWidget.hover, true);
                    }

                    if (overwritenWidget.error) {
                      overwritenWidget.error = mixin(clone(parentWidget.error), overwritenWidget.error, true);
                    }
                    /**
                     * Also add a reference to the *INHERITED* copies
                     * so we can to live updates in canvas
                     */


                    var _parentCopy = inModel.widgets[parentWidget.id];

                    if (!_parentCopy.inheritedCopies) {
                      _parentCopy.inheritedCopies = [];
                    }

                    _parentCopy.inheritedCopies.push(overwritenWidget.id);
                    /**
                     * Also inherited positions
                     */


                    if (overwritenWidget.parentWidgetPos) {
                      overwritenWidget.x = parentWidget.x - difX;
                      overwritenWidget.y = parentWidget.y - difY;
                      overwritenWidget.w = parentWidget.w;
                      overwritenWidget.h = parentWidget.h;
                    }

                    overwritenWidget._inheried = true;
                  } else {
                    console.error("createInheritedModel() > No overwriten widget in model");
                  }
                }
              } else {
                console.warn("createInheritedModel() > no parent screen child with id > " + parentID + ">" + parentWidget);
              }
            }

            createInheritedGroups(inModel.screens[_screenID], parentScreen, model, inModel);
          } else {
            console.warn("createInheritedModel() > Deteced Self inheritance...", _screen);
          }
        } else {
          console.warn("createInheritedModel() > no parent screen with id > " + parentID);
        }
      }
    }
  }
  /**
   * Inline designtokens. must come last, otherwise master screen widgets are not correctly filled.
   */


  inModel = inlineModelDesignTokens(inModel);
  return inModel;
}

function createInheritedGroups(inScreen, parentScreen, model, inModel) {
  _Logger["default"].log(4, 'ExportUtil.createInheritedGroups()');

  var parentGroups = getAllGroupsForScreen(parentScreen, model);
  var widgetParentMapping = {};
  inScreen.children.forEach(function (widgetID) {
    var inheritedWidget = inModel.widgets[widgetID];

    if (inheritedWidget) {
      widgetParentMapping[inheritedWidget.inherited] = widgetID;
    } else {
      console.warn('createInheritedGroups() Could not find widget', widgetID);
    }
  });
  parentGroups.forEach(function (group) {
    var newGroup = {
      name: group.name + "_" + inScreen.name,
      id: group.id + "@" + inScreen.id,
      inherited: group.id,
      inheritedScreen: parentScreen.id,
      props: clone(group.props),
      style: clone(group.style),
      children: []
    };
    group.children.forEach(function (widgetID) {
      var inheritedID = widgetParentMapping[widgetID];

      if (inheritedID) {
        newGroup.children.push(inheritedID);
      } else {
        console.warn('createInheritedGroups() Could not find parent widhet', widgetID);
      }
    });

    if (inModel.groups) {
      inModel.groups[newGroup.id] = newGroup;
    }
  });
}

function createContaineredModel(inModel) {
  for (var screenID in inModel.screens) {
    var screen = inModel.screens[screenID];

    for (var i = 0; i < screen.children.length; i++) {
      var widgetID = screen.children[i];
      var widget = inModel.widgets[widgetID];

      if (widget) {
        if (widget.isContainer) {
          var children = getContainedChildWidgets(widget, inModel);
          widget.children = children.map(function (w) {
            return w.id;
          });
        }
      } else {
        /**
         * FIXME: This can happen for screen copies...
         */
        // console.warn('Core.createContaineredModel() > cannot find widgte', widgetID)
      }
    }
  }
}

function inlineModelDesignTokens(model) {
  /**
   * This is quite costly. Can we do this smarter? Maybe we could do it in the
   * RenderFactory (beawre of hover etc). Then we would have to just add here
   * for all the reference design token the modified?
   */
  if (model.designtokens) {
    for (var widgetID in model.widgets) {
      var widget = model.widgets[widgetID];
      inlineBoxDesignToken(widget, model);
    }

    for (var screenId in model.screens) {
      var scrn = model.screens[screenId];
      inlineBoxDesignToken(scrn, model);
    }
    /**
     * FIXME Add tempaltes
     */

  }

  return model;
}

function inlineBoxDesignToken(box, model) {
  /**
   * If the box is templates, we copy all the designtokens from the template
   */
  if (box && box.template && model.templates && model.templates[box.template]) {
    var template = model.templates[box.template];

    if (template.designtokens) {
      /**
       * We could mix this in....
       */
      box.designtokens = template.designtokens;
    }
  }

  if (box && box.designtokens) {
    var designtokens = box.designtokens;

    for (var state in designtokens) {
      if (!box[state]) {
        box[state] = {};
      }

      var stateTokens = designtokens[state];

      for (var cssProp in stateTokens) {
        var designTokenId = stateTokens[cssProp];
        var designToken = model.designtokens[designTokenId];

        if (designToken) {
          if (designToken.isComplex) {
            box[state][cssProp] = designToken.value[cssProp];
          } else {
            box[state][cssProp] = designToken.value;
          }
        } else {
          console.warn('ModelUtil.inlineBoxDesignToken() > NO token with id or no value:' + designTokenId, designToken);
        }
      }
    }
  }

  return box;
}

function copyTemplateStyles(model) {
  if (model.templates) {
    for (var widgetID in model.widgets) {
      var widget = model.widgets[widgetID];

      if (widget.template) {
        var template = model.templates[widget.template];
        widget._template = template;
      }
    }
  }

  return model;
}

function inlineTemplateStyles(model) {
  for (var widgetID in model.widgets) {
    var widget = model.widgets[widgetID];

    if (widget.template) {
      /**
       * FIXME: What about style?
       */
      var style = this.getTemplatedStyle(widget, model, 'style');

      if (style) {
        widget.style = style;
      }

      var hover = this.getTemplatedStyle(widget, model, 'hover');

      if (hover) {
        widget.hover = hover;
      }

      var error = this.getTemplatedStyle(widget, model, 'error');

      if (error) {
        widget.error = error;
      }

      var focus = this.getTemplatedStyle(widget, model, 'focus');

      if (focus) {
        widget.focus = focus;
      }

      var active = this.getTemplatedStyle(widget, model, 'active');

      if (active) {
        widget.active = active;
      }

      console.debug(widget);
    }
  }

  return model;
}

function getTemplatedStyle(widget, model, prop) {
  if (widget.template) {
    if (model.templates) {
      var t = model.templates[widget.template];
      console.debug(t);

      if (t && t[prop]) {
        /**
         * Merge in overwriten styles
         */
        var merged = clone(t[prop]);

        if (widget[prop]) {
          var props = widget[prop];

          for (var key in props) {
            merged[key] = props[key];
          }
        }

        return merged;
      }
    }
  }

  return widget[prop];
}

function getContainedChildWidgets(container, model) {
  var result = [];
  /*
   * Loop over sorted list
   */

  var sortedWidgets = getOrderedWidgets(model.widgets);
  var found = false;

  for (var i = 0; i < sortedWidgets.length; i++) {
    var widget = sortedWidgets[i];

    if (container.id != widget.id) {
      if (found && isContainedInBox(widget, container)) {
        widget.container = container.id;
        result.push(widget);
      }
    } else {
      found = true;
    }
  }

  return result;
}

function addContainerChildrenToModel(model) {
  /**
   * Add here some function to add the virtual children, so that stuff
   * works also in the analytic canvas. This would mean we would have to
   * copy all the code from the Repeater to here...
   */
  return model;
}

function mixin(a, b, keepTrack) {
  if (a && b) {
    b = clone(b);

    if (keepTrack) {
      b._mixed = {};
    }

    for (var k in a) {
      if (b[k] === undefined || b[k] === null) {
        b[k] = a[k];

        if (keepTrack) {
          b._mixed[k] = true;
        }
      }
    }
  }

  return b;
}

function mixinNotOverwriten(a, b) {
  if (a && b) {
    var mixed = {};

    if (b._mixed) {
      mixed = b._mixed;
    } //console.debug("mixinNotOverwriten", overwriten)


    for (var k in a) {
      if (b[k] === undefined || b[k] === null || mixed[k]) {
        b[k] = a[k];
      }
    }
  }

  return b;
}

function clone(obj) {
  if (!obj) {
    return null;
  }

  var _s = JSON.stringify(obj);

  return JSON.parse(_s);
}

function getLines(widget, model) {
  var result = [];

  if (widget.inherited && model.widgets[widget.inherited]) {
    widget = model.widgets[widget.inherited];
  }

  var widgetID = widget.id;
  var lines = getFromLines(widget, model);

  if (lines && lines.length > 0) {
    return lines;
  }

  var group = getParentGroup(widgetID, model);

  if (group) {
    var groupLine = getFromLines(group, model);

    if (groupLine && groupLine.length > 0) {
      return groupLine;
    }
  }
  /**
   * Since 2.1.3 we use might have sub groups.
   */


  var topGroup = getTopParentGroup(widgetID, model);

  if (topGroup) {
    var _groupLine = getFromLines(topGroup, model);

    if (_groupLine && _groupLine.length > 0) {
      return _groupLine;
    }
  }

  return result;
}

function getTopParentGroup(id, model) {
  var group = getParentGroup(id, model);

  if (group) {
    while (group) {
      var parent = getParentGroup(group.id, model);

      if (parent) {
        group = parent;
      } else {
        /**
         * In contrast the the Layout copz of this, we do not add
         * all children... not sure it this is needed
         */
        return group;
      }
    }
  }

  return null;
}

function getParentGroup(widgetID, model) {
  if (model.groups) {
    for (var id in model.groups) {
      var group = model.groups[id];
      var i = group.children.indexOf(widgetID);

      if (i > -1) {
        return group;
      }
      /**
       * Since 2.13 we have subgroups and check this too
       */


      if (group.groups) {
        var _i2 = group.groups.indexOf(widgetID);

        if (_i2 > -1) {
          return group;
        }
      }
    }
  }

  return null;
}

function getGroup(widgetID, model) {
  if (model.groups) {
    for (var id in model.groups) {
      var group = model.groups[id];
      var i = group.children.indexOf(widgetID);

      if (i > -1) {
        return group;
      }
    }
  }
}

function getAllGroupChildren(group, model) {
  if (!group.children) {
    return [];
  }

  var result = group.children.slice(0);
  /**
   * Check all sub groups
   */

  if (group.groups) {
    group.groups.forEach(function (subId) {
      var sub = model.groups[subId];

      if (sub) {
        var children = getAllGroupChildren(sub, model);
        result = result.concat(children);
      } else {
        console.warn('getAllGroupChildren() No sub group', subId);
      }
    });
  }

  return result;
}

function getAllChildrenWithPosition(group) {
  var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (group.children) {
    group.children.forEach(function (child) {
      // groups might not have been defined with the width!
      if (child.x != undefined) {
        result.push(child);
      }

      getAllChildrenWithPosition(child, result);
    });
  }

  return result;
}

function getAllGroupsForScreen(screen, model) {
  var result = {};
  screen.children.forEach(function (widgetID) {
    var group = getGroup(widgetID, model);

    if (group) {
      result[group.id] = group;
    }
  });
  return Object.values(result);
}

function getFromLines(box, model) {
  var result = [];

  for (var id in model.lines) {
    var line = model.lines[id];

    if (line.from == box.id) {
      result.push(line);
    }
  }

  return result;
}

function getBoxById(id, model) {
  if (model.screens[id]) {
    return model.screens[id];
  }

  if (model.widgets[id]) {
    return model.widgets[id];
  }
}

function print(screen) {
  var grid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var hasXY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var res = [];
  printElement(res, screen, '', grid, hasXY);
  screen.fixedChildren.forEach(function (e) {
    var pos = grid ? " > col: ".concat(e.gridColumnStart, " - ").concat(e.gridColumnEnd, " > row: ").concat(e.gridRowStart, " - ").concat(e.gridRowEnd) : '';
    var xw = hasXY ? "".concat(e.x, " - ").concat(e.w) : '';
    var actions = ''; // e.lines ? ' -> ' + e.lines.map(l => l.event + ':' + l.screen.name) : ''

    res.push("  ".concat(e.name, "*  ").concat(pos, " ").concat(xw, " ").concat(actions, " "));
  });
  return res.join('\n');
}

function printElement(res, e) {
  var space = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var grid = arguments.length > 3 ? arguments[3] : undefined;
  var hasXY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var actions = ''; // e.lines ? ' -> ' + e.lines.map(l => l.event + ':' + l.screen.name) : ''
  ///let parent = e.parent ? e.parent.name + ' '  + e.parent.id :  "null"

  var pos = grid ? " > col: ".concat(e.gridColumnStart, " - ").concat(e.gridColumnEnd, " > row: ").concat(e.gridRowStart, " - ").concat(e.gridRowEnd) : '';
  var xw = hasXY ? "".concat(e.x, " - ").concat(e.w) : '';
  res.push("".concat(space).concat(e.name, " - (").concat(e.layout, ")  ").concat(pos, " ").concat(xw, " ").concat(actions, " "));

  if (e.children) {
    e.children.forEach(function (c) {
      printElement(res, c, space + '  ', grid);
    });
  }
}

function getElementsAsRows(nodes) {
  var rows = [];
  var row;
  var lastRowId = null;
  nodes.forEach(function (n) {
    var rowId = n.row ? n.row : '-1';

    if (rowId != lastRowId) {
      row = [];
      rows.push(row);
    }

    row.push(n);
    lastRowId = rowId;
  });
  return rows;
}

function setCSSClassNames(parent, screenName) {
  var name = parent.name;
  name = name.replace(/\./g, "_");

  if (name.match(/^\d/)) {
    name = "q" + name;
  }

  parent.cssScreen = "".concat(screenName.replace(/\s+/g, "_"));
  parent.cssClass = "".concat(name.replace(/\s+/g, "_"));
  var cssSelector = ".".concat(name.replace(/\s+/g, "_"));

  if (parent.parent) {
    cssSelector = ".".concat(screenName.replace(/\s+/g, "_"), " ").concat(cssSelector);
  } else {
    cssSelector = ".qux-screen".concat(cssSelector);
  }

  parent.cssSelector = cssSelector;

  if (parent && parent.children) {
    parent.children.forEach(function (c) {
      setCSSClassNames(c, screenName);
    });
  }

  if (parent && parent.fixedChildren) {
    parent.fixedChildren.forEach(function (c) {
      setCSSClassNames(c, screenName);
    });
  }
}

function stringToType(value) {
  if (value === 'true') {
    value = true;
  }

  if (value === 'false') {
    value = false;
  }

  return value;
}