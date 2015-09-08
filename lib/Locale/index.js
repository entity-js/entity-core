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
 * Provides the locale manager.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var path = require('path'),
    glob = require('glob'),
    async = require('async');

var sLocales = Symbol('Locale.locales'),
    sDatabase = Symbol('Locale.database');

/**
 * The Locale class provides functionality for storing translation strings and
 * translating a given string.
 */
export default class Locale {

  /**
   * The Locale class constructor.
   *
   * @param {Database} database The database manager.
   */
  constructor(database) {
    'use strict';

    this[sLocales] = {};
    this[sDatabase] = database;
  }

  /**
   * Get the defined language names.
   *
   * @type {Array}
   */
  get languages() {
    'use strict';

    return Object.keys(this[sLocales]);
  }

  /**
   * Gets the defined database manager.
   *
   * @type {Database}
   */
  get database() {
    'use strict';

    return this[sDatabase];
  }

  /**
   * Add translations stored in the database.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @private
   */
  _addFromDatabase(done) {
    'use strict';

    var me = this;
    this[sDatabase].collection('locales').find({}, function (err, docs) {
      if (err) {
        return done(err);
      }

      docs.forEach(function (doc) {
        if (me[sLocales][doc.language] === undefined) {
          me[sLocales][doc.language] = {};
        }

        me[sLocales][doc.language][doc.msg] = doc.translation;
      });

      done(null);
    });
  }

  /**
   * Processes the given JSON filename.
   *
   * @param {String} filename The translation file filename, note that it must
   *   be in the format *.LANGUAGE.json.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @private
   */
  _processFile(filename, done) {
    'use strict';

    try {
      var locale = require(filename),
          language = filename.split('.')[1];

      if (this[sLocales][language] === undefined) {
        this[sLocales][language] = {};
      }

      for (var msg in locale) {
        if (this[sLocales][language][msg]) {
          continue;
        }

        this[sLocales][language][msg] = locale[msg];
      }

      done(null);
    } catch (err) {
      done(err);
    }
  }

  /**
   * Perform token string replacement, this is based upon the PHP.js strtr
   * script.
   *
   * @param {String} str The string to replace.
   * @param {Object} params The token params.
   * @return {String} The replaced string.
   * @private
   */
  _strtr(str, params) {
    'use strict';

    var i, len,
        j, frm,
        from = [],
        to = [],
        ret = '',
        match = false;

    for (var arg in params) {
      from.push(':' + arg);
      to.push(params[arg]);
    }

    for (i = 0, len = str.length; i < len; i++) {
      match = false;
      for (j = 0, frm = from.length; j < frm; j++) {
        if (str.substr(i, from[j].length) === from[j]) {
          match = true;
          i = (i + from[j].length) - 1;

          break;
        }
      }

      ret += match ? to[j] : str.charAt(i);
    }

    return ret;
  }

  /**
   * Add translations from a JSON file.
   *
   * @param {String} filename The translation file filename, note that it must
   *   be in the format *.LANGUAGE.json.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  addFromFile(filename, done) {
    'use strict';

    this._processFile(filename, done);
  }

  /**
   * Add translation files from the given directory.
   *
   * @param {String} dir The directory to scan.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  addFromDir(dir, done) {
    'use strict';

    var me = this;

    function processFile(filename) {
      return function (next) {
        me.addFromFile(filename, next);
      };
    }

    glob(path.join(dir, '**', '*.json'), function (err, files) {
      if (err) {
        return done(err);
      }

      var queue = [];
      files.forEach(function (item) {
        var splt = item.split('.');
        if (splt.length === 3 && splt[1].length === 2) {
          queue.push(processFile(item));
        }
      });

      async.series(queue, function (err) {
        done(err ? err : null);
      });
    });
  }

  /**
   * Returns all defined translations for the given language.
   *
   * @param {String} language The language to return.
   * @return {Object} An object containing the translation strings.
   * @throws {Error} If the language is undefined.
   */
  locales(language) {
    'use strict';

    if (this[sLocales][language] === undefined) {
      throw new Error(); // @todo
    }

    return this[sLocales][language];
  }

  /**
   * Initializes the locale, collection translations from the database and
   * provided directory.
   *
   * @param {String} dir The directory to read from.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  initialize(dir, done) {
    'use strict';

    var me = this,
        queue = [];

    if (dir && dir !== '') {
      queue.push(function (next) {
        me.addFromDir(dir, next);
      });
    }

    queue.push(function (next) {
      me._addFromDatabase(next);
    });

    async.series(queue, function (err) {
      done(err ? err : null);
    });
  }

  /**
   * Translates a given msg in the given language and stores in the database.
   *
   * @param {String} language The language the translation belongs to.
   * @param {String} str The english message that this is translating.
   * @param {String} translation The translated message to save.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  translate(language, str, translation, done) {
    'use strict';

    var me = this;

    this[sDatabase].collection('locales').findOne({
      language: language,
      msg: str
    }, function (err, doc) {
      if (err) {
        return done(err);
      }

      if (!doc) {
        doc = {
          language: language,
          msg: str
        };
      }

      doc.translation = translation;

      if (me[sLocales][language] === undefined) {
        me[sLocales][language] = {};
      }
      me[sLocales][language][str] = translation;

      me[sDatabase].collection('locales').save(doc, function (err2) {
        done(err2 ? err2 : null);
      });
    });
  }

  /**
   * Translate the given string.
   *
   * @param {String} language The language to translate to.
   * @param {String} str The string to translate to.
   * @param {Object} [params] The params for token replacement.
   * @return {String} The translated and token replaced string.
   */
  t(language, str, params) {
    'use strict';

    if (this[sLocales][language] && this[sLocales][language][str]) {
      str = this[sLocales][language][str];
    }

    return this._strtr(str, params);
  }

}
