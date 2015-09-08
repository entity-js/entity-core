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
 * Provides the URL address validator rule.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EInvalidURL = loader('Entity/Validators/Errors/EInvalidURL');

/**
 * Validate URL address.
 *
 * @param {Mixed} value The value to validate.
 * @param {Object} options The options passed to the validator.
 * @param {Function} next The next callback.
 * @param {Error} next.err Any raised errors.
 * @throws {EInvalidUrl} Thrown if the value is an invalid url address.
 */
export default function validateUrl (value, options, next) {
  'use strict';

  var rx = new RegExp(
    '^' +
    // protocol identifier
    '(?:(?:https?|ftp)://)' +
    // user:pass authentication
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
    // IP address exclusion
    // private & local networks
    '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
    '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
    '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
    // host name
    '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
    // domain name
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
    // TLD identifier
    '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
    ')' +
    // port number
    '(?::\\d{2,5})?' +
    // resource path
    '(?:/\\S*)?' +
    '$', 'i');

  if (!rx.test(value)) {
    return next(new EInvalidURL(value));
  }

  next();
}
