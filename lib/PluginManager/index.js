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
    EUnknownPlugin = loader(
      'Entity/PluginManager/Errors/EUnknownPlugin'
    ),
    EPluginEnabled = loader(
      'Entity/PluginManager/Errors/EPluginEnabled'
    ),
    EPluginDisabled = loader(
      'Entity/PluginManager/Errors/EPluginDisabled'
    ),
    EPluginUnmetDependencies = loader(
      'Entity/PluginManager/Errors/EPluginUnmetDependencies'
    );

/**
 * The plugin manager class.
 *
 * @class {PluginManager}
 * @param {EntityCore} core The entity core object.
 */
function PluginManager (core) {
  'use strict';

  var plugins = {},
      installed = [],
      enabled = [];

  /**
   * The owning core object.
   *
   * @type {EntityCore}
   */
  Object.defineProperty(this, 'core', {
    value: core
  });

  /**
   * An array of the indexed plugin names.
   *
   * @type {Array}
   */
  Object.defineProperty(this, 'plugins', {
    get: function () {
      return Object.keys(plugins);
    }
  });

  /**
   * An array of plugins.
   *
   * @type {Object}
   * @private
   */
  Object.defineProperty(this, '_plugins', {
    value: plugins
  });

  /**
   * An array of installed plugins.
   *
   * @type {Array}
   * @private
   */
  Object.defineProperty(this, '_installed', {
    value: installed
  });

  /**
   * An array of enabled plugins.
   *
   * @type {Array}
   * @private
   */
  Object.defineProperty(this, '_enabled', {
    value: enabled
  });
}

/**
 * Load the plugin info file.
 *
 * @param {String} infoFilename The filename of the plugin info file.
 * @private
 */
PluginManager.prototype._pluginInfo = function(infoFilename) {
  'use strict';

  var dir = path.dirname(infoFilename),
      name = dir.substr(dir.lastIndexOf(path.sep) + 1),
      info = require(infoFilename),
      Plg = require(path.join(dir, info.main || 'index'));

  this._plugins[name] = {
    info: info,
    plugin: new Plg(this, name, info)
  };
};

/**
 * Enable the given plugin, this is the first time the plugin is enabled or
 * after it has been disabled.
 *
 * @param {String} name The name of the plugin to enable.
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 * @private
 */
PluginManager.prototype._enable = function (name, done) {
  'use strict';

  var me = this,
      queue = [];

  queue.push(function (next) {
    me._plugins[name].plugin.enable(next);
  });

  queue.push(function (next) {
    me._installed.push(name);
    next();
  });

  async.series(queue, function (err) {
    if (me.core) {
      me.core.eventManager.fire('plugin.enabled', null, {
        plugin: name
      });
    }

    done(err ? err : null);
  });
};

/**
 * Boot the given plugin.
 *
 * @param {String} name The name of the plugin to boot.
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 * @private
 */
PluginManager.prototype._boot = function (name, done) {
  'use strict';

  var me = this,
      queue = [];

  queue.push(function (next) {
    me._plugins[name].plugin.boot(next);
  });

  queue.push(function (next) {
    me._enabled.push(name);
    next();
  });

  async.series(queue, function (err) {
    done(err ? err : null);
  });
};

/**
 * Disable the given plugin.
 *
 * @param {String} name The name of the plugin to disable.
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 * @private
 */
PluginManager.prototype._disable = function (name, done) {
  'use strict';

  var me = this,
      queue = [];

  queue.push(function (next) {
    me._plugins[name].plugin.disable(next);
  });

  queue.push(function (next) {
    me._installed.splice(me._installed.indexOf(name), 1);
    next();
  });

  queue.push(function (next) {
    me._enabled.splice(me._enabled.indexOf(name), 1);
    next();
  });

  async.series(queue, function (err) {
    if (me.core) {
      me.core.eventManager.fire('plugin.disabled', null, {
        plugin: name
      });
    }

    done(err ? err : null);
  });
};

/**
 * Find plugin info files to index.
 *
 * @param {String} dir The directory to search.
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 */
PluginManager.prototype.index = function (dir, done) {
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
};

/**
 * Initializes the plugins and enables the provided plugins.
 *
 * @param {Array} plugins An array of plugin names to enable.
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 */
PluginManager.prototype.initialize = function (plugins, done) {
  'use strict';

  plugins = plugins || [];

  var me = this,
      queue = [];

  function enable(plugin) {
    return function (next) {
      me._installed.push(plugin);
      me.enable(plugin, next);
    };
  }

  plugins.forEach(function (item) {
    queue.push(enable(item));
  });

  async.series(queue, function (err) {
    done(err ? err : null);
  });
};

/**
 * Get a plugin object.
 *
 * @param {String} name The name of the plugin to get.
 * @return {Plugin} Returns the plugin or null if it can't be found.
 */
PluginManager.prototype.plugin = function (name) {
  'use strict';

  return this._plugins[name] && this._enabled.indexOf(name) > -1 ?
    this._plugins[name].plugin :
    null;
};

/**
 * Determines if the given plugin has been enabled.
 *
 * @param {String} name The name of the plugin.
 * @return {Boolean} Returns true if the plugin has been enabled.
 */
PluginManager.prototype.isEnabled = function (name) {
  'use strict';

  return this._enabled.indexOf(name) > -1;
};

/**
 * Get the dependency information, and if the plugin can be enabled.
 *
 * @param {String} name The name of the plugin.
 * @return {Object} The dependency info.
 */
PluginManager.prototype.dependencies = function (name) {
  'use strict';

  if (this._plugins[name] === undefined) {
    throw new EUnknownPlugin(name);
  }

  var dependencies = this._plugins[name].info.dependencies || [],
      unmet = [];

  if (dependencies.length) {
    for (var i = 0, len = dependencies.length; i < len; i++) {
      if (this._plugins[dependencies[i]] === undefined) {
        unmet.push(dependencies[i]);
      }
    }
  }

  return {
    plugins: dependencies,
    unmet: unmet,
    can: unmet.length === 0
  };
};

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
PluginManager.prototype.enable = function (name, done) {
  'use strict';

  if (this._plugins[name] === undefined) {
    return done(new EUnknownPlugin(name));
  }

  if (this._enabled.indexOf(name) > -1) {
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
    if (me._enabled.indexOf(item) === -1) {
      queue.push(enableDependency(item));
    }
  });

  if (this._installed.indexOf(name) === -1) {
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
};

/**
 * Disabled the given plugin.
 *
 * @param {String} name The name of the plugin to disable.
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 * @throws {EUnkownPlugin} If the plugin hasn't been indexed.
 * @throws {EPluginDisabled} If the plugin hasn't been enabled.
 */
PluginManager.prototype.disable = function (name, done) {
  'use strict';

  if (this._plugins[name] === undefined) {
    return done(new EUnknownPlugin(name));
  }

  if (this._enabled.indexOf(name) === -1) {
    return done(new EPluginDisabled(name));
  }

  this._disable(name, function (err) {
    done(err ? err : null);
  });
};

/**
 * Exports the PluginManager class.
 */
module.exports = PluginManager;
