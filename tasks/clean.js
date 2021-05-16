const _ = require( 'lodash' );
const del = require("del");

module.exports = (gulp, name, config) => {
    return gulp.task(name, (done) => {
        if (!_.isString(config[name]) && !_.isArray(config[name])) return done();
        return del(config[name], {"force": true});
    });
};