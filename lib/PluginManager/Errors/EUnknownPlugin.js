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
 * Provides the EUnknownPlugin error which is thrown when attempting to use a
 * plugin that hasn't been indexed.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to use an unknown plugin.
 *
 *
 * @class {EUnkownPlugin}
 * @extends {EError}
 * @param {String} name The name of the plugin.
 */
function EUnkownPlugin (name) {
  'use strict';

  EUnkownPlugin.super_.call(this);

  /**
   * The plugin name causing the error.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'pluginName', {
    value: name
  });
}

util.inherits(EUnkownPlugin, EError);

/**
 * Exports the EUnkownPlugin class.
 */
module.exports = EUnkownPlugin;
