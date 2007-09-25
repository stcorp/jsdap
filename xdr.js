// Lots of code from http://jsfromhell.com/classes/binary-parser
//    Jonas Raoni Soares Silva
//    http://jsfromhell.com/classes/binary-parser [v1.0]


var END_OF_SEQUENCE = '\xa5\x00\x00\x00';
var START_OF_SEQUENCE = '\x5a\x00\x00\x00';


function dapUnpacker(xdrdata, dapvar) {
    this._buf = xdrdata;
    this.dapvar = dapvar;

    this._pos = 0;

    this.getValue = function() {
        var i = this._pos;

        if (this._buf.substr(i, 4) == END_OF_SEQUENCE) {
            return [];
        } else if (this._buf.substr(i, 4) == START_OF_SEQUENCE) {
            var mark = this._unpack_uint();
            var out = [];
            while (mark != 2768240640) {
                var tmp = this.getValue();
                out.push(tmp);
                mark = this._unpack_uint();
            }
            return out;
        } else if (this.dapvar.type == 'Structure' || 
                   this.dapvar.type == 'Dataset') {
            var out = [];
            dapvar = this.dapvar;
            for (child in dapvar) {
                if (child.type) {
                    this.var = child;
                    var tmp = this.getValue();
                    out.push(tmp);
                }
            }
            this.dapvar = dapvar;
            return out;
        } else if (this.dapvar.type == 'Grid') {
            var out = [];
            dapvar = this.dapvar;
            
            this.var = dapvar.array;
            var tmp = this.getValue();
            out.push(tmp);

            for (map in dapvar.maps) {
                this.var = dapvar.maps[map];
                var tmp = this.getValue();
                out.push(tmp);
            }

            this.dapvar = dapvar;
            return out;
        }

        var n = 1;
        if (this.dapvar.shape) {
            n = this.unpack_uint();
            if (this.dapvar.type.toLowerCase == 'url' || 
                this.dapvar.type.toLowerCase == 'string') {
                this.unpack_uint();
            }
        }
        // XXX
    }

    this._unpack_uint() {
        var bytes = 4;
        var signed = false;

        var i = this._pos;
        this._pos = i+bytes;
        data = this._buf.substr(i, bytes);
        return decodeInt(data, bytes, signed);
    }

    this._unpack_int() {
        var bytes = 4;
        var signed = true;

        var i = this._pos;
        this._pos = i+bytes;
        data = this._buf.substr(i, bytes);
        return decodeInt(data, bytes, signed);
    }

    this._unpack_float32() {
        var precision = 23;
        var exponent = 8;
        var bytes = 4;

        var i = this._pos;
        this._pos = i+bytes;
        data = this._buf.substr(i, bytes);
        return decodeFloat(data, precision, exponent);
    }
}
    this._unpack_float64() {
        var precision = 52;
        var exponent = 11;
        var bytes = 8;

        var i = this._pos;
        this._pos = i+bytes;
        data = this._buf.substr(i, bytes);
        return decodeFloat(data, precision, exponent);
    }
}


function shl(a, b){
    for(++b; --b; a = ((a %= 0x7fffffff + 1) & 0x40000000) == 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1);
    return a;
}


function readBits(buffer, start, length) {
    if (start < 0 || length <= 0) return 0;

    for(var offsetLeft, offsetRight = start % 8, curByte = buffer.length - (start >> 3) - 1,
        lastByte = buffer.length + (-(start + length) >> 3), diff = curByte - lastByte,
        sum = ((buffer[ curByte ] >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1))
        + (diff && (offsetLeft = (start + length) % 8) ? (buffer[ lastByte++ ] & ((1 << offsetLeft) - 1))
        << (diff-- << 3) - offsetRight : 0); diff; sum += shl(buffer[ lastByte++ ], (diff-- << 3) - offsetRight));

    return sum;
}


function getBuffer(data) {
    var buffer;
    for(var l, i = l = data.length, b = buffer = new Array(l); i; b[l - i] = data.charCodeAt(--i));
    b.reverse();

    return buffer;
}


function decodeInt(data, bytes, signed) {
    var x = readBits(getBuffer(data), 0, bytes*8);
    var max = Math.pow(2, bytes*8);
    var int;
    if (signed && x >= (max / 2)) {
        int = x - max;
    } else {
        int = x;
    }
    return int; 
}


function decodeFloat(data, precisionBits, exponentBits) {
    var buffer = getBuffer(data);

    var bias = Math.pow(2, exponentBits - 1) - 1;
    var signal = readBits(buffer, precisionBits + exponentBits, 1);
    var exponent = readBits(buffer, precisionBits, exponentBits);
    var significand = 0;
    var divisor = 2;
    var curByte = buffer.length + (-precisionBits >> 3) - 1;
    var byteValue, startBit, mask;

    do
        for(byteValue = buffer[ ++curByte ], startBit = precisionBits % 8 || 8, mask = 1 << startBit;
            mask >>= 1; (byteValue & mask) && (significand += 1 / divisor), divisor *= 2);
    while(precisionBits -= startBit);

    return exponent == (bias << 1) + 1 ? significand ? NaN : signal ? -Infinity : +Infinity
        : (1 + signal * -2) * (exponent || significand ? !exponent ? Math.pow(2, -bias + 1) * significand
        : Math.pow(2, exponent - bias) * (1 + significand) : 0);
}
