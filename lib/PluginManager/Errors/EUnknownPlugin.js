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

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sPluginName = Symbol('EUnkownPlugin.pluginName');

/**
 * Thrown when tryng to use an unknown plugin.
 *
 * @extends {EError}
 */
export default class EUnkownPlugin extends EError {

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
