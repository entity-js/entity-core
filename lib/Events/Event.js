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
    loader = require('nsloader');

/**
 * The events Event class.
 *
 * @param {Events} events The events owner.
 */
function Event (events) {
  'use strict';

  var _before = [],
      _on = [],
      _after = [];

  Object.defineProperties(this, {
    _before: {
      get: function () {
        return _before;
      }
    },
    _on: {
      get: function () {
        return _on;
      }
    },
    _after: {
      get: function () {
        return _after;
      }
    },
    isEmpty: {
      get: function () {
        return _before.length === 0 &&
          _after.length === 0 &&
          _on.length === 0;
      }
    }
  });
}

/**
 * Registers a before callback.
 *
 * @param {Function} callback The callback to call.
 *   @param {Function} callback.next The next callback.
 *   @param {Object} callback.args The arguments passed to the event.
 * @param {Integer} [weight=0] The weight to apply to the callback.
 * @param {Object} [scope=null] The scope to call the callback with.
 * @return {Event} Returns self.
 * @chainable
 */
Event.prototype.before = function (callback, weight, scope) {
  'use strict';

  this._before.push({
    callback: callback,
    scope: scope || null,
    weight: weight || 0
  });

  loader('Entity/Utils/SortBy')(this._before, 'weight');
  return this;
};

/**
 * Registers a on callback.
 *
 * @param {Function} callback The callback to call.
 *   @param {Function} callback.next The next callback.
 *   @param {Object} callback.args The arguments passed to the event.
 * @param {Integer} [weight=0] The weight to apply to the callback.
 * @param {Object} [scope=null] The scope to call the callback with.
 * @return {Event} Returns self.
 * @chainable
 */
Event.prototype.on = function (callback, weight, scope) {
  'use strict';

  this._on.push({
    callback: callback,
    scope: scope || null,
    weight: weight || 0
  });

  loader('Entity/Utils/SortBy')(this._on, 'weight');
  return this;
};

/**
 * Registers a after callback.
 *
 * @param {Function} callback The callback to call.
 *   @param {Function} callback.next The next callback.
 *   @param {Object} callback.args The arguments passed to the event.
 * @param {Integer} [weight=0] The weight to apply to the callback.
 * @param {Object} [scope=null] The scope to call the callback with.
 * @return {Event} Returns self.
 * @chainable
 */
Event.prototype.after = function (callback, weight, scope) {
  'use strict';

  this._after.push({
    callback: callback,
    scope: scope || null,
    weight: weight || 0
  });

  loader('Entity/Utils/SortBy')(this._after, 'weight');
  return this;
};

/**
 * Unregisters a callback.
 *
 * @param {Function} callback The callback to unregister.
 * @return {Event} Returns self.
 * @chainable
 */
Event.prototype.un = function (callback) {
  'use strict';

  var me = this;
  ['_before', '_on', '_after'].forEach(function (event) {
    for (var i = me[event].length - 1; i >= 0; i--) {
      if (me[event][i].callback !== callback) {
        continue;
      }

      me[event].splice(i, 1);
    }
  });

  return this;
};

/**
 * Fires the event by calling all the registered callbacks.
 *
 * @param {Object} args The args to pass to the callback.
 * @param {Function} [done] The done callback.
 *   @param {Error} done.err Any raised errors.
 * @async
 */
Event.prototype.fire = function (args, done) {
  'use strict';

  if (done === undefined) {
    done = function () {};
  }

  function fireCallback(item) {
    return function (next) {
      try {
        item.callback.call(item.scope, next, args);
      } catch (err) {
        next(err);
      }
    };
  }

  var me = this,
      queue = [];

  ['_before', '_on', '_after'].forEach(function (event) {
    me[event].forEach(function (item) {
      queue.push(fireCallback(item));
    });
  });

  async.series(queue, function (err) {
    done(err ? err : null, args);
  });
};

/**
 * Exports the Event class.
 */
module.exports = Event;
