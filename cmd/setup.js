const tmpl = require("../template");

const setup = (pkg, options) => {
    return tmpl.setupPackage( pkg, options ).then(() => {
        return tmpl.installDependencies( pkg, options );
    });
};

module.exports = setup;