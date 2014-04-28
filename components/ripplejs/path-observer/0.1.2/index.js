var emitter = require('emitter');
var equals = require('equals');
var clone = require('clone');
var keypath = require('keypath');

/**
 * Takes a path like ‘foo.bar.baz’ and returns
 * an array we can iterate over for all parts.
 * eg. [‘foo’, ‘foo.bar’, ‘foo.bar.baz’]
 *
 * @param {String} key
 *
 * @return {Array}
 */
function resolvePaths(key) {
  var used = [];
  var paths = key.split('.').map(function(path){
    used.push(path);
    return used.join('.');
  });
  paths.pop();
  return paths;
}

module.exports = function(obj) {

  /**
   * Stores each observer created for each
   * path so they're singletons. This allows us to
   * fire change events on all related paths.
   *
   * @type {Object}
   */
  var cache = {};

  /**
   * Takes a path and announces whenever
   * the value at that path changes.
   *
   * @param {String} path The keypath to the value 'foo.bar.baz'
   */
  function PathObserver(path) {
    if(!(this instanceof PathObserver)) return new PathObserver(path);
    if(cache[path]) return cache[path];

    this.path = path;
    this.paths = resolvePaths(path);
    this.previous = clone(this.get());
    this.check();

    // Whenever a parent path changes we should
    // check to see if this path has changed
    this.changes = this.paths.map(function(name){
      var observer = new PathObserver(name);
      return observer.change(this.check.bind(this));
    }, this);

    cache[path] = this;
  }

  /**
   * Remove all path observers
   */
  PathObserver.dispose = function(){
    for(var path in cache) {
      cache[path].dispose();
    }
  };

  /**
   * Mixin
   */
  emitter(PathObserver.prototype);

  /**
   * Has the path changed?
   *
   * @return {Boolean}
   */
  PathObserver.prototype.dirty = function() {
    return equals(this.previous, this.get()) === false;
  };

  /**
   * Get the value of the path
   *
   * @return {Mixed}
   */
  PathObserver.prototype.get = function(){
    return keypath.get(obj, this.path);
  };

  /**
   * Set the value of the keypath
   *
   * @return {PathObserver}
   */
  PathObserver.prototype.set = function(val) {
    keypath.set(obj, this.path, val);
    this.check(); // This will be automatic with object.observe
    return this;
  };

  /**
   * Announce changes. It won't do anything
   * if the value hasn't actually changed
   *
   * @param {Mixed} value
   *
   * @api public
   * @return {void}
   */
  PathObserver.prototype.check = function() {
    var current = this.get();
    var previous = this.previous;
    if(!this.dirty()) return;
    this.previous = clone(current);
    this.notify(current, previous);
  };

  /**
   * Emits the change event that triggers callback
   * events in object watching for changes
   *
   * @api public
   * @return {void}
   */
  PathObserver.prototype.notify = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('change');
    this.emit.apply(this, args);
    this.paths.forEach(function(name){
      if(cache[name]) cache[name].check();
    });
  };

  /**
   * Bind to changes on this path
   *
   * @param {Function} fn
   *
   * @return {Function}
   */
  PathObserver.prototype.change = function(fn){
    var self = this;
    self.on('change', fn);
    return function(){
      self.off('change', fn);
    };
  };

  /**
   * Clean up and remove all event bindings
   */
  PathObserver.prototype.dispose = function(){
    this.emit('dispose');
    this.off('change');
    this.previous = null;
    this.changes.forEach(function(unbind){
      unbind();
    });
    cache[this.path] = null;
  };

  return PathObserver;
};