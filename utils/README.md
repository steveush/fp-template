# utils

Contains utility methods for this package.

## `exec( command [, options] )`

A promise wrapper around the [child_process.exec](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) method.

* `@param {string} command` - The command to run, with space-separated arguments.
* `@param {Object} [options]` - The options to execute the command with.
* `@returns {Promise}` - Returns a promise that is fulfilled once the command has been executed.

```javascript
const { exec } = require("./utils");

exec("npm install xyz --save-dev").then((result) => {
    console.log(result.stdout);
    console.log(result.stderr);
}).catch((reason) => {
    console.error(reason);
    console.log(reason.stdout);
    console.log(reason.stderr);
});
```

## `fileTask( gulp, name, config, defaults, done )`

A helper utility to standardize and simplify supplying file configurations for tasks such as sass or babel in the _gulpfile.config.js_ file.

* `@param {Gulp} gulp` - The instance of gulp to use.
* `@param {string} name` - The name of the task as it appears in the _gulpfile.config.js_ file.
* `@param {Object} config` - The object returned by the _gulpfile.config.js_ file.
* `@param {Object} defaults` - The default options used to execute this task.
* `@param {function} done` - The standard task complete Gulp callback.
* `@returns {PassThrough|*}` A merged stream of all completed file tasks.

This task processes files using a `process` callback supplied in the `defaults` when the task is created. This default callback can be overwritten in the `config` however it should not need to be.

```javascript
const gulp = require("gulp");
const babel = require('gulp-babel');
const config = require("./gulpfile.config.js");
const { fileTask } = require("./utils");

module.exports = (done) => {
    return fileTask( gulp, "js", config, {
        "allowEmpty": true,
        "babel": {
            "presets": [
                [
                    '@babel/preset-env', // Preset to compile your modern JS to ES5.
                    {
                        "targets": {
                            "browsers": [ '> 1%' ]
                        }
                    }
                ]
            ]
        },
        "process": ( src, file, options, files ) => {
            return src
                .pipe( babel( options.babel ) )
                .pipe( gulp.dest( file.path ) );
        }
    }, done );
};
```

With the above `"js"` task registered with Gulp you could then supply the configuration in the _gulpfile.config.js_ using any of the following formats:

Use the default options to output a single file.

```javascript 
module.exports = {
    "js": {
        "dest_file.js": "src_file.js"
    }
};
```

Use the default options to output a single file from multiple sources.

```javascript
module.exports = {
    "js": {
        "dest_file.js": ["src_file_1.js","src_file_2.js"]
    }
};
```

Use the default options to output multiple files from multiple sources.

```javascript
module.exports = {
    "js": {
        "dest_file_1.js": ["src_file_1.js","src_file_2.js"],
        "dest_file_2.js": ["src_file_3.js","src_file_4.js"]
    }
};
```

If you want to override any of the default options then supply them as an `options` object and wrap the files in a `files` object.

```javascript
module.exports = {
    "js": {
        "options": {
            "babel": {
                "presets": [
                    [
                        '@babel/preset-env',
                        {
                            "targets": {
                                "browsers": [ '> 3%' ]
                            }
                        }
                    ]
                ]
            }
        },
        "files": {
            "dest_file_1.js": ["src_file_1.js","src_file_2.js"],
            "dest_file_2.js": ["src_file_3.js","src_file_4.js"]
        }
    }
};
```

## format( target, values [, placeholder] )

Formats the supplied `target` using `values` that match the `placeholders` regular expression.

**_NOTE:_** If supplied an object this method will format both property values **_and keys_**.

* `@param {string|Object|Array} target` - The target to format.
* `@param {Object} values` - An object containing the values to substitute placeholders for.
* `@param {RegExp} [placeholder]` - The regular expression used to match a placeholder. If not supplied this method will by default match the `<%=NAME%>` placeholder syntax.
* `@returns {string|Object|Array}` A formatted instance of the `target` supplied.

#### Placeholders

A placeholder is simply a pattern within a string the formatter matches. It's a set of delimiters containing the name of the property on the `values` object that it will be replaced with.

The property name supplied between the delimiters can use dot notation to access child properties of objects or arrays. i.e. `config.port`

By default, this method uses the `format.PH_BPE` regular expression that matches the `<%=NAME%>` syntax.

```javascript
const { format } = require("./utils");

const values = {
    "name": "example",
    "config": {
        "port": 8080
    }
};

const str = format( "<%=name%>:<%=config.port%>", values );
// => "example:8080"

const arr = format( [ "<%=name%>", "<%=name%>:<%=config.port%>" ], values );
// => [ "example", "example:8080" ]

const obj = format( { "<%=name%>": "<%=name%>:<%=config.port%>" }, values );
// => { "example": "example:8080" }
```

There is also a second built-in placeholder `format.PH_BD` that matches the `{$NAME}` syntax which is file name friendly.
