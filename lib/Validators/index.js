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
    EUnknownValidator = loader('Entity/Validators/Errors/EUnknownValidator');

var sRules = Symbol.for('Validators.rules');

/**
 * The Validators class.
 */
export default class Validators {

  /**
   * The validators class constructor.
   */
  constructor() {
    'use strict';

    this[sRules] = {};

    this
      .register('machine-name', loader('Entity/Validators/Rules/MachineName'))
      .register('email', loader('Entity/Validators/Rules/Email'))
      .register('url', loader('Entity/Validators/Rules/Url'))
      .register('password', loader('Entity/Validators/Rules/Password'));
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
   * Determines if a validator has been registered.
   *
   * @param {String} name The name of the validator.
   * @returns {Boolean} Returns true or false.
   */
  registered(name) {
    'use strict';

    return this[sRules][name] !== undefined;
  }

  /**
   * Unregisters a validator or a validators callback.
   *
   * @param {String} name The name of the validator to remove.
   * @param {Function} [cb] The specific callback to remove.
   * @returns {Validators} Returns self.
   */
  unregister(name, cb) {
    'use strict';

    if (this[sRules][name] === undefined) {
      throw new EUnknownValidator(name);
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
   * Attempts to validate the value.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Mixed} done.value The value being validated.
   * @param {String} name The name of the validator rule to run.
   * @param {Mixed} value The value to validate.
   * @param {Object} [options] Any options to pass to the validator.
   */
  validate(done, name, value, options) {
    'use strict';

    if (this[sRules][name] === undefined) {
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
    for (var i = 0, len = this[sRules][name].length; i < len; i++) {
      queue.push(execValidator(this[sRules][name][i]));
    }

    async.series(queue, function (err) {
      done(err ? err : null, value);
    });
  }

}
