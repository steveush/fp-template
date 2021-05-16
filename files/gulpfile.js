const gulp = require("gulp");
const tmpl = require("@fooplugins/template");
const pkg = require("./package.json");
const raw = require("./gulpfile.config.js");

// get the compiled config
const config = tmpl.format(raw, pkg);

// register all tasks
tmpl.registerTasks(gulp, config);

// the default task executed when you just run `gulp` on the command line
gulp.task("default", gulp.series( "clean", "copy", gulp.parallel( "scss", "scripts", "images", "blocks" )));

// builds the assets and then watches for changes
gulp.task("develop", gulp.series( "default", "watch" ));

// builds the assets and then packages the plugin for deployment
gulp.task("compile", gulp.series( "default", "translate", "zip" ));