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
 * The entity core component.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var path = require('path'),
    fs = require('fs'),
    async = require('async'),
    express = require('express'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    loader = require('nsloader'),
    Config = loader('Entity/Utils/Config'),
    sortBy = loader('Entity/Utils/SortBy'),
    Locale = loader('Entity/Locale'),
    Database = loader('Entity/Database'),
    Validators = loader('Entity/Validators'),
    Sanitizers = loader('Entity/Sanitizers'),
    EventManager = loader('Entity/EventManager'),
    PluginManager = loader('Entity/PluginManager'),
    EntityManager = loader('Entity/EntityManager');

/**
 * The core Entity class.
 *
 * @class
 * @param {String} filename The filename of the config file to load.
 * @param {Boolean} [cli=false] Set to true if running in CLI mode.
 */
function EntityCore(filename, cli) {
  'use strict';

  var isInitialized = false,
      isCli = cli === true,
      middleware = [],
      http = null,
      https = null,
      socket = null,
      session = null,
      socketRouter = null;

  Object.defineProperties(this, {
    /**
     * Determine if the core has been initialized.
     *
     * @var {Boolean} _isInitialized
     * @default false
     * @memberof EntityCore
     * @private
     * @instance
     */
    _isInitialized: {
      get: function () {
        return isInitialized;
      },
      set: function (value) {
        isInitialized = value === true;
      }
    },
    /**
     * Determine if the core has been initialized.
     *
     * @var {Boolean} isInitialized
     * @default false
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    isInitialized: {
      get: function () {
        return isInitialized;
      }
    },
    /**
     * Determine if we are running in CLI mode.
     *
     * @var {Boolean} isCli
     * @default false
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    isCli: {
      value: isCli
    },
    /**
     * Get the event manager object.
     *
     * @var {EventManager} eventManager
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    eventManager: {
      value: new EventManager(this)
    },
    /**
     * Get the config object.
     *
     * @var {Config} config
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    config: {
      value: new Config(this, filename)
    },
    /**
     * Get the locale object.
     *
     * @var {Locale} locale
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    locale: {
      value: new Locale(this)
    },
    /**
     * Get the database manager object.
     *
     * @var {Database} database
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    database: {
      value: new Database(this)
    },
    /**
     * Get the validators manager object.
     *
     * @var {Validators} validators
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    validators: {
      value: new Validators(this)
    },
    /**
     * Get the sanitizers manager object.
     *
     * @var {Sanitizers} sanitizers
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    sanitizers: {
      value: new Sanitizers(this)
    },
    /**
     * Get the entity manager object.
     *
     * @var {EntityManager} entityManager
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    entityManager: {
      value: new EntityManager(this)
    },
    /**
     * Get the plugin manager object.
     *
     * @var {PluginManager} pluginManager
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    pluginManager: {
      value: new PluginManager(this)
    },
    /**
     * The defined middleware callbacks.
     *
     * @var {Array} _middleware
     * @memberof EntityCore
     * @private
     * @instance
     */
    _middleware: {
      get: function () {
        return middleware;
      },
      set: function (value) {
        middleware = value;
      }
    },
    /**
     * The Express application.
     *
     * @var {Express} express
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    express: {
      value: express()
    },
    /**
     * Get the HTTP server.
     *
     * @var {Http} _http
     * @memberof EntityCore
     * @private
     * @instance
     */
    _http: {
      get: function () {
        return http;
      },
      set: function (value) {
        http = value;
      }
    },
    /**
     * Get the HTTPS server.
     *
     * @var {Https} _https
     * @memberof EntityCore
     * @private
     * @instance
     */
    _https: {
      get: function () {
        return https;
      },
      set: function (value) {
        https = value;
      }
    },
    /**
     * The Socket.io socket.
     *
     * @var {Socket} _socket
     * @memberof EntityCore
     * @private
     * @instance
     */
    _socket: {
      get: function () {
        return socket;
      },
      set: function (value) {
        socket = value;
      }
    },
    /**
     * The mongo Session store.
     *
     * @var {MongoStore} _session
     * @memberof EntityCore
     * @private
     * @instance
     */
    _session: {
      get: function () {
        return session;
      },
      set: function (value) {
        session = value;
      }
    },
    /**
     * The Socket router.
     *
     * @var {Router} _socketRouter
     * @memberof EntityCore
     * @private
     * @instance
     */
    _socketRouter: {
      get: function () {
        return socketRouter;
      },
      set: function (value) {
        socketRouter = value;
      }
    }
  });
}

/**
 * Connects to the MongoDB, details provided by the config.
 *
 * @param {Function} done The done callback.
 * @param {Error} done.err Any errors raised.
 * @private
 */
EntityCore.prototype._connectToMongo = function (done) {
  'use strict';

  var me = this,
      queue = [];

  function connect(name) {
    return function (next) {
      me.database.connect(
        name,
        me.config.get('database.' + name, {
          host: '0.0.0.0',
          name: 'entity'
        })
      );

      next();
    };
  }

  // @todo - multiple connections?
  queue.push(connect('default'));

  async.series(queue, function (err) {
    done(err ? err : null);
  });
};

/**
 * Indexes and initializes the plugin manager and enabled plugins.
 *
 * @param {Function} done The done callback.
 * @param {Error} done.err Any errors raised.
 * @private
 */
EntityCore.prototype._plugins = function (done) {
  'use strict';

  var me = this,
      queue = [];

  queue.push(function (next) {
    me.pluginManager.index(
      me.config.get(
        'plugins.path',
        path.join(__dirname, '..', 'plugins')
      ),
      next
    );
  });

  queue.push(function (next) {
    me.pluginManager.initialize(
      me.config.get('plugins.enabled', []),
      next
    );
  });

  async.series(queue, function (err) {
    done(err ? err : null);
  });
};

/**
 * Initialize the HTTP, HTTPS and SocketIO servers, and sessions.
 *
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 * @private
 */
EntityCore.prototype._servers = function (done) {
  'use strict';

  var me = this,
      sessionSecret = this.config.get('session.secret', 'entity-core'),
      httpsEnabled = this.config.get('https.enabled', false);

  function setupSession() {
    me._session = new MongoStore({
      db: me.database.connection().database
    });

    // Express MongoDB session storage.
    me.express.use(session({
      saveUninitialized: true,
      resave: true,
      secret: sessionSecret,
      store: me._session
    }));

    // Use passport session.
    me.express.use(passport.initialize());
    me.express.use(passport.session());
  }

  function setupServers() {
    if (me.config.get('http.enabled', true)) {
      me._http = require('http')
        .createServer(me.express)
        .listen(me.config.get('http.port', process.env.PORT));
    }

    if (httpsEnabled) {
      me._https = require('https')
        .createServer({
          key: fs.readFileSync(
            me.config.get('https.ssl.key', './certs/client.key')
          ),
          cert: fs.readFileSync(
            me.config.get('https.ssl.cert', './certs/client.crt')
          ),
          requestCert: true
        }, me.express)
        .listen(me.config.get('https.port', 443));
    }
  }

  function setupSocket() {
    me._socket = require('socket.io').listen(
      httpsEnabled ? me._https : me._http
    );

    me._socket.use(require('passport.socketio').authorize({
      cookieParser: require('cookie-parser'),
      key: 'session_id',
      secret: sessionSecret,
      store: me._session,
      success: onAuthorizeSuccess,
      fail: onAuthorizeFail
    }));

    me._socketRouter = require('socket.io-events')();
    me._socketRouter.on('*', function (sock, args, next) {
      var name = args.shift(),
          msg = args.shift(),
          req = sock.sock.client.request;

      makeRequestResponse(req,sock.sock);
      req.url = name;
      req.body = msg;

      this.express.handle(req, sock.sock);
      next();
    });

    me._socket.use(me._socketRouter);
    me._socket.sockets.on('connection', function (socket) {
      var req = socket.client.request;

      makeRequestResponse(req, req.res);
      req.url = 'connect';
      me.express.handle(req, req.res);

      socket.on('disconnect', function () {
        var req = socket.client.request;
        makeRequestResponse(req, req.res);

        req.url = 'disconnect';
        me.express.handle(req, req.res);
      });
    });
  }

  // Do this to trick connect-mongo into thinking its a native DB.
  this.database.connection().database.listCollections = true;

  function onAuthorizeSuccess(data, accept) {
    accept(null, true);
  }

  function onAuthorizeFail(data, message, error, accept) {
    if (error) {
      throw new Error(message);
    }

    accept(null, false);
  }

  function makeRequestResponse(req, res) {
    req.method = 'socket';
    req.app = me.express;

    req.isAuthenticated = function () {
      /* jshint ignore:start */
      return (req.user && req.user.logged_in !== false);
      /* jshint ignore:end */
    };

    res.status = function (status) {
      res.status = status;
      return res;
    };

    res.send = function (data) {
      if (typeof data === 'object' && !data.status) {
        data.status = res.status;
      }

      res.emit('data', data);
      return res;
    };

    res.json = res.send;
  }

  setupSession();
  setupServers();

  if (this.config.get('socket.enabled', false)) {
    setupSocket();
  }

  this.express.set('entity-core', this);
  this._routes(done);
};

/**
 * Initialize the Express routes.
 *
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 * @private
 */
EntityCore.prototype._routes = function (done) {
  'use strict';

  var me = this;

  this.express.use(bodyParser());
  this.express.use(methodOverride());

  this.express.use(function (req, res, next) {
    //console.log('Time:', Date.now());
    // @todo - setup context
    next();
  });

  this.eventManager.fire('routes', function (err) {
    if (err) {
      return done(err);
    }

    me.express.use(function(err, req, res, next) {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

    done(null);
  }, {
    express: this.express
  });
};

/**
 * Add a middleware callback, this gets fired before the initialized event.
 *
 * @param {Function} cb The callback to fire when ready.
 *   @param {EntityCore} cb.core The entity core object.
 *   @param {Function} cb.next The next callback.
 * @param {Object} [config] A config object to pass to the callback.
 * @param {Integer} [weight=0] A weight to apply to the middleware callback.
 * @return {EntityCore} Returns self.
 * @chainable
 */
EntityCore.prototype.middleware = function (cb, config, weight) {
  'use strict';

  this._middleware.push({
    callback: cb,
    config: config || {},
    weight: weight || 0
  });

  sortBy(this._middleware, 'weight');
  return this;
};

/**
 * Initializes the core application.
 *
 * @param {Function} done The done callback.
 *   @param {Error} done.err Any errors raised.
 */
EntityCore.prototype.initialize = function (done) {
  'use strict';

  var me = this,
      queue = [];

  function middleware(item) {
    return function (next) {
      item.callback.call(me, me, item.config, next);
    };
  }

  queue.push(function (next) {
    me.config.load(next);
  });

  queue.push(function (next) {
    me._connectToMongo(next);
  });

  queue.push(function (next) {
    me.locale.initialize(me.config.get('locale.dir'), next);
  });

  queue.push(function (next) {
    me._plugins(next);
  });

  if (this.isCli) {
    // @todo - setup cli commands.
  } else {
    queue.push(function (next) {
      me._servers(next);
    });
  }

  this._middleware.forEach(function (item) {
    queue.push(middleware(item));
  });

  queue.push(function (next) {
    me.eventManager.fire('initialized', next, {
      core: me
    });
  });

  async.series(queue, function (err) {
    if (!err) {
      me._isInitialized = true;
    }

    done(err ? err : null);
  });
};

/**
 * Exports the EntityCore class.
 */
module.exports = EntityCore;
