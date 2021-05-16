const child_exec = require('child_process').exec;

/**
 * Returns a promise that is fulfilled once the command has finished executing.
 *
 * @param {string} command - The command to run, with space-separated arguments.
 * @param {Object} [options] - The options to execute the command with.
 * @returns {Promise<Object>} A promise that is fulfilled once the command has been executed.
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
 */
const exec = (command, options) => {
    return new Promise((resolve, reject) => {
        child_exec(command, options, function(err, stdout, stderr){
            if (err){
                err.stdout = stdout;
                err.stderr = stderr;
                reject(err);
            } else {
                resolve({stdout, stderr});
            }
        });
    });
};

module.exports = exec;