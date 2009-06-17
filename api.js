function proxyUrl(url, callback) {
    if (IE_HACK) {
        var vbArr = BinFileReaderImpl_IE_VBAjaxLoader(fileURL);
        callback(vbArr.toArray());
    } else {
        var xml = new XMLHttpRequest();
        xml.open("GET", url, true);

        xml.onreadystatechange = function() {
            if (xml.readyState == 4) {
                callback(xml.responseText);
            }
        };
        xml.overrideMimeType('text/plain; charset=x-user-defined');
        xml.send('');
    }
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
