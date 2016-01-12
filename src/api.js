function proxyUrl(url, callback, binary) {
    var xml = new XMLHttpRequest();

    xml.open('GET', url, true);
    if (xml.overrideMimeType) {
        xml.overrideMimeType('text/plain; charset=x-user-defined');
    }
    else {
        xml.setRequestHeader('Accept-Charset', 'x-user-defined');
    }

    xml.onreadystatechange = function() {
        if (xml.readyState === 4) {
            if (!binary) {
                callback(xml.responseText);
            }
            else {
                callback(getBuffer(xml.responseText));
            }
        }
    };
    xml.send('');
}


function loadDataset(url, callback, proxy) {
    // User proxy?
    if (proxy) url = proxy + '?url=' + encodeURIComponent(url);

    // Load DDS.
    proxyUrl(url + '.dds', function(dds) {
        var dataset = new ddsParser(dds).parse();

        // Load DAS.
        proxyUrl(url + '.das', function(das) {
            dataset = new dasParser(das, dataset).parse();
            callback(dataset);
        });
    });
}


function loadData(url, callback, proxy) {
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

        var dapvar = new ddsParser(dds).parse();
        var data = new dapUnpacker(dods, dapvar).getValue();

        callback(data);
    }, true);
}

if (typeof exports !== 'undefined') {
    exports.loadDataset = loadDataset;
    exports.loadData = loadData;
}
