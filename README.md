# Q Editor

This is the editor for the Q Toolbox. You will also need a [Q server](https://github.com/nzzdev/Q-server) to make use this.


## Development

To develop the Q editor you need npm first.
Running the following commands in the root of this project should give you a working environment.

```
npm install -g jspm
cd client
npm install
jspm install
```

After that you can start a livereloading webserver by running `gulp watch` within the folder `client`.

### env
See the file `client/env`. This is loaded for development only and should contain JSON like this:
```
{
  "QServerBaseUrl": "http://localhost:3001",
  "devLogging": true,
  "pushState": false
}
```
where `QServerBaseUrl` is a url to a running [Q server](https://github.com/nzzdev/Q-server).
Start one locally or use your staging environment. You probably do not want to develop using your production Q server.


## License
Copyright (c) 2016 Neue Zürcher Zeitung. All rights reserved.

This software is published under the MIT license.
