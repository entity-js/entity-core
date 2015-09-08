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
 * Provides the Sort By functionality.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

/**
 * Sort an array object.
 *
 * @param {Array} item The item to sort.
 * @param {String} key The key to use for sorting.
 * @param {Boolean} [reverse=false] - Reverse the order.
 */
function arraySortBy (item, key, reverse) {
  'use strict';

  item.sort(function (a, b) {
    var aw = a[key] !== undefined ? (
          typeof a[key] === 'function' ?
            parseInt(a[key](), 10) :
            parseInt(a[key], 10)
        ) : 0,
        bw = b[key] !== undefined ? (
          typeof b[key] === 'function' ?
            parseInt(b[key](), 10) :
            parseInt(b[key], 10)
        ) : 0;

    if (aw === bw) {
      return 0;
    }

    return reverse !== true && aw < bw ? -1 : 1;
  });
}

/**
 * Sort an object.
 *
 * @param {Object} item The item to sort.
 * @param {String} key The key to use for sorting.
 * @param {Boolean} [reverse=false] Reverse the order.
 */
function objectSortBy(item, key, reverse) {
  'use strict';

  var keys = [];
  for (var k in item) {
    if (typeof item[k] === 'function') {
      continue;
    }

    keys.push({key: k, value: item[k]});
    delete item[k];
  }

  keys.sort(function (a, b) {
    var aw = a.value[key] !== undefined ? parseInt(a.value[key], 10) : 0,
        bw = b.value[key] !== undefined ? parseInt(b.value[key], 10) : 0;

    if (aw === bw) {
      return 0;
    }

    return reverse !== true && aw < bw ? -1 : 1;
  });

  keys.forEach(function (value) {
    item[value.key] = value.value;
  });
}

/**
 * Sort an array or object by a defined key.
 *
 * @param {Array|Object} item The item to sort.
 * @param {String} key The key to sort by.
 * @param {Boolean} [reverse=false] Reverse the order.
 */
export default function sortBy (item, key, reverse) {
  'use strict';

  if (item instanceof Array && item.length !== undefined) {
    arraySortBy(item, key, reverse);
  } else {
    objectSortBy(item, key, reverse);
  }
}
