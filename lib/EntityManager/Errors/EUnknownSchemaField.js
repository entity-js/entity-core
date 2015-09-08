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
 * Provides the EUnknownSchemaField error which is used when attempting to do
 * something with an unknown schema field.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sField = Symbol('EUnknownSchemaField.field');

/**
 * Thrown when do something with an unknown field.
 *
 * @extends {EError}
 */
export default class EUnknownSchemaField extends EError {

  /**
   * The error constructor.
   *
   * @param {String} field The name of the field.
   */
  constructor(field) {
    'use strict';

    super();
    this[sField] = field;
  }

  /**
   * The schema field name.
   *
   * @type {String}
   */
  get field() {
    'use strict';

    return this[sField];
  }

}
