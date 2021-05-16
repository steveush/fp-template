const _ = require("lodash");
const c = require( 'chalk' );

/**
 * A simple wrapper around `console.log()` that adds a timestamp to each entry.
 * @param {...*} [args] - Any number of arguments to supply to `console.log()`.
 */
const log = (...args) => {
    console.log(log.timestamp(), ...args);
};

/**
 * Generates a timestamp that is used within the `log` method.
 * @returns {string} A timestamp value in the following format: [HH:mm:ss]
 */
log.timestamp = () => {
    const now = new Date(),
        hours = _.padStart(String(now.getHours()), 2, "0"),
        minutes = _.padStart(String(now.getMinutes()), 2, "0"),
        seconds = _.padStart(String(now.getSeconds()), 2, "0"),
        time = hours + ":" + minutes + ":" + seconds;
    return c.white("[" + c.gray(time) + "]");
};

/**
 * Given a millisecond value this returns a human friendly small time string.
 * @param {number} milliseconds - The milliseconds to display as a friendly time string.
 * @returns {string} A human friendly time string.
 */
log.time = (milliseconds) => {
    if (milliseconds >= 1000){
        const seconds = milliseconds/1000;
        return seconds.toFixed(2) + " s";
    }
    return `${milliseconds} ms`;
};

const __started = new Map();

/**
 * Used to log and record the execution start of one of the CLI commands.
 * @param {string} command - The command being executed.
 * @param {...*} [args] - Any number of additional arguments to supply to `console.log()`.
 */
log.started = (command, ...args) => {
    __started.set(command, Date.now());
    log(c.white("Starting '" + c.cyan(command) + "'..."), ...args);
};

/**
 * Used to log and report the execution end of one of the CLI commands.
 * @param {string} command - The command that was executed.
 * @param {...*} [args] - Any number of additional arguments to supply to `console.log()`.
 */
log.finished = (command, ...args) => {
    let text = c.white("Finished '" + c.cyan(command) + "'");
    if (__started.has(command)){
        const diff = Date.now() - __started.get(command);
        text += c.white(" after ") + c.magenta(log.time(diff));
        __started.delete(command);
    }
    log(text, ...args);
};

const __output = c.cyan(">");
/**
 * Used to log a message that is the output of another action.
 * @param {...*} [args] - Any number of arguments to supply to `console.log()`.
 */
log.output = (...args) => {
    log(__output, ...args);
};

log.async = (message) => {
    const spinner = ["\\", "|", "/", "-"];
    let x = 0, done = false;
    const msg = [ log.timestamp(), message ].join(" ");
    const handle = setInterval(function() {
        process.stdout.write("\r" + msg + spinner[x++]);
        x &= 3;
    }, 250);
    return () => {
        if (done) return;
        clearInterval(handle);
        process.stdout.write("\r" + msg + " \n");
        done = true;
    };
};

module.exports = log;