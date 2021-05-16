const u = require("../utils");
const _ = require( 'lodash' );

const errored = (result) => result.status === "rejected";

/**
 * Runs the wp-scripts build command as part of a gulp process.
 *
 * @param gulp
 * @param name
 * @param config
 * @returns {*}
 */
module.exports = (gulp, name, config) => {
    return gulp.task(name, (done) => {
        const cfg = config[name], commands = [];
        if (_.isString(cfg)){
            commands.push(cfg);
        } else if (_.isArray(cfg)){
            commands.push.apply(commands, cfg);
        }
        if (commands.length === 0) return done();
        const promises = commands.map((command) => {
            return u.exec("wp-scripts build " + command);
        });
        Promise.allSettled(promises).then((results) => {
            if (results.some(errored)){
                console.log("One or more blocks failed to build.");
                results.filter(errored).forEach((result) => {
                    console.log(result.reason.stderr);
                });
            }
            done();
        });
    });
};