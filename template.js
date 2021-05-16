const _ = require("lodash");
const c = require("chalk");
const glob = require("glob");
const path = require("path");
const fs = require("fs");
const fsx = require("fs-extra");
const u = require("./utils");

const updatePackage = (pkg, options, message, changes) => {
    return fsx.writeJson(options.__pkg, pkg, {"spaces":"\t"}).then(() => {
        if (options.verbose){
            u.log.output(message, changes);
        } else {
            u.log.output(message);
        }
    });
};

const setupPackage = (pkg, options) => {
    return Promise.resolve().then(() => {
        u.log("Checking defaults in " + c.magenta(options.__pkg) + "...");
        const added = u.defaults(pkg, options.defaults);
        if (added.length){
            const msg = c.green("Added " + c.magenta(added.length) + " default value(s) to the '" + c.cyan("package.json") + "' file.");
            return updatePackage(pkg, options, msg, added);
        } else {
            u.log.output(c.green("All default values existed!"));
        }
    });
};

const createPackage = (pkg, options) => {
    return Promise.resolve().then(() => {
        u.log("Checking scripts in " + c.magenta(options.__pkg) + "...");
        const added = u.defaults(pkg, options.scripts, "scripts");
        if (added.length){
            const msg = c.green("Added " + c.magenta(added.length) + " script(s) to the '" + c.cyan("package.json") + "' file.");
            return updatePackage(pkg, options, msg, added);
        } else {
            u.log.output(c.green("All scripts existed!"));
        }
    });
};

const cleanPackage = (pkg, options) => {
    return Promise.resolve().then(() => {
        u.log("Checking scripts in " + c.magenta(options.__pkg) + "...");
        const removed = u.prune(pkg, options.scripts, "scripts");
        if (removed.length){
            const msg = c.green("Removed " + c.magenta(removed.length) + " script(s) from the '" + c.cyan("package.json") + "' file.");
            return updatePackage(pkg, options, msg, removed);
        } else {
            u.log.output(c.green("All scripts removed!"));
        }
    });
};

const removePackage = (pkg, options) => {
    return Promise.resolve().then(() => {
        u.log("Checking defaults in " + c.magenta(options.__pkg) + "...");
        const removed = u.prune(pkg, options.defaults);
        removed.push(...u.prune(pkg, options.scripts, "scripts"));
        if (removed.length){
            const msg = c.green("Removed " + c.magenta(removed.length) + " default value(s) from the '" + c.cyan("package.json") + "' file.");
            return updatePackage(pkg, options, msg, removed);
        } else {
            u.log.output(c.green("All default values removed!"));
        }
    });
};

const createFiles = (pkg, options) => {
    return Promise.resolve().then(() => {
        const src = path.resolve(__dirname, "./files"),
            dest = path.dirname(options.__pkg),
            files = glob.sync("**/*", {"cwd": src}),
            skipped = [], replaced = [], created = [];

        u.log("Checking files in " + c.magenta(dest) + "...");

        files.forEach((fileName) => {
            const srcName = path.join(src, fileName),
                destName = u.format(path.join(dest, fileName), pkg, u.format.PH_BD),
                isDirectory = fs.lstatSync(srcName).isDirectory();

            if (isDirectory){
                if ( !fs.existsSync( destName ) ) {
                    fs.mkdirSync( destName );
                    created.push(destName);
                } else {
                    skipped.push(destName);
                }
            } else {
                let content;
                const raw = fs.readFileSync(srcName, "utf8");
                if (fs.existsSync(destName)){
                    if (options.force){
                        content = u.format(raw, pkg, u.format.PH_BD);
                        fs.writeFileSync(destName, content, "utf8");
                        replaced.push(destName);
                    } else {
                        skipped.push(destName);
                    }
                } else {
                    content = u.format(raw, pkg, u.format.PH_BD);
                    fs.writeFileSync(destName, content, "utf8");
                    created.push(destName);
                }
            }
        });

        if (created.length){
            const created_msg = c.green("Created " + c.magenta(created.length) + " file(s) and/or folder(s).");
            if (options.verbose){
                u.log.output(created_msg, "\n", created);
            } else {
                u.log.output(created_msg);
            }
        }
        if (replaced.length){
            const replaced_msg = c.yellow("Replaced " + c.magenta(replaced.length) + " existing file(s) with the '" + c.cyan("--force") + "' flag.");
            if (options.verbose){
                u.log.output(replaced_msg, "\n", replaced);
            } else {
                u.log.output(replaced_msg);
            }
        }
        if (skipped.length){
            const skipped_msg = c.yellow("Skipped " + c.magenta(skipped.length) + " existing " + (options.force ? "folder(s)" : "file(s) and/or folder(s)."));
            if (options.verbose){
                if (options.force){
                    u.log.output(skipped_msg, "\n", skipped);
                } else {
                    u.log.output(skipped_msg, c.yellow("Use the '" + c.cyan("--force") + "' flag to overwrite files."), "\n", skipped);
                }
            } else {
                if (options.force){
                    u.log.output(skipped_msg, c.yellow("Use the '" + c.cyan("--verbose") + "' flag to view them." ) );
                } else {
                    u.log.output(skipped_msg, c.yellow("Use the '" + c.cyan("--verbose") + "' flag to view them or the '" + c.cyan("--force") + "' flag to overwrite files." ) );
                }
            }
        }
    });
};

const removeFiles = (pkg, options) => {
    return Promise.resolve().then(() => {
        //remove the template files
        const src = path.resolve(__dirname, "./files"),
            dest = path.dirname(options.__pkg),
            files = glob.sync("**/*", {"cwd": src,"nodir": true}),
            dirs = glob.sync("**/*/", {"cwd": src}),
            skipped = {}, removed = [];

        u.log("Checking files in " + c.magenta(dest) + "...");

        files.forEach((fileName) => {
            const destName = u.format(path.join(dest, fileName), pkg, u.format.PH_BD);
            if (fs.existsSync(destName)) {
                fsx.removeSync(destName);
                removed.push(destName);
            }
        });

        dirs.sort(function (a, b) {
            return b.localeCompare(a);
        });

        dirs.forEach((dirName) => {
            const destName = u.format(path.join(dest, dirName), pkg, u.format.PH_BD);
            if (fs.existsSync(destName)){
                const blocking = glob.sync("**/*", {"cwd": destName,"nodir": true});
                if (options.force || blocking.length === 0){
                    fsx.removeSync(destName);
                    removed.push(destName);
                } else {
                    skipped.push({"path": destName, "contains": blocking});
                }
            }
        });

        if (removed.length){
            const removed_msg = c.green("Removed " + c.magenta(removed.length) + " files and folders.");
            if (options.verbose){
                u.log.output(removed_msg, "\n", removed);
            } else {
                u.log.output(removed_msg);
            }
        }
        if (skipped.length){
            const skipped_msg = c.yellow("Skipped " + c.magenta(skipped.length) + " folder(s) containing files not created by the template.");
            if (options.verbose){
                u.log.output(skipped_msg, c.yellow("Use the '" + c.cyan("--force") + "' flag to remove them."), "\n", skipped);
            } else {
                u.log.output(skipped_msg, c.yellow("Use the '" + c.cyan("--verbose") + "' flag to view them or the '" + c.cyan("--force") + "' flag to remove them." ) );
            }
        }
        if (!removed.length && !skipped.length){
            u.log.output(c.green("No files needed to be removed!"));
        }
    });
};

const checkDependencies = (pkg, options) => {
    return Promise.resolve().then(() => {
        u.log("Checking dependencies in " + c.magenta(options.__pkg) + "...");
        if (!_.isPlainObject(pkg.devDependencies)) pkg.devDependencies = {};
        const missingDependencies = options.devDependencies.filter((dep) => {
            return !_.has(pkg.devDependencies, dep);
        });
        if (missingDependencies.length > 0){
            const command = "npm install --save-dev " + missingDependencies.join(" ");
            u.log.output(c.red("Missing dependencies! Run '" + command + "' before you attempt to build!"));
        } else {
            u.log.output(c.green("All dependencies exist!"));
        }
    });
};

module.exports = {
    setupPackage,
    createPackage,
    cleanPackage,
    removePackage,
    createFiles,
    removeFiles,
    checkDependencies
};