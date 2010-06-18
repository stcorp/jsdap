var sys = require('sys');
var http = require('http');

var xdr = require('../xdr');
var parser = require('../parser');

exports.dataset = {
    'name': 'nameless',
    'sequence': 'nameless',
    'data': [],
    'vars': {}
}

var opendap = http.createClient(8001, 'localhost');
var request = opendap.request('GET', '/simple.sql.dods',
        {'host': 'localhost'});
request.addListener('response', function (response) {
    response.setEncoding('binary');
    var bytes, acc = [];
    response.addListener('data', function (body) {
        bytes = xdr.getBuffer(body);
        for (var i=0; i<bytes.length; i++) {
            acc.push(bytes[i]);
        }
    });
    response.addListener('end', function () {
        var dds = '';
        while (!dds.match(/\nData:\n$/)) {
            dds += String.fromCharCode(acc.splice(0, 1));
        }
        dds = dds.substr(0, dds.length-7);
        var dapvar = new parser.ddsParser(dds).parse();
        var data = new xdr.dapUnpacker(acc, dapvar).getValue();

        exports.dataset.name = dapvar.name;
        exports.dataset.data = data[0];
        // get sequence
        var sequence;
        for (var name in dapvar) {
            if (dapvar[name]['type'] == 'Sequence') {
                sequence = dapvar[name];
                exports.dataset.sequence = sequence['name'];
                break;
            }
        }
        for (var name in sequence) {
            if (sequence[name]['type'] !== undefined) {
                exports.dataset.vars[name] = sequence[name];
            }
        }

        sys.puts('Dataset loaded.');
    });
});
request.end();
