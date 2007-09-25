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
            var mark = this._unpack_int32();
            var out = [];
            while (mark != -1526726656) {
                var tmp = this.getValue();
                out.push(tmp);
                mark = this._unpack_int32();
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
                this.unpack_unit();
            }
        }
        // XXX
    }
}
