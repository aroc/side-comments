var isBoolean = require('is-boolean-attribute');
var raf = require('raf-queue');

/**
 * Creates a new attribute text binding for a view.
 * If the view attribute contains interpolation, the
 * attribute will be automatically updated whenever the
 * result of the expression changes.
 *
 * Updating will be called once per tick. So if there
 * are multiple changes to the view in a single tick,
 * this will only touch the DOM once.
 *
 * @param {View} view
 * @param {Element} node
 * @param {String} attr
 */
function AttrBinding(view, node, attr) {
  this.update = this.update.bind(this);
  this.view = view;
  this.text = node.getAttribute(attr);
  this.node = node;
  this.attr = attr;
  this.props = view.bindings.interpolator.props(this.text);
  this.bind();
}

/**
 * Start watching the view for changes
 */
AttrBinding.prototype.bind = function(){
  if(!this.props.length) return;
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.watch(prop, update);
  });

  this.render();
};

/**
 * Stop watching the view for changes
 */
AttrBinding.prototype.unbind = function(){
  if(!this.props.length) return;
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.unwatch(prop, update);
  });

  if(this.job) {
    raf.cancel(this.job);
  }
};

/**
 * Update the attribute
 *
 * @return {[type]}
 */
AttrBinding.prototype.render = function(){
  var val = this.view.interpolate(this.text);
  if(val == null) val = '';
  if(isBoolean(this.attr) && !val) {
    this.node.removeAttribute(this.attr);
  }
  else {
    this.node.setAttribute(this.attr, val);
  }
};

/**
 * Update the attribute.
 */
AttrBinding.prototype.update = function(){
  if(this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.render, this);
};

module.exports = AttrBinding;