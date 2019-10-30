# jsdap

A JavaScript [OPeNDAP](http://www.opendap.org/) client.

## Installation

For use with [Node.js](https://nodejs.org/en/), simply install using npm:

    :::bash
    $ npm install jsdap

Precompiled files for drop in usage in the browser are provided on the [downloads page](https://bitbucket.org/jetfuse/jsdap/downloads).

## Usage

The API exposes several simple loading functions, as well as the internal new request and handler functions for increased flexibility.

    :::js
    jsdap.loadDataAndDDS(url, onLoad, onError, onAbort, onProgress, onTimeout);

This reads the data from a `.dods` URL (http://example.com/dataset.dods?var2,var1&var3>0), returning an object with the dataset descriptor structure (DDS) for the given query as `dds` property, and a `data` property containing the requested data as an object or list depending on if the data is structured or flat.

    :::js
    jsdap.loadData = function(url, onLoad, onError, onAbort, onProgress, onTimeout);

This will return only the data from loadDataAndDDS (see above) and discard the DDS.

    :::js
    jsdap.loadDDS = function(url, onLoad, onError, onAbort, onProgress, onTimeout) {

This will load just the dataset descriptor structure (DDS) from a `.dds` OPeNDAP URL (http://example.com/dataset.das?var2,var1&var3>0).

    :::js
    jsdap.loadDataset(url, onLoad, onError, onAbort, onProgress, onTimeout);

This will load the metadata from an OPeNDAP url, and return it to your callback function as a JavaScript object identical to pydap's JSON response (http://pydap.org/2.x/responses/json.html) using loadDDS (see above) and loadDAS (see below).

    :::js
    jsdap.loadDAS = function(url, dds, onLoad, onError, onAbort, onProgress, onTimeout);

This will load just the dataset attributes structure (DAS) from a `.das` OPeNDAP url (http://example.com/dataset.das?var2,var1&var3>0) and is part of the loadDataset function.

## Examples

More detailed examples can be found in the `examples` folder, `examples/README.md` covers how to run them.

## Limitations

Dods data is parsed using an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), so IE 9 and below are not supported.

## Development

The source can be checked out from [the git repository](https://bitbucket.org/jetfuse/jsdap).

It is recommended to develop in a [virtualenv](https://virtualenv.pypa.io/) with [nodeenv](https://github.com/ekalinin/nodeenv) installed:

    :::bash
    $ virtualenv jsdap
    $ cd jsdap
    $ source bin/activate
    $ pip install nodeenv

Install the latest node and set nodeenv to activate with the parent virtualenv:

    :::bash
    $ nodeenv -p

Checkout the source and install the requirements in the nodeenv:

    :::bash
    $ git clone git@bitbucket.org:jetfuse/jsdap.git
    $ cd jsdap
    $ npm install

You may wish to link [eslint](http://eslint.org/) into your path for JavaScript linting, assuming development inside a [nodeenv](https://github.com/ekalinin/nodeenv):

    :::bash
    $ ln -s --relative node_modules/eslint/bin/eslint.js ../bin/eslint

Jsdap is composed of 3 separate files: `parser.js`, `xdr.js`, and `api.js`. They are located within the `src` directory.

Unit tests are written with [Jasmine](http://jasmine.github.io/) and run by the [Karma](http://karma-runner.github.io) test runner. Tests are run against Firefox, Chrome, and Node.js. They can be run using npm:

    :::bash
    $ npm run test

## License

Jsdap is (c) 2007--2009 Roberto De Almeida, licensed under the MIT license.

## References

-   [The Data Access Protocol - DAP 2.0](https://earthdata.nasa.gov/files/ESE-RFC-004v1.1.pdf) (Caution, PDF link)
