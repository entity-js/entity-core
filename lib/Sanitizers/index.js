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
 * Provides the Sanitizers class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var async = require('async'),
    loader = require('nsloader'),
    sortBy = loader('Entity/Utils/SortBy'),
    EUnknownSanitizer = loader('Entity/Sanitizers/Errors/EUnknownSanitizer');

var sRules = Symbol.for('Sanitizers.rules');

/**
 * The Sanitizers class.
 */
export default class Sanitizers {

  /**
   * The validators class constructor.
   */
  constructor() {
    'use strict';

    this[sRules] = {};
    this.register('trim', loader('Entity/Sanitizers/Rules/Trim'));
  }

  /**
   * The names of the defined rules.
   *
   * @type {Array}
   */
  get rules() {
    'use strict';

    return Object.keys(this[sRules]);
  }

  /**
   * Registers a new sanitizer rule.
   *
   * @param {String} name The name of the sanitizer.
   * @param {Function} cb The sanitizer callback.
   * @param {Mixed} cb.orig The original value.
   * @param {Mixed} cb.value The value to be validated.
   * @param {Object} cb.options The options passed to the validator.
   * @param {Function} cb.next Call the next rule callback.
   * @param {Error} cb.next.err Any raised errors.
   * @param {Mixed} cb.next.value The sanitized value.
   * @param {Integer} [weight=0] The weight to apply to the callback.
   * @returns {Sanitizers} Returns self.
   */
  register(name, cb, weight) {
    'use strict';

    if (this[sRules][name] === undefined) {
      this[sRules][name] = [];
    }

    this[sRules][name].push({
      callback: cb,
      weight: weight || 0
    });

    sortBy(this[sRules][name], 'weight');
    return this;
  }

  /**
   * Determines if a sanitizer has been registered.
   *
   * @param {String} name The name of the sanitizer.
   * @returns {Boolean} Returns true or false.
   */
  registered(name) {
    'use strict';

    return this[sRules][name] !== undefined;
  }

  /**
   * Unregisters a sanitizer or a sanitizers callback.
   *
   * @param {String} name The name of the sanitizer to remove.
   * @param {Function} [cb] The specific callback to remove.
   * @returns {Sanitizers} Returns self.
   */
  unregister(name, cb) {
    'use strict';

    if (this[sRules][name] === undefined) {
      throw new EUnknownSanitizer(name);
    }

    if (cb === undefined) {
      delete this[sRules][name];
    } else {
      var tmp = [];

      for (var i = 0, len = this[sRules][name].length; i < len; i++) {
        if (this[sRules][name][i].callback === cb) {
          continue;
        }

        tmp.push(this[sRules][name][i]);
      }

      if (tmp.length > 0) {
        this[sRules][name] = tmp;
      } else {
        delete this[sRules][name];
      }
    }

    return this;
  }

  /**
   * Attempts to sanitize the value.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Mixed} done.value The sanitized value.
   * @param {String|Array} name The name(s) of the sanitizer(s) to run.
   * @param {Mixed} value The value to sanitize.
   */
  sanitize(done, name, value, options) {
    'use strict';

    if (this[sRules][name] === undefined) {
      return done(new EUnknownSanitizer(name));
    }

    var val = value,
        queue = [];

    function execSanitizer(sanitizer) {
      return function (next) {
        try {
          sanitizer.callback.call(
            null,
            value,
            val,
            options || {},
            function (err, sVal) {
              if (err) {
                return next(err);
              }

              val = sVal;
              next();
            }
          );
        } catch (e) {
          next(e);
        }
      };
    }

    for (var i = 0, len = this[sRules][name].length; i < len; i++) {
      queue.push(execSanitizer(this[sRules][name][i]));
    }

    async.series(queue, function (err) {
      done(err ? err : null, value, val);
    });
  }

}
