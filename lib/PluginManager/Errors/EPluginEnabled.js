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
 * Provides the EPluginEnabled error which is thrown when attempting to enable
 * a plugin thats already enabled.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sPluginName = Symbol('EPluginEnabled.pluginName');

/**
 * Thrown when tryng to enable a plugin thats already enabled.
 *
 * @extends {EError}
 */
export default class EPluginEnabled extends EError {

  /**
   * The error constructor.
   *
   * @param {String} name The name of the plugin.
   */
  constructor(name) {
    'use strict';

    super();
    this[sPluginName] = name;
  }

  /**
   * The plugin name causing the error.
   *
   * @type {String}
   */
  get pluginName() {
    'use strict';

    return this[sPluginName];
  }

}
