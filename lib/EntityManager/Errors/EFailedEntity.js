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
 * Provides the EFailedEntity error which is used when attempting to validate
 * an entity which doesnt match its options.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sOption = Symbol('EFailedEntity.option');

/**
 * Thrown when validating an entity which fails the validation options.
 *
 * @extends {EError}
 */
export default class EFailedEntity extends EError {

  /**
   * The error constructor.
   *
   * @param {String} option The name of the failing option.
   */
  constructor(option) {
    'use strict';

    super();
    this[sOption] = option;
  }

  /**
   * The option causing the error.
   *
   * @type {String}
   */
  get option() {
    'use strict';

    return this[sOption];
  }

}
