// DDS Parser. Test with URL http://comet.opendap.org:8080/opendap/s4/nc/123bears.nc

var tokens = [/^([\w.:]+)/,             // ids
              /^([{};=\[\],])/,         // symbols
              /^("[\s\S]+?[^\\]")/m,    // quoted strings
              /^(-?\d*(\.\d*)?)/,       // numbers
              /^()[\s\n\r]+/,           // whitespace
              /^([\s\S]+)/              // capture all if no match
             ];

var constructors = ['grid', 'structure', 'sequence'];
var basetypes = ['float32', 'float64', 'int32', 'int16', 'uint32', 'uint16', 'string', 'url'];

function tokenize(s, tokens) {
    out = [];
    while (s) {
        for (i = 0, token = tokens[i]; i < tokens.length; token = tokens[++i]) {
            m = token.exec(s);
            if (m) {
                if (m[0]) out.push(m[0]);
                s = s.substr(Math.max(m[0].length, 1));  // linefeed has zero length?
                break;
            }
        }
    }
    return out;
}

function parser(s, tokens) {
    this.stream = tokenize(s, tokens);

    // Peek next token.
    this.peek = function() {
        return this.stream[0];
    }

    // Pop next token.
    this.next = function() {
        return this.stream.splice(0, 1);
    }

    // Consume a token or raise exception.
    this.consume = function(token) {
        var next = this.next();
        if (token.toLowerCase() == next.toLowerCase()) {
            return token;
        } else {
            throw new Error("Found '" + next + "' (expected '" + token + "')");
        }
    }

    // Check if a token from the list is the next one.
    this.check = function(tokens) {
        next = this.peek();
        for (i = 0, token = tokens[i]; i < tokens.length; token = tokens[++i]) {
            if (token.toLowerCase() == next.toLowerCase()) return next;
        }
        return false;
    }

}

function ddsparser(s) {
    this.stream = tokenize(s, tokens);

    this.parse = function() {
        this.consume('dataset');
        this.consume('{');
        var dataset = {};

        // Read variables.
        while (this.check(constructors + basetypes)) {
            type = this.peek().toLowerCase();
            switch ...
            if (this.stream[0].toLowerCase() == 'grid') {
                grid = this.parsegrid();
                dataset[grid.name] = grid;
            } else {
                this.next();
            }
        }

        this.consume('}');
        dataset.name = this.next();
        this.consume(';');

        return dataset;
    }

    this.parsegrid = function() {
        var grid = {};
    }
}
ddsparser.prototype = new parser;

var test = new ddsparser(dds);
document.write(test.parse());
