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

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sRule = Symbol('EUnknownSanitizer.rule');

/**
 * Thrown when tryng to use an unknown santizer.
 *
 * @class EUnknownSanitizer
 * @extends Error
 */
export default class EUnknownSanitizer extends EError {

  /**
   * The error constructor.
   *
   * @param {String} rule The name of the rule.
   */
  constructor(rule) {
    'use strict';

    super();
    this[sRule] = rule;
  }

  /**
   * The name of the rule causing the error.
   *
   * @type String
   */
  get rule() {
    'use strict';

    return this[sRule];
  }

}
