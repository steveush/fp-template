const u = require("../utils");
const browserslist = require( '@wordpress/browserslist-config' );
const path = require( 'path' );
const rename = require( 'gulp-rename' );
const lineEndingCorrector = require( 'gulp-line-ending-corrector' );
const concat = require( 'gulp-concat' );
const uglify = require( 'gulp-uglify' );
const babel = require( 'gulp-babel' );
const order = require( 'gulp-order' );

module.exports = (gulp, name, config) => {
    return gulp.task(name, (done) => {
        return u.fileTask(gulp, name, config, {
            allowEmpty: true,
            babel: {
                presets: [
                    [
                        '@babel/preset-env', // Preset to compile your modern JS to ES5.
                        {
                            targets: {browsers: browserslist} // Target browser list to support.
                        }
                    ]
                ],
                ignore: ["./src/polyfills"]
            },
            order: {
                base: './'
            },
            process: (src, file, opt, files) => {
                let basename = path.basename(file.path, ".js"),
                    baseRegex = new RegExp('^' + opt.order.base),
                    ordered = files.map(function(file){
                        return file.replace(baseRegex, '');
                    });
                return src
                    .pipe(babel(opt.babel))
                    .pipe(order(ordered, opt.order))
                    .pipe(concat(file.name))
                    .pipe(lineEndingCorrector()) // Consistent Line Endings for non UNIX systems.
                    .pipe(gulp.dest(file.dir))
                    .pipe(
                        rename({
                            basename: basename,
                            suffix: ".min"
                        })
                    )
                    .pipe(uglify())
                    .pipe(lineEndingCorrector()) // Consistent Line Endings for non UNIX systems.
                    .pipe(gulp.dest(file.dir));
            }
        }, done);
    });
};