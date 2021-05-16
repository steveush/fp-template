const tmpl = require("../template");

const create = (pkg, options) => {
    return tmpl.createFiles( pkg, options ).then(() => {
        return tmpl.createPackage( pkg, options );
    });
};

module.exports = create;