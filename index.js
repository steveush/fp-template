const _ = require("lodash");
const u = require("./utils");
const tasks = require("./tasks");

const registerTasks = (gulp, config) => {
    Object.keys(tasks).forEach((name) => {
        tasks[name](gulp, name, config);
    });
};

module.exports = {
    format: u.format,
    registerTasks
};