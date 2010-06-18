var sys = require('sys');
var http = require('http');
var url = require('url');

var xdr = require('../xdr');
var parser = require('../parser');

function Proxy (remote, name, sequence) {
    sys.puts('Loading ' + remote);
    var dataset = {
        'name'    : name     || 'nameless',
        'sequence': sequence || 'sequence',
        'data'    : [],
        'vars'    : {}
    }

    var parsed = url.parse(remote);
    var opendap = http.createClient(parseInt(parsed.port || '80'), parsed.hostname);
    var request = opendap.request('GET', parsed.pathname + '.dods',
        {'host': parsed.hostname});
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

            dataset.name = dapvar.name;
            dataset.data = data[0];
            // get sequence
            var sequence;
            for (var name in dapvar) {
                if (dapvar[name]['type'] == 'Sequence') {
                    sequence = dapvar[name];
                    dataset.sequence = sequence['name'];
                    break;
                }
            }
            for (var name in sequence) {
                if (sequence[name]['type'] !== undefined) {
                    dataset.vars[name] = sequence[name];
                }
            }

            sys.puts('Dataset ' + remote + ' loaded');
        });
    });
    request.end();
    
    return dataset;
}

exports.dataset1 = Proxy('http://localhost:8001/simple.sql');
exports.dataset2 = Proxy('http://www.webapps.nwfsc.noaa.gov/pydap/beaches.sql');
