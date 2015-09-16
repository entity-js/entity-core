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
    Connection = loader('Entity/Database/Connection'),
    EDefinedConnection = loader(
      'Entity/Database/Errors/EDefinedConnection'
    ),
    EUndefinedConnection = loader(
      'Entity/Database/Errors/EUndefinedConnection'
    );

var database = null;

describe('entity/Database', function () {

  'use strict';

  afterEach(function (done) {

    var queue = [],
        connections = database ? database.connections : [];

    function clearAndDrop(name) {
      return function (next) {
        console.info('DROP CONNECTION', name);
        database.collection('test', name).drop(function () {
          database.disconnect(name);
          console.info('DROPPED');
          next();
        });
      };
    }

    for (var i = 0, len = connections.length; i < len; i++) {
      queue.push(clearAndDrop(connections[i]));
    }

    async.series(queue, done);

  });

  describe('Database.connect()', function () {

    it('shouldConnectAndMakeDefault', function () {

      database = new Database();
      database.connect('default', {
        name: 'test'
      });

      test.string(
        database.defaultConnection
      ).is('default');

    });

    it('shouldThrowAnErrorIfConnectionExists', function () {

      database = new Database();
      database.connect('default', {
        name: 'test'
      });

      test.error(function () {
        database.connect('default', {
          name: 'test'
        });
      }).isInstanceOf(EDefinedConnection);

    });

  });

  describe('Database.disconnect()', function () {

    it('shouldThrowAnErrorIfConnectionsUndefined', function () {

      var database = new Database();
      test.exception(function () {

        database.disconnect('test');

      }).isInstanceOf(EUndefinedConnection);

    });

    it('shouldDisconnectDefinedConnection', function () {

      var database = new Database();
      database.connect('test', {
        name: 'test'
      });

      database.disconnect('test');

      test.error(function () {
        database.connection('test');
      }).isInstanceOf(EUndefinedConnection);

    });

    it('shouldDisconnectDefaultConnection', function () {

      var database = new Database();
      database.connect('test', {
        name: 'test'
      });

      database.connect('test2', {
        name: 'test2'
      });

      database.disconnect();

      test.error(function () {
        database.connection('test');
      }).isInstanceOf(EUndefinedConnection);

      test.object(
        database.connection('test2')
      ).isInstanceOf(Connection);

    });

  });

  describe('Database.collection()', function () {

    it('shouldThrowAnErrorIfConnectionsUndefined', function () {

      var database = new Database();
      test.exception(function () {
        database.collection('test');
      }).isInstanceOf(EUndefinedConnection);

    });

    it('shouldReturnCollectionObject', function () {

      var database = new Database();
      database.connect('test', {
        name: 'test'
      });

      test.object(
        database.collection('test')
      );

    });

  });

  describe('Database.connection()', function () {

    it('shouldThrowAnErrorIfConnectionsUndefined', function () {

      var database = new Database();
      test.error(function () {
        database.connection('test');
      }).isInstanceOf(EUndefinedConnection);

    });

    it('shouldReturnConnectionObjectIfExists', function () {

      var database = new Database();
      database.connect('test', {
        name: 'test'
      });

      test.object(
        database.connection('test')
      ).isInstanceOf(Connection);

    });

  });

  describe('Database.connections', function () {

    it('shouldReturnAnArrayOfConnectionNames', function () {

      var database = new Database();
      database.connect('default', {
        name: 'test'
      });

      database.connect('test', {
        name: 'test'
      });

      test.array(
        database.connections
      ).hasLength(2).is(['default', 'test']);

    });

  });

  describe('Database.defaultConnection', function () {

    it('shouldReturnUndefinedIfNotSet', function () {

      var database = new Database();
      test.string(
        database.defaultConnection
      ).is('');

    });

    it('shouldReturnTheNameOfTheDefaultConnection', function () {

      var database = new Database();
      database.connect('default', {
        name: 'test'
      });

      database.connect('test', {
        name: 'test'
      }, true);

      database.connect('test2', {
        name: 'test'
      });

      test.string(
        database.defaultConnection
      ).is('test');

    });

    it('shouldSetTheDefault', function () {

      var database = new Database();
      database.connect('default', {
        name: 'test'
      });

      database.connect('test', {
        name: 'test'
      });

      test.string(
        database.defaultConnection
      ).is('default');

      database.defaultConnection = 'test';

      test.string(
        database.defaultConnection
      ).is('test');

    });

  });

});
