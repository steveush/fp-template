const _ = require("lodash");
const paths = require("./paths");

/**
 * @typedef {Object} PathValuePair
 * @property {string} path - The path of the property.
 * @property {*} value - The value of the property.
 */

/**
 * Removes string keyed properties of the source object from the destination object if there values are equal.
 *
 * Note: This method mutates `object`.
 *
 * @param {Object} object - The destination object.
 * @param {Object} source - The source object.
 * @param {string} [root] - The path on the destination object to compare to the source.
 * @returns {PathValuePair[]} An array containing pruned string keyed-value pairs.
 */
const prune = (object, source, root) => {
    return _.isPlainObject(object) && _.isPlainObject(source) ? paths(source).reduce((removed, s_path) => {
        const path = _.isString(root) ? root + "." + s_path : s_path,
            value = _.get(object, path),
            def = _.get(source, s_path);

        if (_.isEqual(value, def)) {
            removed.push({path, value});
            _.unset(object, path);
        }
        return removed;
    }, []) : [];
};

module.exports = prune;