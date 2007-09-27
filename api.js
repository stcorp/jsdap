function proxyUrl(url, callback) {
    url =  '/proxy/' + encodeURIComponent(url);

    var xml = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    if (xml) {
        xml.open("GET", url, true);

        xml.onreadystatechange = function() {
            if (xml.readyState == 4) {
                callback(xml.responseText);
            }
        }
        xml.overrideMimeType('text/plain; charset=x-user-defined');
        xml.send();
    }
}


function loadDataset(url, callback) {
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


function loadData(url, id, selection, callback) {
    var dodsUrl = url + '.dods?' + id;
    if (selection.length) dodsUrl += '&' + selection.join('&');

    proxyUrl(dodsUrl, function(dods) {
        var tmp = dods.split('\nData:\n');
        var dds = tmp[0];
        var xdrdata = tmp[1];

        var dapvar = new ddsParser(dds).parse();
        id = id.replace(/\[.*?\]/g, '').split('.');
        for (var i=0; i<id.length; i++) {
            dapvar = dapvar[id[i]];
        }
        var data = new dapUnpacker(xdrdata, dapvar).getValue();
        callback(data);
    });
}
