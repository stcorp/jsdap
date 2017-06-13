var jsdap = {};

if (typeof require !== 'undefined' && module.exports) {
    parser = require('./parser');
    xdr = require('./xdr');

    //Workaround infinite recursion when jsdap is included in a webpack project
    if (typeof XMLHttpRequest === 'undefined') {
        XMLHttpRequest = require('xhr2');
    }
}

(function() {
    'use strict';

    var proxyUrl = function(url, callback, binary) {
        var xml = new XMLHttpRequest();

        xml.open('GET', url, true);

        if (binary) {
            xml.responseType = 'arraybuffer';
        }
        else {
            if (xml.overrideMimeType) {
                xml.overrideMimeType('text/plain; charset=x-user-defined');
            }
            else {
                xml.setRequestHeader('Accept-Charset', 'x-user-defined');
            }
        }

        xml.onload = function() {
            if (binary) {
                var buf =
                       xml.responseBody             //XHR2
                    || xml.response                 //FF7/Chrome 11-15
                    || xml.mozResponseArrayBuffer;  //FF5

                callback(buf);
            }
            else {
                callback(xml.responseText);
            }
        };

        xml.send(null);
    };

    var dodsRequest = function(url, callback) {
        //Returns an object containing the DDS for the requested data, as well as the requested data
        proxyUrl(url, function(dods) {
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

            callback({dds: dapvar, data: data});
        }, true);
    };

    jsdap.loadDataset = function(url, callback, proxy) {
        //User proxy?
        if (proxy) url = proxy + '?url=' + encodeURIComponent(url);

        //Load DDS.
        proxyUrl(url + '.dds', function(dds) {
            var dataset = new parser.ddsParser(dds).parse();

            //Load DAS.
            proxyUrl(url + '.das', function(das) {
                dataset = new parser.dasParser(das, dataset).parse();
                callback(dataset);
            });
        });
    };

    jsdap.loadData = function(url, callback, proxy) {
        //User proxy?
        if (proxy) url = proxy + '?url=' + encodeURIComponent(url);

        dodsRequest(url, function(result) {
            callback(result.data);
        });
    };

    jsdap.loadDataAndDDS = function(url, callback, proxy) {
        //User proxy?
        if (proxy) url = proxy + '?url=' + encodeURIComponent(url);

        dodsRequest(url, function(result) {
            //Return the data and the DDS
            callback(result);
        });
    };

    jsdap.loadDDS = function(url, callback, proxy) {
         //User proxy?
        if (proxy) url = proxy + '?url=' + encodeURIComponent(url);

        //Load DDS
        proxyUrl(url, function(dds) {
            var dapvar = new parser.ddsParser(dds).parse();
            callback(dapvar);
        });
    }

    jsdap.loadDAS = function(url, dds, callback, proxy) {
        //User proxy?
        if (proxy) url = proxy + '?url=' + encodeURIComponent(url);

        //Load DAS
        proxyUrl(url, function(das) {
            var dataset = new parser.dasParser(das, dds).parse();
            callback(dataset);
        });
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = jsdap;
    }
})();
