const _ = require( 'lodash' );

module.exports = (gulp, name, config) => {
    return gulp.task(name, (done) => {
        const cfg = config[name];
        // no configuration supplied for the task so do nothing
        if (!_.isPlainObject(cfg)) return done();
        let keys = Object.keys(cfg);
        keys.forEach((key) => {
            if (_.has(config, key)){
                gulp.watch( cfg[key], gulp.parallel( key ) );
            }
        });
        done();
    });
};