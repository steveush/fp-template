const tmpl = require("../template");

const clean = (pkg, options) => {
    return tmpl.removeFiles( pkg, options ).then(() => {
        return tmpl.cleanPackage( pkg, options );
    });
};

module.exports = clean;