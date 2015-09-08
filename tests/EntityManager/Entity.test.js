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

var async = require('async'),
    test = require('unit.js'),
    loader = require('nsloader'),
    Database = loader('Entity/Database'),
    Validators = loader('Entity/Validators'),
    Sanitizers = loader('Entity/Sanitizers'),
    EntityManager = loader('Entity/EntityManager'),
    Schema = loader('Entity/EntityManager/Schema'),
    Entity = loader('Entity/EntityManager/Entity'),
    EUnknownSchemaField = loader(
      'Entity/EntityManager/Errors/EUnknownSchemaField'
    );

var sFieldData = Symbol.for('Entity.fieldData'),
    database, entityManager, schema;

describe('entity/EntityManager/Entity', function () {

  'use strict';

  beforeEach(function (done) {

    database = new Database();
    database.connect('test', {
      name: 'test',
      host: '0.0.0.0'
    }, true);

    var validators = new Validators(),
        sanitizers = new Sanitizers();

    entityManager = new EntityManager(database, validators, sanitizers);

    schema = new Schema(entityManager);
    schema.machineName = 'test';
    schema
      .addField(
        'title',
        'Title',
        'A title of this entity.',
        'String',
        {
          'default': ''
        }
      )
      .addFieldSanitization('title', 'trim')
      .addField(
        'description',
        'Description',
        'A description of this entity',
        'String'
      )
      .addField('subentity', 'Sub', 'A sub entity.', 'Entity')
      .addFieldValidation('subentity', 'entity', {
        type: 'test'
      })
      .save(done);

  });

  afterEach(function (done) {

    var queue = [];

    queue.push(function (next) {
      database.collection('schemas', 'test').drop(function () {
        next();
      });
    });

    queue.push(function (next) {
      database.collection('entity-test', 'test').drop(function () {
        next();
      });
    });

    async.series(queue, function (err) {
      if (err) {
        return done(err);
      }

      database.disconnect('test');
      done();
    });

  });

  describe('Entity.constructor()', function () {

    it('shouldUseTheSchemaMachineNameAsTheEntityType', function () {

      var entity = new Entity(entityManager, schema);

      test.string(
        entity.type
      ).is('test');

    });

  });

  describe('Entity.fields', function () {});

  describe('Entity.get()', function () {

    it('shouldThrowAnErrorIfTheFieldDoesntExist', function () {

      var entity = new Entity(entityManager, schema);

      test.error(function () {
        entity.get('test');
      }).isInstanceOf(EUnknownSchemaField);

    });

    it('shouldReturnNullIfNoValueOrDefaultValue', function () {

      var entity = new Entity(entityManager, schema);

      test.value(
        entity.get('description')
      ).isNull();

    });

    it('shouldReturnTheDefaultValue', function () {

      var entity = new Entity(entityManager, schema);

      test.string(
        entity.get('title')
      ).is('');

    });

    it('shouldReturnTheSetValue', function () {

      var entity = new Entity(entityManager, schema);

      entity[sFieldData].title = 'test';

      test.string(
        entity.get('title')
      ).is('test');

    });

  });

  describe('Entity.set()', function () {

    it('shouldThrowAnErrorIfTheFieldDoesntExist', function () {

      var entity = new Entity(entityManager, schema);

      test.error(function () {
        entity.set('test', 'value');
      }).isInstanceOf(EUnknownSchemaField);

    });

    it('shouldSetTheFieldValue', function () {

      var entity = new Entity(entityManager, schema);

      entity.set('title', 'hello world');

      test.string(
        entity[sFieldData].title
      ).is('hello world');

    });

  });

  describe('Entity.save()', function () {

    it('shouldSave', function (done) {

      var entity = new Entity(entityManager, schema),
          queue = [];

      entity.machineName = 'test';
      entity
        .set('title', 'Test')
        .set('description', 'A test entity.');

      queue.push(function (next) {

        entity.save(next);

      });

      queue.push(function (next) {

        entity.collection.find(function (err, docs) {

          if (err) {
            return next(err);
          }

          test.array(
            docs
          ).hasLength(1);

          test.object(docs[0])
            .hasKey('type', 'test')
            .hasKey('machineName', 'test');

          next();

        });

      });

      queue.push(function (next) {

        entity = new Entity(entityManager, schema);
        entity.machineName = 'test';
        entity.load(next);

      });

      queue.push(function (next) {

        test.string(
          entity.machineName
        ).is('test');

        test.string(
          entity.get('title')
        ).is('Test');

        test.string(
          entity.get('description')
        ).is('A test entity.');

        next();

      });

      async.series(queue, done);

    });

    it('shouldSaveWithEntityFields', function (done) {

      var entity1, entity2,
          queue = [];

      queue.push(function (next) {

        entity1 = new Entity(entityManager, schema);
        entity1.machineName = 'test1';
        entity1
          .set('title', 'Test 1')
          .set('description', 'A test entity.');

        entity1.save(next);

      });

      queue.push(function (next) {

        entity2 = new Entity(entityManager, schema);
        entity2.machineName = 'test2';
        entity2
          .set('title', 'Test 2')
          .set('description', 'A test entity.')
          .set('subentity', entity1);

        entity2.save(next);

      });

      queue.push(function (next) {

        entity1.collection.find(function (err, docs) {

          if (err) {
            return next(err);
          }

          test.array(
            docs
          ).hasLength(2);

          test.object(docs[0])
            .hasKey('type', 'test')
            .hasKey('machineName', 'test1');

          test.object(docs[1])
            .hasKey('type', 'test')
            .hasKey('machineName', 'test2');

          test.object(
            docs[1].fieldData
          ).is({
            title: 'Test 2',
            description: 'A test entity.',
            subentity: {
              type: 'test',
              machineName: 'test1'
            }
          });

          next();

        });

      });

      queue.push(function (next) {

        entity2 = new Entity(entityManager, schema);
        entity2.machineName = 'test2';
        entity2.load(next);

      });

      queue.push(function (next) {

        test.string(
          entity2.machineName
        ).is('test2');

        test.string(
          entity2.get('title')
        ).is('Test 2');

        test.string(
          entity2.get('description')
        ).is('A test entity.');

        test.object(entity2.get('subentity'))
          .isInstanceOf(Entity)
          .hasKey('machineName', 'test1');

        next();

      });

      async.series(queue, done);

    });

  });

});
