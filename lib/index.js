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

var sConfig = Symbol('EntityCore.config'),
    sLocale = Symbol('EntityCore.locale'),
    sDatabase = Symbol('EntityCore.database'),
    sValidators = Symbol('EntityCore.validators'),
    sSanitizers = Symbol('EntityCore.sanitizers'),
    sEventManager = Symbol('EntityCore.eventManager'),
    sPluginManager = Symbol('EntityCore.pluginManager'),
    sEntityManager = Symbol('EntityCore.entityManager'),
    sIsInitialized = Symbol('EntityCore.isInitialized'),
    sIsCli = Symbol('EntityCore.isCli'),
    sExpress = Symbol('EntityCore.express'),
    sHttp = Symbol('EntityCore.http'),
    sHttps = Symbol('EntityCore.https'),
    sSocket = Symbol('EntityCore.socket'),
    sSocketRouter = Symbol('EntityCore.socketRouter'),
    sSessionStore = Symbol('EntityCore.sessionStore'),
    sSessionSecret = Symbol('EntityCore.sessionSecret'),
    sMiddleware = Symbol.for('EntityCore.middleware');

/**
 * The core Entity class.
 *
 * This is used to initialize all subsystems of Entity.
 */
export default class EntityCore {

  /**
   * The EntityCore class constructor.
   *
   * @param {Boolean} [cli=false] Set to true if running in CLI mode.
   */
  constructor(cli) {
    'use strict';

    this[sIsInitialized] = false;
    this[sIsCli] = cli === true;
    this[sConfig] = null;
    this[sDatabase] = new Database();
    this[sValidators] = new Validators();
    this[sSanitizers] = new Sanitizers();
    this[sEventManager] = new EventManager();
    this[sPluginManager] = new PluginManager();
    this[sEntityManager] = new EntityManager(
      this[sDatabase],
      this[sValidators],
      this[sSanitizers]
    );

    this[sMiddleware] = [];
  }

  /**
   * Determine if the core has been initialized.
   *
   * @type {Boolean}
   */
  get initialized() {
    'use strict';

    return this[sIsInitialized];
  }

  /**
   * Determine if we are running in CLI mode.
   *
   * @type {Boolean}
   */
  get isCli() {
    'use strict';

    return this[sIsCli];
  }

  /**
   * Get the config object.
   *
   * @type {Config}
   */
  get config() {
    'use strict';

    return this[sConfig];
  }

  /**
   * Get the locale object.
   *
   * @type {Locale}
   */
  get locale() {
    'use strict';

    return this[sLocale];
  }

  /**
   * Get the database manager object.
   *
   * @type {Database}
   */
  get database() {
    'use strict';

    return this[sDatabase];
  }

  /**
   * Get the event manager object.
   *
   * @type {EventManager}
   */
  get eventManager() {
    'use strict';

    return this[sEventManager];
  }

  /**
   * Get the plugin manager object.
   *
   * @type {PluginManager}
   */
  get pluginManager() {
    'use strict';

    return this[sPluginManager];
  }

  /**
   * Get the HTTP server.
   *
   * @type {Http}
   */
  get http() {
    'use strict';

    return this[sHttp];
  }

  /**
   * Get the HTTPS server.
   *
   * @type {Https}
   */
  get https() {
    'use strict';

    return this[sHttps];
  }

  /**
   * Load the configuration file.
   *
   * @param {String} filename - The config filename.
   * @param {Function} done - The done callback.
   * @param {Error} done.err - Any errors raised.
   * @private
   */
  _loadConfig(filename, done) {
    'use strict';

    this[sConfig] = new Config(filename);
    this[sConfig].load(done);
  }

  /**
   * Connects to the MongoDB, details provided by the config.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any errors raised.
   * @private
   */
  _connectToMongo(done) {
    'use strict';

    var me = this,
        queue = [];

    function connect(name) {
      return function (next) {
        me[sDatabase].connect(
          name,
          me[sConfig].get('database.' + name, {
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
  }

  /**
   * Indexes and initializes the plugin manager and enabled plugins.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any errors raised.
   * @private
   */
  _plugins(done) {
    'use strict';

    var me = this,
        queue = [];

    queue.push(function (next) {
      me[sPluginManager].index(
        me[sConfig].get(
          'plugins.path',
          path.join(__dirname, '..', 'plugins')
        ),
        next
      );
    });

    queue.push(function (next) {
      me[sPluginManager].initialize(
        me[sConfig].get('plugins.enabled', []),
        next
      );
    });

    async.series(queue, function (err) {
      done(err ? err : null);
    });
  }

  /**
   * Initialize the HTTP, HTTPS and SocketIO servers, and sessions.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @private
   */
  _servers(done) {
    'use strict';

    var me = this;

    this[sSessionSecret] = this[sConfig].get('session.secret', 'entity-core');

    // Do this to trick connect-mongo into thinking its a native DB.
    this[sDatabase].connection().database.listCollections = true;
    this[sSessionStore] = new MongoStore({
      db: this[sDatabase].connection().database
    });

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
      req.app = me[sExpress];

      req.isAuthenticated = function () {
        return (req.user && req.user.logged_in !== false);
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

    this[sExpress] = express();

    // Express MongoDB session storage.
    this[sExpress].use(session({
      saveUninitialized: true,
      resave: true,
      secret: this[sSessionSecret],
      store: this[sSessionStore]
    }));

    // Use passport session.
    this[sExpress].use(passport.initialize());
    this[sExpress].use(passport.session());

    if (this[sConfig].get('http.enabled', true)) {
      this[sHttp] = require('http')
        .createServer(this[sExpress])
        .listen(this[sConfig].get('http.port', process.env.PORT));
    }

    var httpsEnabled = this[sConfig].get('https.enabled', false);
    if (httpsEnabled) {
      this[sHttps] = require('https')
        .createServer({
          key: fs.readFileSync(
            this[sConfig].get('https.ssl.key', './certs/client.key')
          ),
          cert: fs.readFileSync(
            this[sConfig].get('https.ssl.cert', './certs/client.crt')
          ),
          requestCert: true
        }, this[sExpress])
        .listen(this[sConfig].get('https.port', 443));
    }

    if (this[sConfig].get('socket.enabled', false)) {
      this[sSocket] = require('socket.io').listen(
        httpsEnabled ? this[sHttps] : this[sHttp]
      );

      this[sSocket].use(require('passport.socketio').authorize({
        cookieParser: require('cookie-parser'),
        key: 'session_id',
        secret: this[sSessionSecret],
        store: this[sSessionStore],
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
      }));

      this[sSocketRouter] = require('socket.io-events')();
      this[sSocketRouter].on('*', function (sock, args, next) {
        var name = args.shift(),
            msg = args.shift(),
            req = sock.sock.client.request;

        makeRequestResponse(req,sock.sock);
        req.url = name;
        req.body = msg;

        this[sExpress].handle(req, sock.sock);
        next();
      });

      this[sSocket].use(this[sSocketRouter]);
      this[sSocket].sockets.on('connection', function (socket) {
        var req = socket.client.request;

        makeRequestResponse(req, req.res);
        req.url = 'connect';
        me[sExpress].handle(req, req.res);

        socket.on('disconnect', function () {
          var req = socket.client.request;
          makeRequestResponse(req, req.res);

          req.url = 'disconnect';
          me[sExpress].handle(req, req.res);
        });
      });
    }

    this[sExpress].set('entity-core', this);
    this._routes(done);
  }

  /**
   * Initialize the Express routes.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @private
   */
  _routes(done) {
    'use strict';

    var me = this;

    this[sExpress].use(bodyParser());
    this[sExpress].use(methodOverride());

    this[sExpress].use(function (req, res, next) {
      //console.log('Time:', Date.now());
      // @todo - setup context
      next();
    });

    this.eventManager.fire('routes', function (err) {
      if (err) {
        return done(err);
      }

      me[sExpress].use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
      });

      done(null);
    }, {
      express: this[sExpress]
    });
  }

  /**
   * Add a middleware callback, this gets fired before the initialized event.
   *
   * @param {Function} cb The callback to fire when ready.
   * @param {EntityCore} cb.core The entity core object.
   * @param {Function} cb.next The next callback.
   * @return {EntityCore} Returns self.
   */
  middleware(cb, weight) {
    'use strict';

    this[sMiddleware].push({
      callback: cb,
      weight: weight || 0
    });

    sortBy(this[sMiddleware], 'weight');
    return this;
  }

  /**
   * Initializes the core application.
   *
   * @param {String} filename The filename of the config file to load.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any errors raised.
   */
  initialize(filename, done) {
    'use strict';

    var me = this,
        queue = [];

    function middleware(item) {
      return function (next) {
        item.callback.call(me, me, next);
      };
    }

    queue.push(function (next) {
      me._loadConfig(filename, next);
    });

    queue.push(function (next) {
      me._connectToMongo(next);
    });

    queue.push(function (next) {
      me[sLocale] = new Locale(me[sDatabase]);
      me[sLocale].initialize(me[sConfig].get('locale.dir'), next);
    });

    queue.push(function (next) {
      me._plugins(next);
    });

    if (this[sIsCli]) {
      // @todo - setup cli commands.
    } else {
      queue.push(function (next) {
        me._servers(next);
      });
    }

    this[sMiddleware].forEach(function (item) {
      queue.push(middleware(item));
    });

    queue.push(function (next) {
      me[sEventManager].fire('initialized', next, {
        core: me
      });
    });

    async.series(queue, function (err) {
      if (!err) {
        me[sIsInitialized] = true;
      }

      done(err ? err : null);
    });
  }

}
