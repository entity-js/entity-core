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
 * Provides the entity manager component.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var async = require('async'),
    loader = require('nsloader'),
    Schema = loader('Entity/EntityManager/Schema'),
    Entity = loader('Entity/EntityManager/Entity'),
    ECantFindEntity = loader(
      'Entity/EntityManager/Errors/ECantFindEntity'
    );

var sSchemas = Symbol('EntityManager.schemas'),
    sDatabase = Symbol('EntityManager.database'),
    sValidators = Symbol('EntityManager.validators'),
    sSanitizers = Symbol('EntityManager.sanitizers');

/**
 * The entity manager class.
 */
export default class EntityManager {

  /**
   * The available entity field types.
   *
   * @type {Object}
   * @static
   */
  static get fieldTypes() {
    var fieldTypes = {};

    fieldTypes.Mixed = {
      title: 'Mixed',
      description: 'A field containing mixed data.',
      icon: 'mixed',
      type: null
    };

    fieldTypes.String = {
      title: 'String',
      description: 'A field containing a string.',
      icon: 'text',
      type: String
    };

    fieldTypes.Number = {
      title: 'Number',
      description: 'A field containing a number.',
      icon: 'number',
      type: Number
    };

    fieldTypes.Boolean = {
      title: 'Boolean',
      description: 'A field containing a yes/no option.',
      icon: 'boolean',
      type: Boolean
    };

    fieldTypes.Date = {
      title: 'Date',
      description: 'A field containing a date.',
      icon: 'date',
      type: Date
    };

    fieldTypes.Array = {
      title: 'Array',
      description: 'A field containing an array of data.',
      icon: 'array',
      type: Array
    };

    fieldTypes.Object = {
      title: 'Object',
      description: 'A field containing an object of data.',
      icon: 'object',
      type: Object
    };

    fieldTypes.Entity = {
      title: 'Entity',
      description: 'A field containing a reference to an entity.',
      icon: 'entity',
      type: Entity
    };

    return fieldTypes;
  }

  /**
   * The entity manager constructor.
   *
   * @param {Database} database The database manager.
   * @param {Validators} validators The validators object.
   * @param {Sanitizers} sanitizers The sanitizers object.
   */
  constructor(database, validators, sanitizers) {
    'use strict';

    this[sSchemas] = {};
    this[sDatabase] = database;
    this[sValidators] = validators;
    this[sSanitizers] = sanitizers;

    this[sValidators].register(
      'entity',
      loader('Entity/EntityManager/Validators/Entity')
    );
  }

  /**
   * Get the database.
   *
   * @type {Database}
   */
  get database() {
    'use strict';

    return this[sDatabase];
  }

  /**
   * Get the validators.
   *
   * @type {Validators}
   */
  get validators() {
    'use strict';

    return this[sValidators];
  }

  /**
   * Get the sanitizers.
   *
   * @type {Sanitizers}
   */
  get sanitizers() {
    'use strict';

    return this[sSanitizers];
  }

  /**
   * Get the trash collection.
   *
   * @type {MongoDB#Collection}
   */
  get trashCollection() {
    'use strict';

    return this[sDatabase].collection('trash');
  }

  /**
   * Get an array of registered schema details.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Array} done.schemas An array of found schemas.
   * @param {String} done.schemas[].machineName The machine name.
   * @param {String} done.schemas[].title The title.
   * @param {String} done.schemas[].description The description.
   */
  schemas(done) {
    'use strict';

    this[sDatabase].collection('schemas').find({}, function (err, docs) {
      if (err) {
        return done(err);
      }

      var schemas = [];
      docs.forEach(function (item) {
        schemas.push({
          machineName: item.machineName,
          title: item.title || '',
          description: item.description || ''
        });
      });

      done(null, schemas);
    });
  }

  /**
   * Attempt to get a schema.
   *
   * @param {String} name The name of the schema.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Schema} done.schema The found schema.
   */
  schema(name, done) {
    'use strict';

    var schema = new Schema(this);
    schema.machineName = name;
    schema.load(function (err) {
      if (err) {
        return done(err);
      }

      done(null, schema.isNew ? null : schema);
    });
  }

  /**
   * Determine if the schema and entity machine name already exists.
   *
   * @param {String} type The schema type.
   * @param {String} machineName The entity machine name.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Boolean} done.exists True if the entity and schema exists.
   */
  exists(type, machineName, done) {
    'use strict';

    var me = this,
        queue = [],
        schema;

    queue.push(function (next) {
      me.schema(type, function (err, s) {
        if (err) {
          return next(err);
        }

        schema = s;
        next();
      });
    });

    async.series(queue, function (err) {
      if (err) {
        return done(err);
      }

      schema.entityCollection.count({
        machineName: machineName
      }, function (err, count) {
        done(err ? err : null, count > 0);
      });
    });
  }

  /**
   * Count the number of entities of a schema type.
   *
   * @param {String} type The schema type.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Integer} done.count The number of found entities.
   */
  count(type, done) {
    'use strict';

    var me = this,
        queue = [],
        schema;

    queue.push(function (next) {
      me.schema(type, function (err, s) {
        if (err) {
          return next(err);
        }

        schema = s;
        next();
      });
    });

    async.series(queue, function (err) {
      if (err) {
        return done(err);
      }

      schema.entityCollection.count(function (err, count) {
        done(err ? err : null, count);
      });
    });
  }

  /**
   * Should create a new Entity of type.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Entity} done.entity The created entity.
   * @param {String} type The entity type to create.
   * @param {String} [subtype] The entity subtype.
   */
  create(done, type, subtype) {
    'use strict';

    var me = this;
    this.schema(type, function (err, schema) {
      if (err) {
        return done(err);
      }

      done(null, new Entity(me, schema, subtype));
    });
  }

  /**
   * Loads an entity from the database.
   *
   * @param {String} type The entity type.
   * @param {String} machineName The entity machine name.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Entity} done.entity The loaded entity.
   * @param {Boolean} [force=false] If true this will return a created entity if
   *   the entity doesnt exist in the database rather than null.
   */
  load(type, machineName, done, force) {
    'use strict';

    var me = this,
        queue = [],
        schema = null,
        entity = null;

    queue.push(function (next) {
      me.schema(type, function (err, s) {
        if (err) {
          return next(err);
        }

        schema = s;
        next();
      });
    });

    queue.push(function (next) {
      if (!schema) {
        return next(new Error());
      }

      entity = new Entity(me, schema);
      entity.machineName = machineName;
      entity.load(function (err) {
        if (err && err instanceof ECantFindEntity === false) {
          entity = null;
          return next(err);
        }

        if (err && err instanceof ECantFindEntity && force !== true) {
          entity = null;
          return next(err);
        }

        next();
      });
    });

    async.series(queue, function (err) {
      done(err ? err : null, entity);
    });
  }

  /**
   * Find some entities based on some conditions.
   *
   * @param {String} type The entity type.
   * @param {Object} conditions The find conditions to pass to MongoDB.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Array} done.entities An array of found entities.
   * @param {Integer} done.page The page being returned.
   * @param {Integer} done.total The total number of entities.
   * @param {Integer} done.perPage The number of entities per page.
   * @param {Integer} done.pages The number of pages available.
   * @param {Integer} [perPage=25] The number of items per page, if 0 all items
   *   will be returned.
   * @param {Integer} [page=1] The page to return.
   */
  find(type, conditions, done, perPage, page) {
    'use strict';

    perPage = Math.max(perPage || 25, 0);
    page = Math.max(page || 1, 1);

    var me = this,
        queue = [],
        queue2 = [],
        count,
        skip = perPage * (page - 1),
        pages,
        entities = [],
        schema = null,
        orderBy = conditions.$orderby || {};

    conditions = conditions.$query || conditions;

    function setupEntity(doc) {
      return function (next) {
        entities.push(new Entity(me, schema));
        entities[entities.length - 1]._setDoc(doc, next);
      };
    }

    queue.push(function (next) {
      me.schema(type, function (err, s) {
        if (err) {
          return next(err);
        }

        schema = s;
        next();
      });
    });

    queue.push(function (next) {
      schema.entityCollection.count(conditions, function (err, c) {
        if (err) {
          return next(err);
        }

        count = c;
        pages = Math.ceil(count / perPage);
        next();
      });
    });

    queue.push(function (next) {
      schema.entityCollection.find(conditions)
        .sort(orderBy)
        .limit(perPage)
        .skip(skip)
        .forEach(function (err, doc) {
          if (err) {
            return next(err);
          }

          if (!doc) {
            return next();
          }

          queue2.push(setupEntity(doc));
        });
    });

    queue.push(function (next) {
      async.series(queue2, next);
    });

    async.series(queue, function (err) {
      done(err ? err : null, entities, page, count, perPage, pages);
    });
  }

}
