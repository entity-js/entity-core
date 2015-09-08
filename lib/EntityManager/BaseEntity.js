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
 * Provides the BaseEntity class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var async = require('async'),
    loader = require('nsloader'),
    EMissingMachineName = loader(
      'Entity/EntityManager/Errors/EMissingMachineName'
    ),
    EMachineNameExists = loader(
      'Entity/EntityManager/Errors/EMachineNameExists'
    ),
    ECantFindEntity = loader(
      'Entity/EntityManager/Errors/ECantFindEntity'
    );

var sMachineName = Symbol('BaseEntity.machineName'),
    sCreatedOn = Symbol('BaseEntity.createdOn'),
    sCreatedBy = Symbol('BaseEntity.createdBy'),
    sUpdatedOn = Symbol('BaseEntity.updatedOn'),
    sUpdatedBy = Symbol('BaseEntity.updatedBy'),
    sManager = Symbol('BaseEntity.manager'),
    sIsNew = Symbol.for('BaseEntity.isNew'),
    sIsUpdated = Symbol.for('BaseEntity.isUpdated'),
    sIsTrashed = Symbol.for('BaseEntity.isTrashed'),
    sIsRenaming = Symbol.for('BaseEntity.isRenaming'),
    sId = Symbol('BaseEntity.id');

/**
 * The base entity class.
 */
export default class BaseEntity {

  /**
   * The base entity constructor.
   *
   * @param {EntityManager} manager The entity manager.
   */
  constructor(manager) {
    'use strict';

    this[sManager] = manager;

    this[sMachineName] = null;
    this[sId] = null;
    this[sIsNew] = true;
    this[sIsUpdated] = false;
    this[sIsTrashed] = false;
    this[sIsRenaming] = false;

    var on = Date.now();
    this[sCreatedOn] = on;
    this[sCreatedBy] = null;
    this[sUpdatedOn] = on;
    this[sUpdatedBy] = null;
  }

  /**
   * Get the database collection name.
   *
   * @return {String} The collection name.
   */
  collectionName() {
    'use strict';

    throw new Error(); // @todo
  }

  /**
   * Get the entity manager.
   *
   * @type {EntityManager}
   */
  get manager() {
    'use strict';

    return this[sManager];
  }

  /**
   * Get the database collection.
   *
   * @type {MongoDB#Collection}
   */
  get collection() {
    'use strict';

    var collectionName = this.collectionName();
    return this[sManager].database.collection(collectionName);
  }

  /**
   * Determine if this is new.
   *
   * @type {Boolean}
   */
  get isNew() {
    'use strict';

    return this[sIsNew];
  }

  /**
   * Determine if this has been updated but not yet saved.
   *
   * @type {Boolean}
   */
  get isUpdated() {
    'use strict';

    return this[sIsUpdated];
  }

  /**
   * Determine if this has been trashed (ie. in the trash can).
   *
   * @type {Boolean}
   */
  get isTrashed() {
    'use strict';

    return this[sIsTrashed];
  }

  /**
   * Determine if this will be renamed upon saving.
   *
   * @type {Boolean}
   */
  get isRenaming() {
    'use strict';

    return this[sIsRenaming];
  }

  /**
   * Get the MongoDB document ID.
   *
   * @type {String}
   */
  get id() {
    'use strict';

    return this[sId];
  }

  /**
   * Get the machine name.
   *
   * @type {String}
   */
  get machineName() {
    'use strict';

    return this[sMachineName];
  }

  /**
   * Set the machine name.
   *
   * @type {String}
   */
  set machineName(value) {
    'use strict';

    if (this[sMachineName] !== value) {
      this[sIsUpdated] = true;
      this[sMachineName] = value;
    }
  }

  /**
   * When this was created.
   *
   * @type {Date}
   */
  get createdOn() {
    'use strict';

    return this[sCreatedOn];
  }

  /**
   * Who created this.
   *
   * @type {String}
   */
  get createdBy() {
    'use strict';

    return this[sCreatedBy];
  }

  /**
   * When this was updated.
   *
   * @type {Date}
   */
  get updatedOn() {
    'use strict';

    return this[sUpdatedOn];
  }

  /**
   * Who updated this.
   *
   * @type {String}
   */
  get updatedBy() {
    'use strict';

    return this[sUpdatedBy];
  }

  /**
   * Set the base entity values from a loaded doc object.
   *
   * @param {Object} doc The MongoDB document.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @private
   */
  _docToEntity(doc, done) {
    'use strict';

    this[sId] = doc._id;
    this[sMachineName] = doc.machineName;
    this[sCreatedOn] = doc.createdOn;
    this[sCreatedBy] = doc.createdBy;
    this[sUpdatedOn] = doc.updatedOn;
    this[sUpdatedBy] = doc.updatedBy;

    done();
  }

  /**
   * Create a MongoDB document from this base entity.
   *
   * @param {String} [by='system'] Who/What is performing this action.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Object} done.doc A generated MongoDB document.
   * @private
   */
  _entityToDoc(by, done) {
    'use strict';

    var doc = {},
        on = Date.now();

    by = by || 'system';

    if (this[sId]) {
      doc._id = this[sId];
    }

    doc.machineName = this[sMachineName];
    doc.createdOn = this[sCreatedOn] || on;
    doc.createdBy = this[sCreatedBy] || by;
    doc.updatedOn = on;
    doc.updatedBy = by;

    done(null, doc);
  }

  /**
   * Private helper to set the entity from a doc and set other properties.
   *
   * @param {Object} doc The MongoDB document.
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @private
   */
  _setDoc(doc, done) {
    'use strict';

    this[sIsNew] = false;
    this[sIsUpdated] = false;
    this._docToEntity(doc, done);
  }

  /**
   * Sanitizes the values prior to saving.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @private
   */
  _sanitize(done) {
    'use strict';

    var me = this;
    this[sManager].sanitizers.sanitize(function (err, orig, value) {
      if (err) {
        return done(err);
      }

      me[sMachineName] = value;
      done();
    }, 'trim', this[sMachineName]);
  }

  /**
   * Validates the properties of this base entity before saving.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  validate(done) {
    'use strict';

    if (!this[sMachineName] || this[sMachineName] === '') {
      return done(new EMissingMachineName());
    }

    this[sManager].validators.validate(function (err) {
      done(err);
    }, 'machine-name', this[sMachineName]);
  }

  /**
   * Save the entity to the database.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {String} [by='system'] Who is saving the entity.
   */
  save(done, by) {
    'use strict';

    var me = this,
        doc,
        queue = [];

    queue.push(function (next) {
      me._sanitize(next);
    });

    queue.push(function (next) {
      me.validate(next);
    });

    queue.push(function (next) {
      me._entityToDoc(by, function (err, d) {
        if (err) {
          return next(err);
        }

        doc = d;
        next();
      });
    });

    queue.push(function (next) {
      me.collection.count({
        machineName: me[sMachineName]
      }, function (err, count) {
        if (err) {
          return next(err);
        }

        next(count > 0 ? new EMachineNameExists(me[sMachineName]) : null);
      });
    });

    queue.push(function (next) {
      me.collection.save(doc, function (err, d) {
        if (err) {
          return next(err);
        }

        doc = d;
        next();
      });
    });

    if (this[sIsTrashed]) {
      queue.push(function (next) {
        me[sManager].trashCollection.remove({
          machineName: me[sMachineName]
        }, function (err) {
          if (err) {
            return next(err);
          }

          me[sIsTrashed] = false;
          next();
        });
      });
    }

    async.series(queue, function (err) {
      if (err) {
        return done(err);
      }

      me[sIsRenaming] = false;
      me[sIsNew] = false;
      me[sIsUpdated] = false;
      me[sId] = doc._id;

      done(null);
    });
  }

  /**
   * Load the base entity from the database.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @param {Object} [conditions] Any conditions for loading, if not provided
   *   then the machine name is used (if available).
   * @throws {Error} Thrown if the conditions is empty and a machine name is not
   *   available.
   */
  load(done, machineName) {
    'use strict';

    machineName = machineName || this[sMachineName];
    if (!machineName) {
      return done(new EMissingMachineName());
    }

    var me = this,
        doc = null,
        queue = [];

    queue.push(function (next) {
      me.collection.findOne({
        machineName: machineName
      }, function (err, d) {
        if (err) {
          return next(err);
        }

        doc = d || null;
        next();
      });
    });

    queue.push(function (next) {
      if (doc) {
        return next();
      }

      me[sManager].trashCollection.findOne({
        collection: me.collectionName(),
        machineName: machineName
      }, function (err, d) {
        if (err) {
          return next(err);
        }

        doc = d || null;
        me[sIsTrashed] = doc !== null;

        next();
      });
    });

    queue.push(function (next) {
      if (!doc) {
        return next(new ECantFindEntity(me.collectionName(), machineName));
      }

      me._setDoc(doc, next);
    });

    async.series(queue, function (err) {
      done(err ? err : null);
    });
  }

  /**
   * Trash or delete the entity.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   * @parma {String] [by='system'] Who is deleting the entity.
   * @param {Boolean} [permanently=false] Set to true to not trash but to
   *   permanently delete the entity.
   */
  delete(done, by, permanently) {
    'use strict';

    if (!this[sMachineName]) {
      return done(new EMissingMachineName());
    }

    var me = this,
        trashed = this[sIsTrashed] === true,
        queue = [];

    permanently = trashed ? true : permanently || false;
    if (permanently !== true) {
      var doc = null;

      if (this[sIsNew] || this[sIsUpdated]) {
        queue.push(function (next) {
          me.load(next);
        });
      }

      queue.push(function (next) {
        me._entityToDoc(by, function (err, d) {
          if (err) {
            return next(err);
          }

          delete d._id;
          delete d.machineName;

          doc = {
            collection: me.collectionName(),
            machineName: me[sMachineName],
            doc: d
          };

          next();
        });
      });

      queue.push(function (next) {
        me[sManager].trashCollection.save(doc, function (err, d) {
          if (err) {
            return next(err);
          }

          me[sIsTrashed] = true;
          me[sId] = d._id;

          next(null);
        });
      });
    }

    if (trashed === true) {
      queue.push(function (next) {
        me[sManager].trashCollection.remove({
          collection: me.collectionName(),
          machineName: me[sMachineName]
        }, next);
      });
    } else {
      queue.push(function (next) {
        me.collection.remove({
          machineName: me[sMachineName]
        }, next);
      });
    }

    async.series(queue, function (err) {
      done(err ? err : null);
    });
  }

}
