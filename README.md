# jsdap

A JavaScript [OPeNDAP](http://www.opendap.org/) client.

## Installation

For use with [Node.js](https://nodejs.org/en/), simply install using npm:

    :::bash
    $ npm install jsdap

Precompiled files for drop in usage in the browser are provided on the [downloads page](https://bitbucket.org/jetfuse/jsdap/downloads).

## Use

The API is as simple as it gets:

    :::js
    jsdap.loadDataset(url, callback [, proxy]);

This will load the metadata from an OPeNDAP url, and return it to your callback function as a JavaScript object identical to pydap's JSON response (http://pydap.org/2.x/responses/json.html).

Note that if the server is on a different domain you need to specify a proxy to handle the requests. There's a simple proxy written in Python contained in `examples/ajaxproxy.py`.

To load dods data:

    :::js
    jsdap.loadData(url, callback [, proxy]);

This reads the data from a `.dods` URL (http://example.com/dataset.dods?var1,var2&var3>0), returning it as a nested list. This is the data for the whole dataset, so the outer list corresponds to the dataset objects, and each contained list is the data of a given variable, an so on recursively.

    :::js
    jsdap.loadDataAndDDS(url, callback [, proxy]);

This reads the data from a `.dods` URL (http://example.com/dataset.dods?var2,var1&var3>0), returning an object with a `dds` property containing a JavaScript object equivalent to the DDS for the given query, and a `data` property containing the requested data as a nested list. This can be useful when a projection changes the order of the returned data.

## Examples

More detailed examples can be found in the `examples` folder, `examples/README.md` covers how to run them.

## Limitations

Due to the [XHR policy on not allowing cross-domain requests](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), you need a proxy to handle external datasets.

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

* [The Data Access Protocol - DAP 2.0](https://earthdata.nasa.gov/files/ESE-RFC-004v1.1.pdf) (Caution, PDF link)
