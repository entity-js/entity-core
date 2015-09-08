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
 * Provides the EMachineNameExists error which is used when saving an entity
 * with a machine name that is already being used.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sMachineName = Symbol('EMachineNameExists.machineName');

/**
 * Thrown when saving an entity with a taken machine name.
 *
 * @extends {EError}
 */
export default class EMachineNameExists extends EError {

  /**
   * The error constructor.
   *
   * @param {String} machineName The machine name causing the error.
   */
  constructor(machineName) {
    'use strict';

    super();
    this[sMachineName] = machineName;
  }

  /**
   * The machine name that is causing this error.
   *
   * @type {String}
   */
  get machineName() {
    'use strict';

    return this[sMachineName];
  }

}
