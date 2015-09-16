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

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to enable a plugin thats already enabled.
 *
 * @class {EPluginEnabled}
 * @extends {EError}
 * @param {String} name The name of the plugin.
 */
function EPluginEnabled (name) {
  'use strict';

  EPluginEnabled.super_.call(this);

  /**
   * The plugin name causing the error.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'pluginName', {
    value: name
  });
}

util.inherits(EPluginEnabled, EError);

/**
 * Exports the EPluginEnabled class.
 */
module.exports = EPluginEnabled;
