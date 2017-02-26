# repoz-cli

[![npm](https://img.shields.io/npm/v/repoz.svg)](https://www.npmjs.com/package/repoz)
[![CircleCI](https://img.shields.io/circleci/project/github/RedSparr0w/node-csgo-parser.svg)](https://circleci.com/gh/romajs/repoz-cli)
[![Codecov](https://img.shields.io/codecov/c/github/romajs/repoz-cli.svg)](https://codecov.io/gh/romajs/repoz-cli)
[![dependencies](https://david-dm.org/romajs/repoz-cli.svg)](https://david-dm.org/romajs/repoz-cli)
[![devDependencies](https://david-dm.org/romajs/repoz-cli/dev-status.svg)](https://david-dm.org/romajs/repoz-cli?type=dev)

[![NPM](https://nodei.co/npm/repoz.png?downloads=true)](https://nodei.co/npm/repoz/)

Repoz node client. Can be used both as npm pacakge or client tool

Repoz: http://repoz.dextra.com.br

### Client (bin)

`npm install -g repoz`, may require `sudo`

#### Usage

```
Usage: repoz [options] [command]


Commands:

list [options] <project> [urlpath]             list (urlpath is optional, default '/')
get [options] <project> <urlpath> [filepath]   get (filepath is optional, default basename(urlpath))
post [options] <project> <filepath> <urlpath>  post
put [options] <project> <filepath> <urlpath>   put
delete [options] <project> <urlpath>           delete
help [cmd]                                     display help for [cmd]

Options:

-h, --help  output usage information

```

#### Examples

1) `repoz post myProject local/sub/folder/another.txt /sub/folder/file.txt`

Saves **local/sub/folder/another.txt** to **https://repoz.dextra.com.br/repoz/r/myProject/sub/folder/file.txt**

2) `repoz get myProject /sub/folder/file.txt`

Downloads **https://repoz.dextra.com.br/repoz/r/myProject/sub/folder/file.txt** to **./file.txt**

3) `repoz delete myProject /sub/folder`

Deletes everything under **https://repoz.dextra.com.br/repoz/r/myProject/sub/folder**

4) `repoz list -r myProject`

List all files under **https://repoz.dextra.com.br/repoz/r/myProject/** recursively

5) `repoz list myProject /sub/folder`

List files only in **https://repoz.dextra.com.br/repoz/r/myProject/sub/folder**

#### Credentials

Credentials are stored into user local home folder, under `~/.repoz` encrypted with `aes192`  
Also the `.cipher_key` used for encryption is saved in to the same folder.  
Username and password will be prompt only when needed, these are the rules:

* Project has no credentials stored at all.
* There are only **read** access type credentials stored for a **write** command.

Access type are **read** and **write** operations, and the relations with commands are this:

* **read** : get, list
* **write**: post, put, delete

**Write** access type credentials can be used for **read** commands. But **read** access type credentials cannot be used for **write** commands.

Because this client does not known the access type of the credentials, it tries to guess it.
So, for the first time a credential was stored, and it was a **read** command, then its stored as **read** access type. But if the same credential its used for **write** command (after prompt), then the credential gets updated to **write** access type (and also the password in the process).

Credentials are updated when:

* Password changes
* Access type changes from **read** to **write**

### Module (lib)

`npm install --save repoz`

#### Usage

```js
var repoz = require('repoz');
var myProject = repoz.project('myProject', 'myUser', 'myPass')

myProject.list(urlpath, recursive)
myProject.get(urlpath, filepath)
myProject.put(filepath, urlpath) 
myProject.post(filepath, urlpath) 
myProject.delete(urlpath)
```

*Remember that all commands are promises* 

#### Examples

*Same examples from above*

```js
myProject.post('local/sub/folder/another.txt', '/sub/folder/file.txt');
myProject.get('/sub/folder/file.txt');
myProject.delete('/sub/folder/');
myProject.list('/', true);
myProject.list('/sub/folder');
```

### Overall highligths

* Auto remove all doubles `'//'`
* Auto completion of the first `'/'`, so is not needed
* Auto fix broken query string `'/?'` for list command
* Auto resolve path like `../other/folder`
* Credentials are stored, prompt once, use forever

### Development

Documentation: http://repoz.dextra.com.br/repoz/docs.html

Install: `npm install`, may require `sudo`

Test: `npm test`

Coverage: `./run-coverage`

Running client: `./bin/repoz`. To run as `repoz` only, create a symbolik link with: `npm link`, may require `sudo`
