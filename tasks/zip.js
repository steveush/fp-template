const u = require("../utils");
const zip = require( 'gulp-zip' );

module.exports = (gulp, name, config) => {
    return gulp.task(name, (done) => {
        return u.fileTask(gulp, name, config, {
            process: (src, file) => {
                return src.pipe( zip( file.name ) )
                    .pipe( gulp.dest( file.dir ) );
            }
        }, done);
    });
};