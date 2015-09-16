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
 * Provides the Validators class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var async = require('async'),
    loader = require('nsloader'),
    sortBy = loader('Entity/Utils/SortBy'),
    EUnknownValidator = loader(
      'Entity/Validators/Errors/EUnknownValidator'
    );

/**
 * The Validators class.
 *
 * @class {Validators}
 * @param {EntityCore} core The entity core object.
 */
function Validators (core) {
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

  this
    .register('machine-name', loader('Entity/Validators/Rules/MachineName'))
    .register('email', loader('Entity/Validators/Rules/Email'))
    .register('url', loader('Entity/Validators/Rules/Url'))
    .register('password', loader('Entity/Validators/Rules/Password'));
}

/**
 * Registers a new validator rule.
 *
 * @param {String} name The name of the validator rule.
 * @param {Function} cb The validator callback.
 * @param {Mixed} cb.value The value to be validated.
 * @param {Object} cb.options The options passed to the validator.
 * @param {Function} cb.next Call the next rule callback.
 * @param {Error} cb.next.err Any raised errors.
 * @param {Integer} [weight=0] The weight to apply to the callback.
 * @returns {Validators} Returns self.
 */
Validators.prototype.register = function (name, cb, weight) {
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
 * Determines if a validator has been registered.
 *
 * @param {String} name The name of the validator.
 * @returns {Boolean} Returns true or false.
 */
Validators.prototype.registered = function (name) {
  'use strict';

  return this._rules[name] !== undefined;
};

/**
 * Unregisters a validator or a validators callback.
 *
 * @param {String} name The name of the validator to remove.
 * @param {Function} [cb] The specific callback to remove.
 * @returns {Validators} Returns self.
 */
Validators.prototype.unregister = function (name, cb) {
  'use strict';

  if (this._rules[name] === undefined) {
    throw new EUnknownValidator(name);
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
 * Attempts to validate the value.
 *
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 * @param {Mixed} done.value The value being validated.
 * @param {String} name The name of the validator rule to run.
 * @param {Mixed} value The value to validate.
 * @param {Object} [options] Any options to pass to the validator.
 */
Validators.prototype.validate = function (done, name, value, options) {
  'use strict';

  if (this._rules[name] === undefined) {
    return done(new EUnknownValidator(name));
  }

  function execValidator(validator) {
    return function (next) {
      try {
        validator.callback.call(null, value, options || {}, next);
      } catch (e) {
        next(e);
      }
    };
  }

  var queue = [];
  for (var i = 0, len = this._rules[name].length; i < len; i++) {
    queue.push(execValidator(this._rules[name][i]));
  }

  async.series(queue, function (err) {
    done(err ? err : null, value);
  });
};

/**
 * Export the Validators class.
 */
module.exports = Validators;
