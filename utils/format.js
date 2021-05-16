const _ = require("lodash");

/**
 * Formats the supplied `target` using `values` that match the `placeholders` regular expression.
 *
 * NOTE: If supplied an object this method will format both property values and keys.
 *
 * @template T {string|Object|Array}
 * @param {T} target - The target to format.
 * @param {Object} values - An object containing the values to substitute placeholders for.
 * @param {RegExp} [placeholder] - The regular expression used to match a placeholder. If not supplied this method will by default match the `<%=NAME%>` placeholder syntax.
 * @returns {T} A formatted instance of the `target` supplied.
 */
const format = (target, values, placeholder) => {
    let result = target;
    if (_.isString(target)){
        if (!(placeholder instanceof RegExp)){
            placeholder = format.PH_APE;
        }
        if (placeholder.test(target)){
            result = target.replace(placeholder, (match, prop) => {
                return _.get(values, prop, match);
            });
        }
    } else if (_.isArray(target)){
        result = [];
        target.forEach((element) => {
            result.push(format(element, values, placeholder));
        });
    } else if (_.isPlainObject(target)){
        result = {};
        Object.keys(target).forEach((key) => {
            const f_key = format(key, values, placeholder);
            result[f_key] = format(target[key], values, placeholder);
        });
    }
    return result;
};

/**
 * Specifies the placeholders match an angle, percent, equals format. i.e. &lt;%= NAME %&gt;
 *
 * @type {RegExp}
 * @default /<%=\s?([^%]*?)\s?%>/g
 */
format.PH_APE = /<%=\s?([^%]*?)\s?%>/g;

/**
 * Specifies the placeholders match a bracket, dollar format. i.e. {$NAME}
 *
 * @type {RegExp}
 * @default /{\$\s?([^}]*?)\s?}/g
 */
format.PH_BD = /{\$\s?([^}]*?)\s?}/g;

module.exports = format;