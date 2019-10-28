var jsdap = {};

if (typeof require !== 'undefined' && module.exports) {
    var parser = require('./parser');
    var xdr = require('./xdr');

    //Workaround infinite recursion when jsdap is included in a webpack project
    if (typeof XMLHttpRequest === 'undefined') {
        var XMLHttpRequest = require('xhr2');
    }
}

(function() {
    'use strict';

    jsdap.newRequest = function(url, binary) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        if (binary) {
            xhr.responseType = 'arraybuffer';
        }
        else {
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
            else {
                xhr.setRequestHeader('Accept-Charset', 'x-user-defined');
            }
        }

        return xhr;
    };

    jsdap.dodsRequestHandler = function(xhr) {
        var dods = xhr.responseBody             //XHR2
                || xhr.response                 //FF7/Chrome 11-15
                || xhr.mozResponseArrayBuffer;  //FF5

        var dataStart = '\nData:\n';
        var view = new DataView(dods);
        var byteIndex = 0;

        var dds = ''; //The DDS string

        while (byteIndex < view.byteLength) {
            dds += String.fromCharCode(view.getUint8(byteIndex));

            if (dds.indexOf(dataStart) !== -1) {
                break;
            }

            byteIndex += 1;
        }

        dds = dds.substr(0, dds.length - dataStart.length); //Remove the start of data string '\nData:\n'
        dods = dods.slice(byteIndex + 1); //Split off the DDS data

        var dapvar = new parser.ddsParser(dds).parse();
        var data = new xdr.dapUnpacker(dods, dapvar).getValue();

        //Return an object containing the DDS for the requested data, as well as the requested data
        return {
            dds: dapvar,
            data: data,
        };
    };

    jsdap.ddsRequestHandler = function(xhr) {
        const dds = xhr.responseText;

        return new parser.ddsParser(dds).parse();
    };

    jsdap.dasRequestHandler = function(xhr, dds = { type: 'Dataset', attributes: {} }) {
        const das = xhr.responseText;

        return new parser.dasParser(das, dds).parse();
    };

    jsdap.loadDataAndDDS = function(url, onLoad, onError, onAbort, onProgress, onTimeout) {
        var dodsReq = jsdap.newRequest(url, true);

        dodsReq.onload = function() {
            onLoad(jsdap.dodsRequestHandler(dodsReq));
        };
        dodsReq.onerror = onError;
        dodsReq.onabort = onAbort;
        dodsReq.onprogress = onProgress;
        dodsReq.ontimeout = onTimeout;

        dodsReq.send(null);
    };

    jsdap.loadDDS = function(url, onLoad, onError, onAbort, onProgress, onTimeout) {
        var ddsReq = jsdap.newRequest(url);

        ddsReq.onLoad = function() {
            onLoad(jsdap.ddsRequestHandler(ddsReq));
        };
        ddsReq.onerror = onError;
        ddsReq.onabort = onAbort;
        ddsReq.onprogress = onProgress;
        ddsReq.ontimeout = onTimeout;

        ddsReq.send(null);
    };

    jsdap.loadDAS = function(url, dds, onLoad, onError, onAbort, onProgress, onTimeout) {
        var dasReq = jsdap.newRequest(url);

        dasReq.onload = function() {
            onLoad(jsdap.dasRequestHandler(dasReq, dds));
        };
        dasReq.onerror = onError;
        dasReq.onabort = onAbort;
        dasReq.onprogress = onProgress;
        dasReq.ontimeout = onTimeout;

        dasReq.send(null);
    };

    jsdap.loadData = function(url, onLoad, onError, onAbort, onProgress, onTimeout) {
        jsdap.loadDataAndDDS(url, function(dods) {
            //Return only data
            return onLoad(dods.data);
        }, onError, onAbort, onProgress, onTimeout);
    };

    jsdap.loadDataset = function(url, onLoad, onError, onAbort, onProgress, onTimeout) {
        jsdap.loadDDS(url + '.dds', function(dds) {
            jsdap.loadDAS(url + '.das', dds, onLoad, onError, onAbort, onProgress, onTimeout);
        }, onError, onAbort, onProgress, onTimeout);
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = jsdap;
    }
})();
