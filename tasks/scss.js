const u = require("../utils");
const browserslist = require( '@wordpress/browserslist-config' );
const path = require( 'path' );
const rename = require( 'gulp-rename' );
const lineEndingCorrector = require( 'gulp-line-ending-corrector' );
const filter = require( 'gulp-filter' );
const sourcemaps = require( 'gulp-sourcemaps' );
const sass = require( 'gulp-sass' );
const uglifycss = require( 'gulp-uglifycss' );
const autoprefixer = require( 'gulp-autoprefixer' );
const mmq = require( 'gulp-merge-media-queries' );

module.exports = (gulp, name, config) => {
    return gulp.task(name, (done) => {
        return u.fileTask(gulp, name, config, {
            allowEmpty: true,
            sass: {
                outputStyle: "compact",
                precision: 10
            },
            process: (src, file, opt) => {
                let basename = path.basename(file.path, ".css");
                return src
                    .pipe( rename({ basename: basename }) )
                    .pipe( sourcemaps.init() )
                    .pipe( sass(opt.sass) ).on( 'error', sass.logError )
                    .pipe( sourcemaps.write({ includeContent: false }) )
                    .pipe( sourcemaps.init({ loadMaps: true }) )
                    .pipe( autoprefixer( browserslist ) )
                    .pipe( sourcemaps.write( './maps' ) )
                    .pipe( lineEndingCorrector() ) // Consistent Line Endings for non UNIX systems.
                    .pipe( gulp.dest( file.dir ) )
                    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files.
                    .pipe( mmq({ log: false }) ) // Merge Media Queries only for .min.css version.
                    .pipe( rename({ basename: basename, suffix: ".min" }) )
                    .pipe( uglifycss({ maxLineLen: 10 }) )
                    .pipe( lineEndingCorrector() ) // Consistent Line Endings for non UNIX systems.
                    .pipe( gulp.dest( file.dir ) )
                    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files.;
            }
        }, done);
    });
};