var render = require('./render');
var Interpolator = require('interpolate');

/**
 * The compiler will take a set of views, an element and
 * a scope and process each node going down the tree. Whenever
 * it finds a node matching a directive it will process it.
 */
function Bindings() {
  this.components = {};
  this.directives = {};
  this.interpolator = new Interpolator();
}

/**
 * Add a component binding. This will be rendered as a separate
 * view and have it's own scope.
 *
 * @param {String|Regex} matches String or regex to match an element name
 * @param {Function} View
 * @param {Object} options
 */
Bindings.prototype.component = function(name, fn) {
  if(!fn) {
    return this.components[name.nodeName.toLowerCase()];
  }
  this.components[name.toLowerCase()] = fn;
  return this;
};

/**
 * Add an attribute binding. Whenever this attribute is matched
 * in the DOM the function will be code with the current view
 * and the element.
 *
 * @param {String|Regex} matches String or regex to match an attribute name
 * @param {Function} process
 * @param {Object} options
 */
Bindings.prototype.directive = function(attr, fn) {
  if(!fn) {
    return this.directives[attr];
  }
  this.directives[attr] = fn;
  return this;
};

/**
 * Add an interpolation filter
 *
 * @param {String} name
 * @param {Function} fn
 *
 * @return {Bindings}
 */
Bindings.prototype.filter = function(name, fn) {
  if(!fn) {
    return this.interpolator.filters[name];
  }
  this.interpolator.filter(name, fn);
  return this;
};

/**
 * Render a template and a view
 *
 * @param {View} view
 *
 * @return {Element}
 */
Bindings.prototype.bind = function(view) {
  return render(this, view);
};

module.exports = Bindings;