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
 * The plugin manager class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var path = require('path'),
    async = require('async'),
    glob = require('glob'),
    loader = require('nsloader'),
    EUnknownPlugin = loader('Entity/PluginManager/Errors/EUnknownPlugin'),
    EPluginEnabled = loader('Entity/PluginManager/Errors/EPluginEnabled'),
    EPluginDisabled = loader('Entity/PluginManager/Errors/EPluginDisabled'),
    EPluginUnmetDependencies = loader(
      'Entity/PluginManager/Errors/EPluginUnmetDependencies'
    );

var sPlugins = Symbol('Plugins.plugins'),
    sInstalled = Symbol('Plugins.installed'),
    sEnabled = Symbol('Plugins.enabled');

/**
 * The plugin manager class.
 */
export default class PluginManager {

  /**
   * The plugin manager constructor.
   */
  constructor() {
    'use strict';

    this[sPlugins] = {};
    this[sInstalled] = [];
    this[sEnabled] = [];
  }

  /**
   * An array of the indexed plugin names.
   *
   * @type {Array}
   */
  get plugins() {
    'use strict';

    return Object.keys(this[sPlugins]);
  }

  /**
   * An array of enabled plugins.
   *
   * @type {Array}
   */
  get enabled() {
    'use strict';

    return this[sEnabled];
  }

  /**
   * Load the plugin info file.
   *
   * @param {String} infoFilename The filename of the plugin info file.
   * @private
   */
  _pluginInfo(infoFilename) {
    'use strict';

    var dir = path.dirname(infoFilename),
        name = dir.substr(dir.lastIndexOf(path.sep) + 1),
        info = require(infoFilename),
        Plg = require(path.join(dir, info.main || 'index'));

    this[sPlugins][name] = {
      info: info,
      plugin: new Plg(name)
    };
  }

  /**
   * Enable the given plugin, this is the first time the plugin is enabled or
   * after it has been disabled.
   *
   * @param {String} name The name of the plugin to enable.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @private
   */
  _enable(name, done) {
    'use strict';

    var me = this,
        queue = [];

    queue.push(function (next) {
      me[sPlugins][name].plugin.enable(next);
    });

    queue.push(function (next) {
      me[sInstalled].push(name);
      next();
    });

    async.series(queue, function (err) {
      loader('Entity').eventManager.fire('plugin.enabled', null, {
        plugin: name
      });

      done(err ? err : null);
    });
  }

  /**
   * Boot the given plugin.
   *
   * @param {String} name The name of the plugin to boot.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @private
   */
  _boot(name, done) {
    'use strict';

    var me = this,
        queue = [];

    queue.push(function (next) {
      me[sPlugins][name].plugin.boot(next);
    });

    queue.push(function (next) {
      me[sEnabled].push(name);
      next();
    });

    async.series(queue, function (err) {
      done(err ? err : null);
    });
  }

  /**
   * Disable the given plugin.
   *
   * @param {String} name The name of the plugin to disable.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @private
   */
  _disable(name, done) {
    'use strict';

    var me = this,
        queue = [];

    queue.push(function (next) {
      me[sPlugins][name].plugin.disable(next);
    });

    queue.push(function (next) {
      me[sInstalled].splice(me[sInstalled].indexOf(name), 1);
      next();
    });

    queue.push(function (next) {
      me[sEnabled].splice(me[sEnabled].indexOf(name), 1);
      next();
    });

    async.series(queue, function (err) {
      loader('Entity').eventManager.fire('plugin.disabled', null, {
        plugin: name
      });

      done(err ? err : null);
    });
  }

  /**
   * Find plugin info files to index.
   *
   * @param {String} dir The directory to search.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  index(dir, done) {
    'use strict';

    var me = this;
    glob(path.join(dir, '**', 'plugin.json'), function (err, files) {
      if (err) {
        return done(err);
      }

      files.forEach(function (item) {
        me._pluginInfo(item);
      });

      done();
    });
  }

  /**
   * Initializes the plugins and enables the provided plugins.
   *
   * @param {Array} plugins An array of plugin names to enable.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  initialize(plugins, done) {
    'use strict';

    plugins = plugins || [];

    var me = this,
        queue = [];

    function enable(plugin) {
      return function (next) {
        me[sInstalled].push(plugin);
        me.enable(plugin, next);
      };
    }

    plugins.forEach(function (item) {
      queue.push(enable(item));
    });

    async.series(queue, function (err) {
      done(err ? err : null);
    });
  }

  /**
   * Get a plugin object.
   *
   * @param {String} name The name of the plugin to get.
   * @return {Plugin} Returns the plugin or null if it can't be found.
   */
  plugin(name) {
    'use strict';

    return this[sPlugins][name] && this[sEnabled].indexOf(name) > -1 ?
      this[sPlugins][name].plugin :
      null;
  }

  /**
   * Determines if the given plugin has been enabled.
   *
   * @param {String} name The name of the plugin.
   * @return {Boolean} Returns true if the plugin has been enabled.
   */
  isEnabled(name) {
    'use strict';

    return this[sEnabled].indexOf(name) > -1;
  }

  /**
   * Get the dependency information, and if the plugin can be enabled.
   *
   * @param {String} name The name of the plugin.
   * @return {Object} The dependency info.
   */
  dependencies(name) {
    'use strict';

    if (this[sPlugins][name] === undefined) {
      throw new EUnknownPlugin(name);
    }

    var dependencies = this[sPlugins][name].info.dependencies || [],
        unmet = [];

    if (dependencies.length) {
      for (var i = 0, len = dependencies.length; i < len; i++) {
        if (this[sPlugins][dependencies[i]] === undefined) {
          unmet.push(dependencies[i]);
        }
      }
    }

    return {
      plugins: dependencies,
      unmet: unmet,
      can: unmet.length === 0
    };
  }

  /**
   * Enables the given plugin.
   *
   * @param {String} name The name of the plugin to enable.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @throws {EUnkownPlugin} If the plugin hasn't been indexed.
   * @throws {EPluginEnabled} If the plugin has already been enabled.
   * @throws {EPluginUnmetDependencies} If the plugin dependencies are unmet.
   */
  enable(name, done) {
    'use strict';

    if (this[sPlugins][name] === undefined) {
      return done(new EUnknownPlugin(name));
    }

    if (this[sEnabled].indexOf(name) > -1) {
      return done(new EPluginEnabled(name));
    }

    var dependencies = this.dependencies(name);
    if (dependencies.can === false) {
      return done(new EPluginUnmetDependencies(name, dependencies));
    }

    var me = this,
        queue = [];

    function enableDependency(plugin) {
      return function (next) {
        me.enable(plugin, next);
      };
    }

    dependencies.plugins.forEach(function (item) {
      if (me[sEnabled].indexOf(item) === -1) {
        queue.push(enableDependency(item));
      }
    });

    if (this[sInstalled].indexOf(name) === -1) {
      queue.push(function (next) {
        me._enable(name, next);
      });
    }

    queue.push(function (next) {
      me._boot(name, next);
    });

    async.series(queue, function (err) {
      done(err ? err : null);
    });
  }

  /**
   * Disabled the given plugin.
   *
   * @param {String} name The name of the plugin to disable.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @throws {EUnkownPlugin} If the plugin hasn't been indexed.
   * @throws {EPluginDisabled} If the plugin hasn't been enabled.
   */
  disable(name, done) {
    'use strict';

    if (this[sPlugins][name] === undefined) {
      return done(new EUnknownPlugin(name));
    }

    if (this[sEnabled].indexOf(name) === -1) {
      return done(new EPluginDisabled(name));
    }

    this._disable(name, function (err) {
      done(err ? err : null);
    });
  }
}
