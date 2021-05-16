# Package Placeholders

Any string value within the `gulpfile.config.js` may contain a `<%= propName %>` placeholder that is substituted at runtime with the matching value from the `package.json`.

Given a `package.json` containing the following...

```json
{
  "name": "ph-example",
  "version": "0.0.1",
  "config": {
    "custom": "something.wtf"
  }
}
```

...and a `gulpfile.config.js` containing the following...

```javascript
module.exports = {
    "zip": {
        "./releases/<%= name %>.v<%= version %>.zip": [
            //..files
            "./src/<%= config.custom %>"
        ]
    }
};
``` 

...would result in the following being used at runtime.

```javascript
module.exports = {
    "zip": {
        "./releases/ph-example.v0.0.1.zip": [
            //..files
            "./src/something.wtf"
        ]
    }
};
```

## Blocks

This task is a more for convenience as it simply executes the `wp-scripts build` command. That said, having it wrapped as a gulp task lets us integrate it easily into the overall build process.

### gulpfile.config.js

You can supply either a single command to run...

```javascript
module.exports = {
    "blocks": "wp-scripts build ./src/blocks/index.js --output-path=./assets/blocks"
};
```

...or an array of commands...

```javascript
module.exports = {
    "blocks": [
        "wp-scripts build ./src/blocks/index.js --output-path=./assets/blocks",
        "wp-scripts build ./src/blocks/index.pro.js --output-path=./assets/pro/blocks"
    ]
};
```

## Clean

This task lets us specify a glob pattern to match files and directories to remove as the first step of the `default` Gulp task.

You can supply either a single command to run...

```javascript
module.exports = {
    "clean": ["./assets/**","./releases/<%= name %>.v<%= version %>.zip"]
};
```
