#! /usr/bin/env node

const _ = require("lodash");
const c = require("chalk");
const fsx = require("fs-extra");
const path = require("path");
const u = require("../utils");
const cmd = require("../cmd");

const args = process.argv.slice(2),
    command = args.shift(),
    commands = Object.keys(cmd),
    __pkg = path.resolve("./package.json");

const run = (command, defaults) => {
    const options = u.processArgs(defaults);
    return fsx.readJson(__pkg).then((pkg) => {
        if (options.verbose) u.log.started(command, options);
        else u.log.started(command);
        return cmd[command](pkg, options).finally(() => {
            u.log.finished(command);
        });
    }).catch((err) => {
        u.log(err);
    });
};

if (commands.includes(command)){
    run(command, {
        "__pkg": __pkg,
        "force": false,
        "verbose": false,
        "defaults": {
            "license": "GPL-2.0-or-later",
            "title": "Plugin Name",
            "description": "A brief description about the plugin and what it does.",
            "author": "FooPlugins <info@fooplugins.com>",
            "bugs": "https://fooplugins.com",
            "config": {
                "namespace": "FooPlugins"
            }
        },
        "scripts": {
            "build": "gulp",
            "develop": "gulp develop",
            "compile": "gulp compile",
            "deploy": "gulp deploy"
        },
        "devDependencies": [
            "@wordpress/scripts",
            "gulp"
        ]
    });
} else {
    u.log(c.red("Unrecognized command '" + c.white(command) + "'."));
}