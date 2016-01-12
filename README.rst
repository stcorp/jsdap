A quick introduction
====================

Jsdap is composed of 3 separate files: parser.js, xdr.js, and api.js.
If you run ``npm run build``, they will be combined and made into both
``jsdap.js`` and the minified ``jsdap.min.js``.

The API is as simple as it gets::

    loadDataset(url, callback [, proxy])

This will load the metadata from an OPeNDAP url, and return it to
your callback function as a Javascript object identical to pydap's
JSON response (http://pydap.org/2.x/responses/json.html).

Note that if the server is on a different domain you need to specify
a proxy to handle the requests. There's a simple proxy written in
Python that comes together with jsdap.::

    loadData(url, callback [, proxy])

This functions read the data from a ``.dods`` URL
(http://example.com/dataset.dods?var1,var2&var3>0), returning it
as a nested list. This is the data for the whole dataset, so the
outer list corresponds to the dataset objects, and each contained
list is the data of a given variable, an so on recursively.

There are a couple of demos of increasing complexity in the
``examples`` directory.

Limitations
===========

Due to the XHR policy on not allowing cross-domain requests,
you need a proxy to handle external datasets.

Development
===========

Install the dev dependencies::

    $ npm install

Link eslint for Javascript linting::

    $ ln -s --relative node_modules/eslint/bin/eslint.js ../bin/eslint


Build the library, and minified library, using npm::

    $ npm run build

Unit tests use the Karma test runner and test against Firefox and Chrome. They can be run using npm::

    $ npm run test

License
=======

Jsdap is (c) 2007--2009 Roberto De Almeida, licensed under the MIT license.
