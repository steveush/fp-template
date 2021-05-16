const u = require("../utils");
const imagemin = require( 'gulp-imagemin' );

module.exports = (gulp, name, config) => {
    return gulp.task(name, (done) => {
        return u.fileTask(gulp, name, config, {
            allowEmpty: true,
            plugins: [
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 3 }), // 0-7 low-high.
                imagemin.svgo({
                    plugins: [ { removeViewBox: true }, { cleanupIDs: false } ]
                })
            ],
            process: (src, file, opt) => {
                return src
                    .pipe( imagemin( opt.plugins, { silent: true } ) )
                    .pipe( gulp.dest( file.path ) );
            }
        }, done);
    });
};