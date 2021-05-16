const _ = require("lodash");

/**
 * A very basic process.env.argv parser that returns an object containing key value pairs.
 *
 * Flag arguments like --verbose are simply set as boolean properties on the result.
 *
 * @template T
 * @param {T} defaults - An object containing the default values to return if an arg is not supplied via the command line.
 * @returns {T} Returns a merged object containing the default values overwritten with any supplied via the command line.
 */
const processArgs = (defaults) => {
    const args = process.argv.slice(2);
    const parsed = args.reduce((obj, arg) => {
        if (/^[-]{1,2}\w/.test(arg)){
            let name = arg.replace(/^[-]{1,2}/, ""),
                value = true,
                eq = name.indexOf("=");
            if (eq !== -1){
                value = name.slice(eq + 1);
                name = name.slice(0, eq);
            }
            obj[name] = value;
        }
        return obj;
    }, {});
    return _.defaults(parsed, defaults);
};

module.exports = processArgs;