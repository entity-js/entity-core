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
 * Provides the Schema class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var async = require('async'),
    loader = require('nsloader'),
    sortBy = loader('Entity/Utils/SortBy'),
    BaseEntity = loader('Entity/EntityManager/BaseEntity'),
    EUnknownFieldType = loader(
      'Entity/EntityManager/Errors/EUnknownFieldType'
    ),
    ESchemaFieldDefined = loader(
      'Entity/EntityManager/Errors/ESchemaFieldDefined'
    ),
    EUnknownSchemaField = loader(
      'Entity/EntityManager/Errors/EUnknownSchemaField'
    ),
    EUnknownValidator = loader(
      'Entity/Validators/Errors/EUnknownValidator'
    ),
    EUnknownSanitizer = loader(
      'Entity/Sanitizers/Errors/EUnknownSanitizer'
    );

var sIsUpdated = Symbol.for('BaseEntity.isUpdated'),
    sTitle = Symbol('Schema.title'),
    sDescription = Symbol('Schema.description'),
    sFields = Symbol.for('Schema.fields');

/**
 * The entity schema class.
 *
 * @extends {BaseEntity}
 */
export default class Schema extends BaseEntity {

  /**
   * The schema constructor.
   *
   * @param {EntityManager} manager The entity manager.
   */
  constructor(manager) {
    'use strict';

    super(manager);

    this[sTitle] = '';
    this[sDescription] = '';
    this[sFields] = {};
  }

  /**
   * Get the database collection name.
   *
   * @return {String} The collection name.
   */
  collectionName() {
    'use strict';

    return 'schemas';
  }

  /**
   * Get the database collection name for the entity.
   *
   * @return {String} The entity collection name.
   */
  entityCollectionName() {
    'use strict';

    return 'entity-' + this.machineName;
  }

  /**
   * Get the entity collection.
   *
   * @type {MongoDB#Collection}
   */
  get entityCollection() {
    'use strict';

    var collectionName = this.entityCollectionName();
    return this.manager.database.collection(collectionName);
  }

  /**
   * Get the schemas title.
   *
   * @type {String}
   */
  get title() {
    'use strict';

    return this[sTitle];
  }

  /**
   * Set the schemas title.
   *
   * @type {String}
   */
  set title(value) {
    'use strict';

    this[sIsUpdated] = true;
    this[sTitle] = value;
  }

  /**
   * Get the schemas description.
   *
   * @type {String}
   */
  get description() {
    'use strict';

    return this[sDescription];
  }

  /**
   * Set the schemas description.
   *
   * @type {String}
   */
  set description(value) {
    'use strict';

    this[sIsUpdated] = true;
    this[sDescription] = value;
  }

  /**
   * Get an array of defined field names.
   *
   * @type {Array}
   */
  get fields() {
    'use strict';

    return Object.keys(this[sFields]);
  }

  /**
   * @override
   */
  _docToEntity(doc, done) {
    'use strict';

    var me = this;
    super._docToEntity(doc, function (err) {
      if (err) {
        return done(err);
      }

      me[sFields] = doc.fields;
      done();
    });
  }

  /**
   * @override
   */
  _entityToDoc(by, done) {
    'use strict';

    var me = this;
    super._entityToDoc(by, function (err, doc) {
      if (err) {
        return done(err);
      }

      doc.fields = me[sFields];
      done(null, doc);
    });
  }

  /**
   * Determines if the field has been defined.
   *
   * @param {String} name The name of the field.
   * @return {Boolean} Returns true if the field has been defined.
   */
  hasField(name) {
    'use strict';

    return this[sFields][name] !== undefined;
  }

  /**
   * Add a new field config.
   *
   * @param {String} name The name of the field.
   * @param {String} title The admin title of the field.
   * @param {String} description The admin description of the field.
   * @param {String} type The field type, see {EntityManager.fieldTypes}.
   * @param {Object} [options={}] A set of options to pass to the field.
   * @param {String} [options.title] The UI title of the field.
   * @param {String} [options.description] The UI description of the field.
   * @param {Boolean} [options.required] Set to true if this is a required
   *   field.
   * @return {Schema} Returns self.
   * @throws {ESchemaFieldDefined} Thrown if the field has already been defined.
   * @throws {EUnknownFieldType} Thrown if the field type is unknown.
   */
  addField(name, title, description, type, options) {
    'use strict';

    var EntityManager = loader('Entity/EntityManager');

    if (this.hasField(name)) {
      throw new ESchemaFieldDefined(name);
    }

    if (EntityManager.fieldTypes[type] === undefined) {
      throw new EUnknownFieldType(name, type);
    }

    this[sIsUpdated] = true;
    this[sFields][name] = {
      type: type,
      title: title,
      description: description,
      options: options || {},
      validators: [],
      sanitizers: []
    };

    return this;
  }

  /**
   * Get the defined field.
   *
   * @param {String} name The name of the field.
   * @return {Object} The field config.
   * @throws {EUnknownSchemaField} If the field is unknown.
   */
  getField(name) {
    'use strict';

    if (this[sFields][name] === undefined) {
      throw new EUnknownSchemaField(name);
    }

    return this[sFields][name];
  }

  /**
   * Delete the specified field config.
   *
   * @param {String} name The name of the field.
   * @return {Schema} Returns self.
   * @throws {EUnknownSchemaField} If the field is unknown.
   */
  delField(name) {
    'use strict';

    if (this[sFields][name] === undefined) {
      throw new EUnknownSchemaField(name);
    }

    this[sIsUpdated] = true;
    delete this[sFields][name];

    return this;
  }

  /**
   * Add a validation rule to the given field.
   *
   * @param {String} name The field name to add this rule to.
   * @param {String} rule The validation rule.
   * @param {Object} [options={}] Any options to apply to the rule.
   * @param {Integer} [weight=0] The weight to apply to the rule.
   * @return {Schema} Returns self.
   */
  addFieldValidation(name, rule, options, weight) {
    'use strict';

    if (this[sFields][name] === undefined) {
      throw new EUnknownSchemaField(name);
    }

    if (this.manager.validators.registered(rule) === false) {
      throw new EUnknownValidator(rule);
    }

    this[sFields][name].validators.push({
      rule: rule,
      options: options || {},
      weight: weight || 0
    });

    sortBy(this[sFields][name].validators, 'weight');

    return this;
  }

  /**
   * Add a sanitization rule to the given field.
   *
   * @param {String} name The field name to add this rule to.
   * @param {String} rule The sanitization rule.
   * @param {Object} [options={}] Any options to apply to the rule.
   * @param {Integer} [weight=0] The weight to apply to the rule.
   * @return {Schema} Returns self.
   */
  addFieldSanitization(name, rule, options, weight) {
    'use strict';

    if (this[sFields][name] === undefined) {
      throw new EUnknownSchemaField(name);
    }

    if (this.manager.sanitizers.registered(rule) === false) {
      throw new EUnknownSanitizer(rule);
    }

    this[sFields][name].sanitizers.push({
      rule: rule,
      options: options || {},
      weight: weight || 0
    });

    sortBy(this[sFields][name].sanitizers, 'weight');

    return this;
  }

  /**
   * Sanitizes the given field and value.
   *
   * @param {String} name The name of the field.
   * @param {Mixed} value The value to sanitize.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Mixed} done.value The sanitized value.
   */
  sanitizeField(name, value, done) {
    'use strict';

    if (this[sFields][name] === undefined) {
      return done(new EUnknownSchemaField(name));
    }

    var orig = value,
        me = this,
        queue = [];

    function san(rule, options) {
      return function (next) {
        me.manager.sanitizers.sanitize(function (err, o, val) {
          if (err) {
            return next(err);
          }

          value = val;
          next();
        }, rule, value, options);
      };
    }

    this[sFields][name].sanitizers.forEach(function (item) {
      queue.push(san(item.rule, item.options));
    });

    async.series(queue, function (err) {
      done(err ? err : null, orig, value);
    });
  }

  /**
   * Validates the given field and value.
   *
   * @param {String} name The name of the field.
   * @param {Mixed} value The value to validate.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Mixed} done.value The validated value.
   */
  validateField(name, value, done) {
    'use strict';

    if (this[sFields][name] === undefined) {
      return done(new EUnknownSchemaField(name));
    }

    var me = this,
        queue = [];

    function val(rule, options) {
      return function (next) {
        me.manager.validators.validate(function (err, o, val) {
          if (err) {
            return next(err);
          }

          value = val;
          next();
        }, rule, value, options);
      };
    }

    this[sFields][name].validators.forEach(function (item) {
      queue.push(val(item.rule, item.options));
    });

    async.series(queue, function (err) {
      done(err ? err : null, value);
    });
  }

}
