/**
 *  ____            __        __
 * /\  _`\         /\ \__  __/\ \__
 * \ \ \L\_\    ___\ \ ,_\/\_\ \ ,_\  __  __
 *  \ \  _\L  /' _ `\ \ \/\/\ \ \ \/ /\ \/\ \
 *   \ \ \L\ \/\ \/\ \ \ \_\ \ \ \ \_\ \ \_\ \
 *    \ \____/\ \_\ \_\ \__\\ \_\ \__\\/`____ \
 *     \/___/  \/_/\/_/\/__/ \/_/\/__/ `/___/> \
 *                                        /\___/
 *                                        \/__/
 *
 * Entity Core
 */

var async = require('async'),
    loader = require('nsloader'),
    Event = loader('Entity/Events/Event');

/**
 * The Events class.
 */
function Events () {
  'use strict';

  var _events = {};

  Object.defineProperties(this, {
    events: {
      get: function () {
        return Object.keys(_events);
      }
    },
    _events: {
      get: function () {
        return _events;
      }
    }
  });
}

/**
 * Listen to a before event.
 *
 * @param {String} event The event to listen to.
 * @param {Function} [callback] An object containing all the arguments to pass
 *   to the callbacks.
 * @param {Integer} {weight=0} Apply a weight to the callback.
 * @param {Mixed} {scope=null} The scope to apply to the call.
 * @return {Events} Returns self.
 * @chainable
 */
Events.prototype.before = function (event, callback, weight, scope) {
  'use strict';

  if (this._events[event] === undefined) {
    this._events[event] = new Event(this);
  }

  this._events[event].before(callback, weight, scope);
  return this;
};

/**
 * Listen to an event.
 *
 * @param {String} event The event to listen to.
 * @param {Function} [callback] An object containing all the arguments to pass
 *   to the callbacks.
 * @param {Integer} {weight=0} Apply a weight to the callback.
 * @param {Mixed} {scope=null} The scope to apply to the call.
 * @return {Events} Returns self.
 * @chainable
 */
Events.prototype.on = function (event, callback, weight, scope) {
  'use strict';

  if (this._events[event] === undefined) {
    this._events[event] = new Event(this);
  }

  this._events[event].on(callback, weight, scope);
  return this;
};

/**
 * Listen to an after event.
 *
 * @param {String} event The event to listen to.
 * @param {Function} [callback] An object containing all the arguments to pass
 *   to the callbacks.
 * @param {Integer} {weight=0} Apply a weight to the callback.
 * @param {Mixed} {scope=null} The scope to apply to the call.
 * @return {Events} Returns self.
 * @chainable
 */
Events.prototype.after = function (event, callback, weight, scope) {
  'use strict';

  if (this._events[event] === undefined) {
    this._events[event] = new Event(this);
  }

  this._events[event].after(callback, weight, scope);
  return this;
};

/**
 * Unlisten to an event or a specified callback.
 *
 * @param {String|Array} events An event name or an array of events.
 * @param {Function} [callback] An object containing all the arguments to pass
 *   to the callbacks.
 * @return {Events} Returns self.
 * @chainable
 */
Events.prototype.un = function (event, callback) {
  'use strict';

  if (this._events[event] && callback === undefined) {
    delete this._events[event];
  } else if (this._events[event]) {
    this._events[event].un(callback);
    if (this._events[event].isEmpty) {
      delete this._events[event];
    }
  }

  return this;
};

/**
 * Fire all callbacks associated to an event or events.
 *
 * @param {Function} done The done callback.
 *   @param {Error} done.err Any raised errors.
 *   @param {Object} done.args The arguments passed to the callbacks.
 * @param {String|Array} events An event name or an array of events.
 * @param {Object} [args={}] An object containing all the arguments to pass to
 *   the callbacks.
 * @async
 */
Events.prototype.fire = function (done, events, args) {
  'use strict';

  var me = this,
      queue = [];

  args = args || {};
  events = events instanceof Array ? events : [events];
  events.forEach(function (event) {
    if (me._events[event] === undefined) {
      return;
    }

    queue.push(function (next) {
      me._events[event].fire(args, next);
    });
  });

  async.series(queue, function (err) {
    done(err ? err : null, args);
  });
};

/**
 * Emit all callbacks associated to an event or events.
 *
 * @param {String|Array} events An event name or an array of events.
 * @param {Object} [args={}] An object containing all the arguments to pass to
 *   the callbacks.
 * @async
 */
Events.prototype.emit = function (events, args) {
  'use strict';

  this.fire(function (err) {
    // @todo - do something with the error.
  }, events, args);

  return this;
};

/**
 * Exports the Events class.
 */
module.exports = Events;
