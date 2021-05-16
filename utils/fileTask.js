const _ = require("lodash");
const path = require( 'path' );
const merge = require( 'merge-stream' );
const plumber = require( 'gulp-plumber' );

const FILE_TASK_DEFAULTS = {
    allowEmpty: true,
    process: function(src) {
        return src;
    }
};

/**
 * A wrapper to make supplying the configuration for file specific gulp tasks such as sass or babel a bit simpler.
 *
 * This wrapper allows the gulpfile.config.js file to contain configuration entries like the following:
 *
 * {
 *     // use the default options to output a single file
 *     "TASK_NAME": {
 *         "dest_file.txt": "src_file.txt"
 *     },
 *     "TASK_NAME_2": {
 *         "dest_file_2.txt": ["src_file_1.txt", "src_file_2.txt"]
 *     },
 *
 *     // use the default options to output multiple files
 *     "TASK_NAME": {
 *         "dest_file.txt": "src_file.txt",
 *         "dest_file_2.txt": "src_file_2.txt"
 *     },
 *     "TASK_NAME": {
 *         "dest_file.txt": ["src_file_1.txt", "src_file_2.txt"],
 *         "dest_file_2.txt": ["src_file_3.txt", "src_file_4.txt"]
 *     },
 *
 *     // supply custom options
 *     "TASK_NAME_2": {
 *         "options": {},
 *         "files":
 *         "dest_file_2.txt": ["src_file_1.txt", "src_file_2.txt"]
 *     }
 * }
 *
 * @param gulp
 * @param name
 * @param config
 * @param defaults
 * @param done
 * @returns {*}
 */
const fileTask = (gulp, name, config, defaults, done) => {
    // no configuration supplied for the task so do nothing
    if (!_.isPlainObject(config[name])) return done();
    const cfg = fileTask.config(config[name], defaults),
        fileNames = Object.keys(cfg.files);

    // if we have no files exit early
    if ( fileNames.length === 0 ) return done();

    let tasks = fileNames.map(function(fileName){
        // get the file specific task options and files
        const task = fileTask.config(cfg.files[fileName], cfg.options),
            file = {
                path: fileName,
                dir: path.dirname(fileName),
                name: path.basename(fileName)
            },
            src = gulp.src(task.files, {allowEmpty: task.options.allowEmpty})
                .pipe( plumber() );
        return task.options.process( src, file, task.options, task.files );
    });

    // merge all the tasks into a single return value
    return merge( tasks );
};

fileTask.config = (config, defaults) => {
    const isObj = _.isPlainObject(config);
    let options;
    if (isObj && _.has(config, "options")){
        options = _.defaults({}, config.options, defaults, FILE_TASK_DEFAULTS);
    } else {
        options = _.defaults({}, defaults, FILE_TASK_DEFAULTS);
    }
    let files = isObj && _.has(config, "files") ? config.files : config;
    return { options, files };
};

module.exports = fileTask;