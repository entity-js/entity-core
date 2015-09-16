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
 * Provides the EPluginUnmetDependencies error which is thrown when attempting
 * to enable a plugin which has unmet dependencies.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to enable a plugin that has unmet dependencies.
 *
 * @class {EPluginUnmetDependencies}
 * @extends {EError}
 * @param {String} name The name of the plugin.
 * @param {Object} dependencies The plugin dependencies info object.
 */
function EPluginUnmetDependencies (name, dependencies) {
  'use strict';

  EPluginUnmetDependencies.super_.call(this);

  /**
   * The plugin name causing the error.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'pluginName', {
    value: name
  });

  /**
   * The plugin dependencies.
   *
   * @type {Object}
   */
  Object.defineProperty(this, 'dependencies', {
    value: dependencies
  });
}

util.inherits(EPluginUnmetDependencies, EError);

/**
 * Exports the EPluginUnmetDependencies class.
 */
module.exports = EPluginUnmetDependencies;
