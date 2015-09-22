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

/**
 * The Sanitizers class.
 *
 * @class {Sanitizers}
 * @param {EntityCore} core The entity core object.
 */
function Sanitizers(core) {
  'use strict';

  var rules = {};

  /**
   * The owner core object.
   *
   * @type {EntityCore}
   * @readOnly
   */
  Object.defineProperty(this, 'core', {
    value: core
  });

  /**
   * The defined rules.
   *
   * @type {Object}
   * @readOnly
   * @private
   */
  Object.defineProperty(this, '_rules', {
    value: rules
  });

  /**
   * The names of the defined rules.
   *
   * @type {Array}
   */
  Object.defineProperty(this, 'rules', {
    get: function () {
      return Object.keys(rules);
    }
  });

  this.register('trim', loader('Entity/Sanitizers/Rules/Trim'));
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
Sanitizers.prototype.register = function (name, cb, weight) {
  'use strict';

  if (this._rules[name] === undefined) {
    this._rules[name] = [];
  }

  this._rules[name].push({
    callback: cb,
    weight: weight || 0
  });

  sortBy(this._rules[name], 'weight');
  return this;
};

/**
 * Determines if a sanitizer has been registered.
 *
 * @param {String} name The name of the sanitizer.
 * @returns {Boolean} Returns true or false.
 */
Sanitizers.prototype.registered = function (name) {
  'use strict';

  return this._rules[name] !== undefined;
};

/**
 * Unregisters a sanitizer or a sanitizers callback.
 *
 * @param {String} name The name of the sanitizer to remove.
 * @param {Function} [cb] The specific callback to remove.
 * @returns {Sanitizers} Returns self.
 */
Sanitizers.prototype.unregister = function (name, cb) {
  'use strict';

  if (this._rules[name] === undefined) {
    throw new EUnknownSanitizer(name);
  }

  if (cb === undefined) {
    delete this._rules[name];
  } else {
    var tmp = [];

    for (var i = 0, len = this._rules[name].length; i < len; i++) {
      if (this._rules[name][i].callback === cb) {
        continue;
      }

      tmp.push(this._rules[name][i]);
    }

    if (tmp.length > 0) {
      this._rules[name] = tmp;
    } else {
      delete this._rules[name];
    }
  }

  return this;
};

/**
 * Attempts to sanitize the value.
 *
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 * @param {Mixed} done.value The sanitized value.
 * @param {String|Array} name The name(s) of the sanitizer(s) to run.
 * @param {Mixed} value The value to sanitize.
 */
Sanitizers.prototype.sanitize = function (done, name, value, options) {
  'use strict';

  if (this._rules[name] === undefined) {
    return done(new EUnknownSanitizer(name));
  }

  var me = this,
      val = value,
      queue = [];

  function execSanitizer(sanitizer) {
    return function (next) {
      try {
        sanitizer.callback.call(
          me,
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

  for (var i = 0, len = this._rules[name].length; i < len; i++) {
    queue.push(execSanitizer(this._rules[name][i]));
  }

  async.series(queue, function (err) {
    done(err ? err : null, value, val);
  });
};

/**
 * Exports the Sanitizers class.
 */
module.exports = Sanitizers;
