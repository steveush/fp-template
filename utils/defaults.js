const _ = require("lodash");
const paths = require("./paths");

/**
 * @typedef {Object} PathValuePair
 * @property {string} path - The path of the property.
 * @property {*} value - The value of the property.
 */

/**
 * Adds string keyed properties of the source object to the destination object. Once a property is set, additional values of the same property are ignored.
 *
 * Note: This method mutates `object`.
 *
 * @param {Object} object - The destination object.
 * @param {Object} source - The source object.
 * @param {string} [root] - The path on the destination object to add properties to.
 * @returns {PathValuePair[]} An array containing added string keyed-value pairs.
 */
const defaults = (object, source, root) => {
    return _.isPlainObject(object) && _.isPlainObject(source) ? paths(source).reduce((added, s_path) => {
        const path = _.isString(root) ? root + "." + s_path : s_path;
        if (!_.has(object, path)) {
            const value = _.get(source, s_path);
            added.push({path, value});
            _.set(object, path, value);
        }
        return added;
    }, []) : [];
};

module.exports = defaults;