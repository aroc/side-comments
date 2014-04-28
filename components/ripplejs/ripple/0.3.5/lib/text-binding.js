var raf = require('raf-queue');

function TextBinding(view, node) {
  this.update = this.update.bind(this);
  this.view = view;
  this.text = node.data;
  this.node = node;
  this.props = view.bindings.interpolator.props(this.text);
  this.render = this.render.bind(this);
  if(this.props.length) {
    this.bind();
  }
}

TextBinding.prototype.bind = function(){
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.watch(prop, update);
  });

  this.render();
};

TextBinding.prototype.unbind = function(){
  var view = this.view;
  var update = this.update;

  this.props.forEach(function(prop){
    view.unwatch(prop, update);
  });

  if(this.job) {
    raf.cancel(this.job);
  }
};

TextBinding.prototype.render = function(){
  var node = this.node;
  var val = this.view.interpolate(this.text);

  if(val == null) {
    this.node.data = '';
  }
  else if(val instanceof Element) {
    node.parentNode.replaceChild(val, node);
    this.node = val;
  }
  else {
    var newNode = document.createTextNode(val);
    node.parentNode.replaceChild(newNode, node);
    this.node = newNode;
  }
};

TextBinding.prototype.update = function(){
  if(this.job) {
    raf.cancel(this.job);
  }
  this.job = raf(this.render, this);
};

module.exports = TextBinding;
