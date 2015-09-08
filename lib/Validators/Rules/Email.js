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
 * Provides the email address validator rule.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EInvalidEmail = loader('Entity/Validators/Errors/EInvalidEmail');

/**
 * Validate email address.
 *
 * @param {Mixed} value The value to validate.
 * @param {Object} options The options passed to the validator.
 * @param {Function} next The next callback.
 * @param {Error} next.err Any raised errors.
 * @throws {EInvalidEmail} Thrown if the value is an invalid email address.
 */
export default function validateEmail(value, options, next) {
  'use strict';

  /*jshint ignore:start,-W101*/
  /*eslint-disable*/
  if (! /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
    return next(new EInvalidEmail(value));
  }
  /*eslint-enable*/
  /*jshint ignore:end,+W101*/

  next();
}
