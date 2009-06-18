function proxyUrl(url, callback) {
    // Mozilla/Safari/IE7+
    if (window.XMLHttpRequest) {
        var xml = new XMLHttpRequest();
    // IE6
    } else if (window.ActiveXObject) {
        var xml = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xml.open("GET", url, true);
    if (xml.overrideMimeType) {
        xml.overrideMimeType('text/plain; charset=x-user-defined');
    } else {
        xml.setRequestHeader('Accept-Charset', 'x-user-defined');
    }

    xml.onreadystatechange = function() {
        if (xml.readyState == 4) {
            if (IE_HACK) {
                callback(BinaryToString(xml.responseBody));
            } else {
                callback(xml.responseText);
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
        var tmp = dods.split('\nData:\n');
        var dds = tmp[0];
        var xdrdata = tmp[1];

        var dapvar = new ddsParser(dds).parse();
        var data = new dapUnpacker(xdrdata, dapvar).getValue();
        callback(data);
    });
}
