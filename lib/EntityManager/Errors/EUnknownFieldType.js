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
 * Provides the EUnknownFieldType error which is used when attempting to add a
 * field with an unknown field type.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sField = Symbol('EUnknownFieldType.field'),
    sFieldType = Symbol('EUnknownFieldType.fieldType');

/**
 * Thrown when adding a new field with an unknown field type.
 *
 * @extends {EError}
 */
export default class EUnknownFieldType extends EError {

  /**
   * The error constructor.
   *
   * @param {String} field The name of the field.
   * @param {String} fieldType The field type.
   */
  constructor(field, fieldType) {
    'use strict';

    super();
    this[sField] = field;
    this[sFieldType] = fieldType;
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

  /**
   * The field type.
   *
   * @type {String}
   */
  get fieldType() {
    'use strict';

    return this[sFieldType];
  }

}
