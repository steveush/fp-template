const tmpl = require("../template");

const remove = (pkg, options) => {
    return tmpl.removeFiles( pkg, options ).then(() => {
        return tmpl.removePackage( pkg, options ).then(() => {
            return tmpl.uninstallDependencies( pkg, options );
        });
    });
};

module.exports = remove;