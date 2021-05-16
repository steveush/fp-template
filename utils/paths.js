const _ = require("lodash");

/**
 * Creates an array of property paths for `object`.
 *
 * @param {Object} object - The object to query.
 * @param {string[]} [pathSegments] - The base path of the object being queried.
 * @returns {string[]}
 */
const paths = (object, pathSegments) => {
    pathSegments = _.isArray(pathSegments) ? pathSegments : [];

    const segments = (key) => {
        return pathSegments.concat([key]);
    };

    const result = [];
    Object.keys(object).forEach((key) => {
        if (_.isPlainObject(object[key])){
            result.push(...paths(object[key], segments(key)))
        } else {
            result.push(segments(key).join("."));
        }
    });
    return result;
};

module.exports = paths;