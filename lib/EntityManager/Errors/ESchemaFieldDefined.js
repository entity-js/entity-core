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
 * Provides the ESchemaFieldDefined error which is used when attempting to add
 * a new field when it already exists.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sField = Symbol('ESchemaFieldDefined.field');

/**
 * Thrown when adding a new field when the name is already taken.
 *
 * @extends {EError}
 */
export default class ESchemaFieldDefined extends EError {

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
