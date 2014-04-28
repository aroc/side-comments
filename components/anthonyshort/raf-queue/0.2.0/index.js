var raf = require('raf');
var queue = [];
var requestId;
var id = 0;

/**
 * Add a job to the queue passing in
 * an optional context to call the function in
 *
 * @param {Function} fn
 * @param {Object} cxt
 */

function frame (fn, cxt) {
  var frameId = id++;
  var length = queue.push({
    id: frameId,
    fn: fn,
    cxt: cxt
  });
  if(!requestId) requestId = raf(flush);
  return frameId;
};

/**
 * Remove a job from the queue using the
 * frameId returned when it was added
 *
 * @param {Number} id
 */

frame.cancel = function (id) {
  for (var i = queue.length - 1; i >= 0; i--) {
    if(queue[i].id === id) {
      queue.splice(i, 1);
      break;
    }
  }
};

/**
 * Add a function to the queue, but only once
 *
 * @param {Function} fn
 * @param {Object} cxt
 */

frame.once = function (fn, cxt) {
  for (var i = queue.length - 1; i >= 0; i--) {
    if(queue[i].fn === fn) return;
  }
  frame(fn, cxt);
};

/**
 * Get the current queue length
 */

frame.queued = function () {
  return queue.length;
};

/**
 * Clear the queue and remove all pending jobs
 */

frame.clear = function () {
  queue = [];
  if(requestId) raf.cancel(requestId);
  requestId = null;
};

/**
 * Fire a function after all of the jobs in the
 * current queue have fired. This is usually used
 * in testing.
 */

frame.defer = function (fn) {
  raf(raf.bind(null, fn));
};

/**
 * Flushes the queue and runs each job
 */

function flush () {
  while(queue.length) {
    var job = queue.shift();
    job.fn.call(job.cxt);
  }
  requestId = null;
}

module.exports = frame;