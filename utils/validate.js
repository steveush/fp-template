const _ = require("lodash");
const c = require("chalk");

const isPerson = (value) => {
    return _.isString(value) || (_.isPlainObject(value) && _.isString(value.name));
};

const isRequiredObject = (value) => {
    return _.isPlainObject(value) && _.isString(value.name) && _.isFunction(value.validate);
};

const msgRequired = (name) => {
    return c.red("Required '" + c.yellow(name) + "' property missing.");
};

const msgInvalid = (name, expected, received) => {
    return c.red("Invalid '" + c.yellow(name) + "' property value. Expected '" + c.yellow(expected) + "' but received '" + c.yellow(received) + "'.");
};

const VALIDATE_DEFAULTS = {
    "name": null,
    "validate": _.isString,
    "required": msgRequired,
    "invalid": msgInvalid,
    "expected": "string"
};

const validate = (pkgObj, required) => {
    const errors = [];
    required.forEach((req) => {
        let opt = {};
        if (_.isString(req)){
            opt = _.defaults({"name": req}, VALIDATE_DEFAULTS);
        } else if (_.isObject(req)){
            opt = _.defaults({}, req, VALIDATE_DEFAULTS);
        }
        if (isRequiredObject(opt)) {
            const exists = _.has(pkgObj, opt.name);
            if (!exists){
                errors.push(opt.required(opt.name));
            } else if (exists){
                const value = _.get(pkgObj, opt.name);
                if (!opt.validate(value)){
                    errors.push(opt.invalid(opt.name, opt.expected, typeof value));
                }
            }
        }
    });
    return errors;
};

validate.PACKAGE = ["name","version"];
validate.TEMPLATE = [
    "name",
    "version",
    "title",
    "description",
    "bugs",
    "license",
    {
        "name": "author",
        "validate": isPerson,
        "expected": "string|object"
    },
    "config.slug",
    "config.namespace"
];

module.exports = validate;