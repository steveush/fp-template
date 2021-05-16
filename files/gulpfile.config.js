module.exports = {
    "blocks": [
        "./src/admin/blocks/index.js --output-path=./assets/admin/blocks",
        "./src/admin/blocks/index.pro.js --output-path=./assets/pro/admin/blocks"
    ],
    "clean": [
        "./assets/admin/**/*",
        "./assets/public/**/*",
        "./releases/<%= name %>.v<%=version%>.zip"
    ],
    "copy": {
        "./src/public/js/__utils.js": {
            "options": {
                "match": /FooUtils/g,
                "replacement": "{$config.namespace}.utils"
            },
            "files": ["./node_modules/foo-utils/dist/foo-utils.js"]
        }
    },
    "scss": {
        "./assets/public/css/<%= name %>.css": "./src/public/scss/index.scss",
        "./assets/pro/public/css/<%= name %>.css": "./src/public/scss/index.pro.scss"
    },
    "scripts": {
        "./assets/public/js/<%= name %>.js": [
            "./src/polyfills/IntersectionObserver.js",
            "./src/polyfills/ResizeObserver.js",
            "./src/public/js/__namespace.js",
            "./src/public/js/__utils.js",
            "./src/public/js/__init.js"
        ],
        "./assets/pro/public/js/<%= name %>.js": [
            "./src/polyfills/IntersectionObserver.js",
            "./src/polyfills/ResizeObserver.js",
            "./src/public/js/__namespace.js",
            "./src/public/js/__utils.js",
            "./src/public/js/ProFeature.js",
            "./src/public/js/__init.js"
        ]
    },
    "images": {
        "./assets/public/img/": "./src/public/img/*",
        "./assets/pro/public/img/": "./src/public/img/pro/*"
    },
    "watch": {
        "scss": [
            "./src/public/scss/**/*.scss",
            "./src/admin/scss/**/*.scss"
        ],
        "scripts": [
            "./src/public/js/**/*.js",
            "./src/admin/js/**/*.js"
        ],
        "images": [
            "./src/public/img/**/*",
            "./src/admin/img/**/*"
        ],
        "blocks": [
            "./src/admin/blocks/**/*"
        ]
    },
    "translate": {
        "options": {
            "domain": "<%= name %>",
            "package": "<%= title %>",
            "bugReport": "<%= bugs %>",
            "team": "<%= author %>"
        },
        "files": {
            "./languages/<%= name %>.pot": "./**/*.php"
        }
    },
    "zip": {
        "./releases/{$name}.v<%=version%>.zip": [
            "**/*",
            "!package*.json",
            "!./{node_modules,node_modules/**/*}",
            "!./{releases,releases/**/*}",
            "!./{src,src/**/*}",
            "!fs-config.json",
            "!composer.json",
            "!composer.lock",
            "!gulpfile*.js",
            "!./{gulpfile.js,gulpfile.js/**/*}"
        ]
    }
};