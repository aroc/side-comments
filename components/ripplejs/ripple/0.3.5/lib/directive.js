var raf = require('raf-queue');

/**
 * Creates a new directive using a binding object.
 *
 * @param {View} view
 * @param {Element} node
 * @param {String} attr
 * @param {Object} binding
 */
function Directive(view, node, attr, binding) {
  this.queue = this.queue.bind(this);
  this.view = view;
  if(typeof binding === 'function') {
    this.binding = { update: binding };
  }
  else {
    this.binding = binding;
  }
  this.text = node.getAttribute(attr);
  this.node = node;
  this.attr = attr;
  this.props = view.bindings.interpolator.props(this.text);
  this.bind();
}

/**
 * Start watching the view for changes
 */
Directive.prototype.bind = function(){
  var view = this.view;
  var queue = this.queue;

  if(this.binding.bind) {
    this.binding.bind.call(this, this.node, this.view);
  }

  this.props.forEach(function(prop){
    view.watch(prop, queue);
  });

  this.update();
};

/**
 * Stop watching the view for changes
 */
Directive.prototype.unbind = function(){
  var view = this.view;
  var queue = this.queue;

  this.props.forEach(function(prop){
    view.unwatch(prop, queue);
  });

  if(this.job) {
    raf.cancel(this.job);
  }

  if(this.binding.unbind) {
    this.binding.unbind.call(this, this.node, this.view);
  }
};

/**
 * Update the attribute.
 */
Directive.prototype.update = function(){
  var value = this.view.interpolate(this.text);
  this.binding.update.call(this, value, this.node, this.view);
};

/**
 * Queue an update
 */
Directive.prototype.queue = function(){
  if(this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.update, this);
};

module.exports = Directive;