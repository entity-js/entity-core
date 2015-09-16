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

/**
 * Provides the EventsManager class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var async = require('async'),
    loader = require('nsloader'),
    sortBy = loader('Entity/Utils/SortBy'),
    EUndefinedEvent = loader('Entity/EventManager/Errors/EUndefinedEvent');

/**
 * The events manager class.
 *
 * @class
 * @param {EntityCore} core The owning entity core obejct.
 */
function EventManager(core) {
  'use strict';

  var events = {};

  Object.defineProperties(this, {
    /**
     * The owner core object.
     *
     * @var {EntityCore} core
     * @memberof EventManager
     * @readonly
     * @instance
     */
    core: {
      value: core
    },
    /**
     * The internal defined events.
     *
     * @var {Object} _events
     * @memberof EventManager
     * @private
     * @instance
     */
    _events: {
      get: function () {
        return events;
      }
    },
    /**
     * Get an array of the registered event names.
     *
     * @var {Array} events
     * @memberof EventManager
     * @readonly
     * @instance
     */
    events: {
      get: function () {
        return Object.keys(events);
      }
    }
  });
}

/**
 * Returns an array events listening callbacks.
 *
 * @param {String} event The name of the event to return.
 * @return {Array} An array of the listening callbacks.
 * @throws {EUndefinedEvent} Thrown if the event is not defined.
 */
EventManager.prototype.callbacks = function (event) {
  'use strict';

  if (this._events[event] === undefined) {
    throw new EUndefinedEvent(event);
  }

  return this._events[event];
};

/**
 * Registers an event listener.
 *
 * @param {String} event The event to listen for.
 * @param {Function} callback The callback method.
 * @param {Function} callback.next The callbacks 'next' method.
 * @param {Object} callback.params An object storing the params sent to
 *   each callback.
 * @param {Object} [scope=null] The scope to apply to the callback.
 * @param {Integer} [weight=0] The weight to apply to the callback.
 * @return {EventManager} Returns self.
 */
EventManager.prototype.listen = function (event, callback, scope, weight) {
  'use strict';

  if (this._events[event] === undefined) {
    this._events[event] = [];
  }

  this._events[event].push({
    callback: callback,
    scope: scope || null,
    weight: weight || 0
  });

  sortBy(this._events[event], 'weight');
  return this;
};

/**
 * Removes an event callback, or an event.
 *
 * @param {String} event The event to unlisten.
 * @param {Function} [callback] The specific callback to remove, if not
 *   defined the whole event is unlistened.
 * @return {EventManager} Returns self.
 * @throws {EUndefinedEvent} Thrown if the event is not defined.
 */
EventManager.prototype.unlisten = function (event, callback) {
  'use strict';

  if (this._events[event] === undefined) {
    throw new EUndefinedEvent(event);
  }

  if (callback) {
    var events = [];
    for (var i = 0, len = this._events[event].length; i < len; i++) {
      if (this._events[event][i].callback !== callback) {
        events.push(this._events[event][i]);
      }
    }

    if (events.length > 0) {
      this._events[event] = events;
    } else {
      delete this._events[event];
    }
  } else {
    delete this._events[event];
  }

  return this;
};

/**
 * Fires all callbacks of a given event.
 *
 * @param {Array|String} events The event or events to fire.
 * @param {Function} [done] The done callback.
 * @param {Error} done.err Any raised errors.
 * @param {Object} [params] Any params to send to the callbacks.
 */
EventManager.prototype.fire = function (events, done, params) {
  'use strict';

  done = done || function () {};
  events = events instanceof Array ? events : [events];

  function fireCallback(cb) {
    return function (next) {
      try {
        cb.callback.call(cb.scope, next, params);
      } catch (err) {
        next(err);
      }
    };
  }

  var me = this,
      queue = [];

  events.forEach(function (event) {
    if (me._events[event] === undefined) {
      return;
    }

    me._events[event].forEach(function (item) {
      queue.push(fireCallback(item));
    });
  });

  async.series(queue, function (err) {
    done(err ? err : null);
  });
};

/**
 * Exports the EventManager class.
 */
module.exports = EventManager;
