var http = require('http');
var url = require('url');
var sys = require('sys');
var Buffer = require('buffer').Buffer;
var url = require('url');

var jspack = require('./jspack').jspack;
var dataset = require('./dataset').dataset;

var START_OF_SEQUENCE = "\x5a\x00\x00\x00";
var END_OF_SEQUENCE = "\xa5\x00\x00\x00";

var MAP = {
    'int16'  : 'i',  // packed in 4 bytes
    'uint16' : 'i',  // packed in 4 bytes
    'int32'  : 'i',
    'uint32' : 'I',
    'int'    : 'i',
    'uint'   : 'I',
    'float32': 'f',
    'float64': 'd'
}

function dds (dataset) {
    var output = "Dataset {\n  Sequence {\n";
    for (var name in dataset.vars) {
        output += "    " + dataset.vars[name].type + " " + name + ";\n";
    }
    output += "  } " + dataset.sequence + ";\n} " + dataset.name + ";\n\n";
    return output;
}

function das (dataset) {
    var output = "Attributes {\n  " + dataset.sequence + " {\n";
    for (var name in dataset.vars) {
        output += "    " + name + " {\n";
        for (k in dataset.vars[name].attributes) {
            var v = dataset.vars[name].attributes[k];
            output += "      " + getType(v) + " " + k + " " + encodeAtom(v) + ";\n";
        }
        output += "    }\n";
    }
    output += "  }\n}\n\n";
    return output;
}

function getType (v) { 
    if (typeof(v) == 'string') {
        return "String";
    } else if (typeof(v) == 'number') {
        if (String(v).indexOf('.') == -1) {
            return "Int32";
        } else {
            return "Float64";
        }
    } else {
        return getType(v[0]); 
    }
}

function encodeAtom (v) {
    if (typeof(v) == 'string') {
        return escape(v);
    } else if (typeof(v) == 'number') {
        return String(v.toFixed(6));
    } else {
        return escape(String(v));
    }
}

function constrain (dataset, search) {
    if (search === undefined) return dataset;
    search = search.substring(1);  // remove '?'

    // work with a copy
    var filtered = {
        name: dataset.name,
        sequence: dataset.sequence,
        data: [],
        vars: {}
    }
    for (var name in dataset.vars) {
        filtered.vars[name] = dataset.vars[name];
    }
    var data = [];
    for (var row=0; row<dataset.data.length; row++) {
        data.push( dataset.data[row].slice(0) );
    }
    filtered.data = data;

    // parse projection and selection
    var projection = [];
    var selection = search.split('&');
    if (!selection[0].match(/<=|>=|!=|=~|>|<|=/)) {
        projection = selection.splice(0, 1)[0].split(',');
    }

    // filter data according to selection
    filters = [];
    for (var i=0; i<selection.length; i++) {
        if (selection[i].match(/<=|>=|!=|=~|>|<|=/)) {
            filters.push( buildFilter(selection[i], filtered.vars) );
        }
    }
    if (filters.length) {
        out = [];
        for (var i=0; i<filtered.data.length; i++) {
            var row = filtered.data[i];
            var skip = false;
            for (var j=0; j<filters.length; j++) {
                if (!filters[j](row)) {
                    skip = true;
                    break;
                }
            }
            if (!skip) out.push(row);
        }
        filtered.data = out;
    }

    // now return only requested variables
    if (projection.length) {
        var vars = {};
        var indexes = [];
        var order = [];
        for (var name in filtered.vars) {
            order.push(name);
        }
        for (var i=0; i<projection.length; i++) {
            var name = projection[i];
            if (name.indexOf('.') != -1) name = name.split('.')[1];
            vars[name] = filtered.vars[name];
            indexes.push( order.indexOf(name) );
        }
        filtered.vars = vars;

        // reorder data 
        var row, out = [];
        for (var i=0; i<filtered.data.length; i++) {
            row = [];
            for (var j=0; j<indexes.length; j++) {
                row.push( filtered.data[i][ indexes[j] ] );
            }
            out.push(row);
        }
        filtered.data = out;
    }

    return filtered;
}

function buildFilter (cond, vars) {
    // assume first token is var, third is constant
    var tokens = cond.split(/(<=|>=|!=|=~|>|<|=)/);
    var a = tokens[0], op = tokens[1], b = tokens[2];

    if (a.indexOf('.') != -1) a = a.split('.')[1];  // remove sequence name from id
    var index = 0;
    for (var name in vars) {
        if (a == name) break;
        index++;
    }
    b = eval(b);

    switch (op) {
        case '<=': return function (row) { return row[index] <= b };
        case '>=': return function (row) { return row[index] >= b };
        case '!=': return function (row) { return row[index] != b };
        case '=' : return function (row) { return row[index] == b };
        case '=~': return function (row) { return row[index].match( RegExp(b) ) };
        case '>' : return function (row) { return row[index] > b };
        case '<' : return function (row) { return row[index] < b };
    }
}

http.createServer(function (req, res) {
    var filtered = constrain(dataset, url.parse(req.url).search);

    switch (url.parse(req.url).pathname) {
        case '/.das':
            res.writeHead(200, {
                'Content-description': 'dods_das',
                'Content-type': 'text/plain'});
            res.end(das(dataset));  // use the unfiltered dataset
            break;
        case '/.dds':
            res.writeHead(200, {
                'Content-description': 'dods_dds',
                'Content-type': 'text/plain'});
            res.end(dds(filtered));
            break;
        case '/.dods':
            res.writeHead(200, {
                'Content-description': 'dods_data',
                'Content-type': 'application/octet-stream'});
            res.write(dds(filtered));
            res.write('Data:\n');
            fmt = '>';  // big endian
            for (var name in filtered.vars) {
                fmt += MAP[filtered.vars[name].type.toLowerCase()];
            }
            for (var row=0; row<filtered.data.length; row++) {
                res.write(START_OF_SEQUENCE, 'binary');
                octets = jspack.Pack(fmt, filtered.data[row]);
                res.write(new Buffer(octets), 'binary');
            }
            res.end(END_OF_SEQUENCE, 'binary');
            break;
        default:
            res.writeHead(404, {'Content-type': 'text/plain'});
            res.end('Page not found.');
    }

}).listen(8002);
sys.puts('Server running at http://127.0.0.1:8002/');
