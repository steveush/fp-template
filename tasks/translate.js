const u = require("../utils");
const wpPot = require( 'gulp-wp-pot' );
const sort = require( 'gulp-sort' );

module.exports = (gulp, name, config) => {
    return gulp.task(name, (done) => {
        return u.fileTask(gulp, name, config, {
            allowEmpty: true,
            process: (src, file, opt) => {
                return src.pipe( sort() )
                    .pipe( wpPot(opt) )
                    .pipe( gulp.dest( file.path ) );
            }
        }, done);
    });
};