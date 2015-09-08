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

var sEvents = Symbol('EventManager.events');

/**
 * The events manager class.
 */
export default class EventManager {

  /**
   * Construct the event manager.
   */
  constructor() {
    'use strict';

    this[sEvents] = {};
  }

  /**
   * Get an array of the registered event names.
   *
   * @type {Array}
   */
  get events() {
    'use strict';

    return Object.keys(this[sEvents]);
  }

  /**
   * Returns an array events listening callbacks.
   *
   * @param {String} event The name of the event to return.
   * @return {Array} An array of the listening callbacks.
   * @throws {EUndefinedEvent} Thrown if the event is not defined.
   */
  callbacks(event) {
    'use strict';

    if (this[sEvents][event] === undefined) {
      throw new EUndefinedEvent(event);
    }

    return this[sEvents][event];
  }

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
  listen(event, callback, scope, weight) {
    'use strict';

    if (this[sEvents][event] === undefined) {
      this[sEvents][event] = [];
    }

    this[sEvents][event].push({
      callback: callback,
      scope: scope || null,
      weight: weight || 0
    });

    sortBy(this[sEvents][event], 'weight');
    return this;
  }

  /**
   * Removes an event callback, or an event.
   *
   * @param {String} event The event to unlisten.
   * @param {Function} [callback] The specific callback to remove, if not
   *   defined the whole event is unlistened.
   * @return {EventManager} Returns self.
   * @throws {EUndefinedEvent} Thrown if the event is not defined.
   */
  unlisten(event, callback) {
    'use strict';

    if (this[sEvents][event] === undefined) {
      throw new EUndefinedEvent(event);
    }

    if (callback) {
      var events = [];
      for (var i = 0, len = this[sEvents][event].length; i < len; i++) {
        if (this[sEvents][event][i].callback !== callback) {
          events.push(this[sEvents][event][i]);
        }
      }

      if (events.length > 0) {
        this[sEvents][event] = events;
      } else {
        delete this[sEvents][event];
      }
    } else {
      delete this[sEvents][event];
    }

    return this;
  }

  /**
   * Fires all callbacks of a given event.
   *
   * @param {String} event The event to fire.
   * @param {Function} [done] The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Object} [params] Any params to send to the callbacks.
   */
  fire(event, done, params) {
    'use strict';

    done = done || function () {};

    if (this[sEvents][event] === undefined) {
      return done(null);
    }

    function fireCallback(cb) {
      return function (next) {
        try {
          cb.callback.call(cb.scope, next, params);
        } catch(err) {
          next(err);
        }
      };
    }

    var queue = [];
    this[sEvents][event].forEach(function (item) {
      queue.push(fireCallback(item));
    });

    async.series(queue, function (err) {
      done(err ? err : null);
    });
  }

}
