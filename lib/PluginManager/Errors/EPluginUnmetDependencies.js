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

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sPluginName = Symbol('EPluginUnmetDependencies.pluginName'),
    sPluginDependencies = Symbol('EPluginUnmetDependencies.dependencies');

/**
 * Thrown when tryng to enable a plugin that has unmet dependencies.
 *
 * @extends {EError}
 */
export default class EPluginUnmetDependencies extends EError {

  /**
   * The error constructor.
   *
   * @param {String} name The name of the plugin.
   * @param {Object} dependencies The plugin dependencies info object.
   */
  constructor(name, dependencies) {
    'use strict';

    super();
    this[sPluginName] = name;
    this[sPluginDependencies] = dependencies;
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

  /**
   * The plugin dependencies.
   *
   * @type {Object}
   */
  get dependencies() {
    'use strict';

    return this[sPluginDependencies];
  }

}
