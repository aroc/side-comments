var attrs = require('attributes');
var each = require('each');
var unique = require('uniq');
var raf = require('raf-queue');

/**
 * Creates a new sub-view at a node and binds
 * it to the parent
 *
 * @param {View} view
 * @param {Element} node
 * @param {Function} View
 */
function ChildBinding(view, node, View) {
  this.update = this.update.bind(this);
  this.view = view;
  this.attrs = attrs(node);
  this.props = this.getProps();
  var data = this.values();
  data.yield = node.innerHTML;
  this.child = new View({
    owner: view,
    data: data
  });
  this.child.replace(node);
  this.child.on('destroyed', this.unbind.bind(this));
  this.node = this.child.el;
  this.bind();
}

/**
 * Get all of the properties used in all of the attributes
 *
 * @return {Array}
 */
ChildBinding.prototype.getProps = function(){
  var ret = [];
  var interpolator = this.view.bindings.interpolator;
  each(this.attrs, function(name, value){
    ret = ret.concat(interpolator.props(value));
  });
  return unique(ret);
};

/**
 * Bind to changes on the view. Whenever a property
 * changes we'll update the child with the new values.
 */
ChildBinding.prototype.bind = function(){
  var self = this;
  var view = this.view;

  this.props.forEach(function(prop){
    view.watch(prop, self.update);
  });

  this.send();
};

/**
 * Get all the data from the node
 *
 * @return {Object}
 */
ChildBinding.prototype.values = function(){
  var view = this.view;
  var ret = {};
  each(this.attrs, function(name, value){
    ret[name] = view.interpolate(value);
  });
  return ret;
};

/**
 * Send the data to the child
 */
ChildBinding.prototype.send = function(){
  this.child.set(this.values());
};

/**
 * Unbind this view from the parent
 */
ChildBinding.prototype.unbind = function(){
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
 * Update the child view will updated values from
 * the parent. This will batch changes together
 * and only fire once per tick.
 */
ChildBinding.prototype.update = function(){
  if(this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.send, this);
};

module.exports = ChildBinding;
