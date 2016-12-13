# repoz-cli

[![npm](https://img.shields.io/npm/v/repoz.svg)]()

Repoz node client. Can be used both as npm pacakge or client tool

Repoz: http://repoz.dextra.com.br

## Install

`npm install -g repoz`

### Package

Require repoz npm package and create an instance for each project with username and password

#### Usage

```js
var repoz = require('repoz');

repoz('myProject', 'myUser', 'myPass').list();
```

### Client

Each client call will prompt for user credentials (username & password)

#### Usage

`repoz -p <project> <command> [args]`

### Commands

Method  | Usage  | Arguments
--------|--------|------------
GET     | get    | `<path> [file]`
POST    | post   | `<path> <file>`
PUT     | put    | `<path> <file>`
DELETE  | delete | `<path>`
LIST    | list   | ` `

#### Examples

`repoz -p myProject post /sub/folder/file.txt local/sub/folder/another.txt`

`repoz -p myProject get /sub/folder/file.txt`

`repoz -p myProject delete /sub/folder`

`repoz -p myProject list`

## Development

Documentation: http://repoz.dextra.com.br/repoz/docs.html

Install dependencies: `npm install`

Create symbolik link: `npm link`
