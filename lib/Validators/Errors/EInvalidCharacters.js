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
 * Provides the EInvalidCharacters error which is thrown when the provided
 * value contains invalid characters.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sValue = Symbol('EInvalidCharacters.value');

/**
 * Thrown when tryng to validate a value with invalid characters.
 *
 * @extends {EError}
 */
export default class EInvalidCharacters extends EError {

  /**
   * The error constructor.
   *
   * @param {String} value The value being validated.
   * @param {String} rule The allowed characters.
   */
  constructor(value) {
    'use strict';

    super();
    this[sValue] = value;
  }

  /**
   * The value causing the error.
   *
   * @type {String}
   */
  get value() {
    'use strict';

    return this[sValue];
  }

}
