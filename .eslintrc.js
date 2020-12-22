module.exports = {
    "plugins": ["prettier"],
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": [
        "semistandard",
        "plugin:prettier/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "prettier/prettier": "error"
    }
};
