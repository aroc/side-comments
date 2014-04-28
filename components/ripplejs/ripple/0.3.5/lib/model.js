var observer = require('path-observer');
var emitter = require('emitter');

module.exports = function(){

  /**
   * Model.
   *
   * Watch an objects properties for changes.
   *
   * Properties must be set using the `set` method for
   * changes to fire events.
   *
   * @param {Object}
   */
  function Model(props){
    if(!(this instanceof Model)) return new Model(props);
    this.props = props || {};
    this.observer = observer(this.props);
    Model.emit('construct', this);
  }

  /**
   * Mixins
   */
  emitter(Model);

  /**
   * Use a plugin
   *
   * @return {Model}
   */
  Model.use = function(fn, options){
    fn(this, options);
    return this;
  };

  /**
   * Add a function to fire whenever a keypath changes.
   *
   * @param {String} key
   * @param {Function} fn Function to call on event
   *
   * @return {Model}
   */
  Model.prototype.watch = function(key, callback) {
    this.observer(key).on('change', callback);
    return this;
  };

  /**
   * Stop watching a property for changes
   *
   * @param {String} key
   * @param {Function} fn
   *
   * @return {Model}
   */
  Model.prototype.unwatch = function(key, callback) {
    this.observer(key).off('change', callback);
    return this;
  };

  /**
   * Set a property using a keypath
   *
   * @param {String} key eg. 'foo.bar'
   * @param {Mixed} val
   */
  Model.prototype.set = function(key, val) {
    this.observer(key).set(val);
    return this;
  };

  /**
   * Get an attribute using a keypath. If an array
   * of keys is passed in an object is returned with
   * those keys
   *
   * @param {String|Array} key
   *
   * @api public
   * @return {Mixed}
   */
  Model.prototype.get = function(keypath) {
    return this.observer(keypath).get();
  };

  /**
   * Destroy all observers
   *
   * @return {Model}
   */
  Model.prototype.destroy = function(){
    this.observer.dispose();
    return this;
  };

  return Model;
};