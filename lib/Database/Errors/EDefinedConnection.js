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
 * Provides the EDefinedConnection error which is used when attempting to create
 * an already defined connection.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sConnectionName = Symbol('EDefinedConnection.connectionName');

/**
 * Thrown when tryng to use an undefined connection.
 *
 * @extends {EError}
 */
export default class EDefinedConnection extends EError {

  /**
   * The error constructor.
   *
   * @param {String} name The name of the connection.
   */
  constructor(name) {
    'use strict';

    super();
    this[sConnectionName] = name;
  }

  /**
   * The connection name causing the error.
   *
   * @type {String}
   */
  get connectionName() {
    'use strict';

    return this[sConnectionName];
  }

}
