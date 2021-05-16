const u = require("../utils");
const rename = require( 'gulp-rename' );
const replace = require( 'gulp-string-replace' );

module.exports = (gulp, name, config) => {
    return gulp.task(name, (done) => {
        return u.fileTask(gulp, name, config, {
            allowEmpty: true,
            match: null,
            replacement: null,
            logging: false,
            process: (src, file, opt) => {
                if (opt.match !== null && opt.replacement !== null){
                    return src.pipe( replace(opt.match, opt.replacement, { logs: { enabled: opt.logging } }) )
                        .pipe( rename(file.name) )
                        .pipe( gulp.dest(file.dir) );
                }
                return src.pipe( rename(file.name) )
                    .pipe( gulp.dest(file.dir) );
            }
        }, done);
    });
};