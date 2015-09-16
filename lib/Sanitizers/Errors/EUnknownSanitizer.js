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
 * Provides the EUnknownSanitizer error which is used when attempting to use
 * an unknown sanitizer.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to use an unknown santizer.
 *
 * @class {EUnknownSanitizer}
 * @extends {EError}
 * @param {String} rule The name of the rule.
 */
function EUnknownSanitizer (rule) {
  'use strict';

  EUnknownSanitizer.super_.call(this);

  /**
   * The name of the rule causing the error.
   *
   * @type String
   */
  Object.defineProperty(this, 'rule', {
    value: rule
  });
}

util.inherits(EUnknownSanitizer, EError);

/**
 * Exports the EUnknownSanitizer class.
 */
module.exports = EUnknownSanitizer;
