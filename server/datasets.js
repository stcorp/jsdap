var sys = require('sys');
var http = require('http');
var url = require('url');

var xdr = require('../xdr');
var parser = require('../parser');

function Proxy (remote, name, sequence) {
    sys.puts('Loading ' + remote + ' \033[01;31mwait\033[0m');
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

            sys.puts('Dataset ' + remote + ' \033[01;32mloaded\033[0m');
        });
    });
    request.end();
    
    return dataset;
}

exports.dataset1 = Proxy('http://localhost:8001/simple.sql');
//exports.dataset2 = Proxy('https://www.webapps.nwfsc.noaa.gov/pydap/beaches.sql');
exports.dataset3 = Proxy('http://test.opendap.org:8080/dods/dts/D1');
exports.dataset4 = {
    name: "temp3.dat",
    sequence: "seq",
    data: [[1,2,1,'one'],[2,4,4,'two'],[3,6,9,'three'],[4,8,16,'four']],
    vars: {
        xval: {type: "Float32", attributes: {units: "meters per second"}},
        yval: {type: "Int16", attributes: {units: "kilograms per minute"}},
        zval: {type: "Int16", attributes: {units: "tons per hour"}},
        wval: {type: "String", attributes: {units: "numbers"}}}};

