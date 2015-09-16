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
 * Provides the EError class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util');

/**
 * Provides an abstract Error class to be overriden.
 *
 * @class
 * @extends {Error}
 */
function EError() {
  'use strict';

  EError.super_.call(this);

  var name = this.constructor.name,
      stack = (new Error()).stack;

  Object.defineProperties(this, {
    /**
     * Get the errors constructor name.
     *
     * @var {String} name
     * @memberof EError
     * @readonly
     * @instance
     */
    name: {
      value: name
    },
    /**
     * Get the errors stack.
     *
     * @var {Object} stack
     * @memberof EError
     * @readonly
     * @instance
     */
    stack: {
      value: stack
    }
  });
}

util.inherits(EError, Error);

/**
 * Exports the EError class.
 */
module.exports = EError;
