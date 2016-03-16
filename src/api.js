var jsdap = {};

if (typeof require !== 'undefined' && module.exports) {
    parser = require('./parser');
    xdr = require('./xdr');
}

(function() {
    'use strict';

    var proxyUrl = function(url, callback, binary) {
        var xml = new XMLHttpRequest();

        xml.open('GET', url, true);
        xml.responseType = "arraybuffer";

        xml.onreadystatechange = function() {
            if (xml.readyState === 4) {
                var buf =
                       xml.responseBody           // XHR2
                    || xml.response               // FF7/Chrome 11-15
                    || xml.mozResponseArrayBuffer; // FF5
                if (!binary) {
                    callback(xml.responseText);
                }
                else {
                    callback(buf);
                }
            }
        };
        xml.send('');
    };

    jsdap.loadDataset = function(url, callback, proxy) {
        // User proxy?
        if (proxy) url = proxy + '?url=' + encodeURIComponent(url);

        // Load DDS.
        proxyUrl(url + '.dds', function(dds) {
            var dataset = new parser.ddsParser(dds).parse();

            // Load DAS.
            proxyUrl(url + '.das', function(das) {
                dataset = new parser.dasParser(das, dataset).parse();
                callback(dataset);
            });
        });
    };

    jsdap.loadData = function(url, callback, proxy) {
        // User proxy?
        if (proxy) url = proxy + '?url=' + encodeURIComponent(url);

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

            callback(data);
        }, true);
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = jsdap;
    }
})();
