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
 * Provides the EPluginDisabled error which is thrown when attempting to disable
 * a plugin thats already disabled.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to disable a plugin thats already disabled.
 *
 * @class {EPluginDisabled}
 * @extends {EError}
 * @param {String} name The name of the plugin.
 */
function EPluginDisabled (name) {
  'use strict';

  EPluginDisabled.super_.call(this);

  /**
   * The plugin name causing the error.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'pluginName', {
    value: name
  });
}

util.inherits(EPluginDisabled, EError);

/**
 * Exports the EPluginDisabled class.
 */
module.exports = EPluginDisabled;
