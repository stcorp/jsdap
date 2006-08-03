Array.prototype.contains = function (item) {
    for (i = 0, el = this[i]; i < this.length; el = this[++i]) {
        if (item == el) return true;
    }
    return false;
}

String.prototype.join = function (list) {
    out = list[0];
    for (i = 1, el = list[i]; i < list.length; el = list[++i]) {
        out += this;
        out += el;
    }
    return out;
}

var tokens = [/^([\w.]+)/,              // ids
              /^([{};:=\[\],])/,        // symbols
              /^("[\s\S]+?[^\\]")/m,    // quoted strings
              /^(-?\d*(\.\d*)?)/,       // numbers
              /^()[\s\n\r]+/,           // whitespace
              /^([\s\S]+)/              // capture all if no match
             ];

var constructors = ['grid', 'structure', 'sequence'];
var baseTypes = ['float32', 'float64', 'int32', 'int16', 'uint32', 'uint16', 'string', 'url'];

function tokenize(s, tokens) {
    var out = [];
    while (s) {
        for (i = 0, token = tokens[i]; i < tokens.length; token = tokens[++i]) {
            var m = token.exec(s);
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
        return this.stream.splice(0, 1)[0];
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
        var next = this.peek();
        for (i = 0, token = tokens[i]; i < tokens.length; token = tokens[++i]) {
            if (token.toLowerCase() == next.toLowerCase()) return next;
        }
        return false;
    }

}

function ddsparser(dds) {
    this.stream = tokenize(dds, tokens);

    this.parse = function() {
        this.consume('dataset');
        this.consume('{');
        var dataset = {};
        dataset.type = 'Dataset';
        dataset.attributes = {};

        // Read variables.
        while (this.check(constructors.concat(baseTypes))) {
            var declaration = this.parseDeclaration();
            dataset[declaration.name] = declaration;
        }

        this.consume('}');
        dataset.name = this.next();
        this.consume(';');

        return dataset;
    }

    this.parseDeclaration = function () {
        var type = this.peek().toLowerCase();
        switch (type) {
            case 'grid':      return this.parseGrid();
            case 'structure': return this.parseStructure();
            case 'sequence':  return this.parseSequence();
            default:          return this.parseBaseType();
        }
    }

    this.parseBaseType = function() {
        var baseType = {};
        baseType.type = this.next();
        baseType.name = this.next();
        baseType.attributes = {};
        
        baseType.dimensions = [];
        baseType.shape = [];
        while (this.peek() != ';') {
            this.consume('[');
            var tmp = this.next();
            if (this.peek() == ']') {
                baseType.shape.push(tmp);  // unnamed dimension
            } else {
                baseType.dimensions.push(tmp); // named dimension
                this.consume('=');
                baseType.shape.push(this.next());
            }
            this.consume(']');
        }
        this.consume(';');

        return baseType;
    }

    this.parseGrid = function() {
        var grid = {};
        grid.type = 'Grid';
        grid.attributes = {};

        this.consume('grid');
        this.consume('{');
        this.consume('Array');
        this.consume(':');
        grid.array = this.parseDeclaration();

        this.consume('Maps');
        this.consume(':');
        grid.maps = {};
        while (this.peek() != '}') {
            var map_ = this.parseBaseType();
            grid.maps[map_.name] = map_;
        }
        this.consume('}');
        grid.name = this.next();
        this.consume(';');
        
        return grid;
    }

    this.parseStructure = function() {
        var structure = {};
        structure.type = 'Structure';
        structure.attributes = {};

        this.consume('structure');
        this.consume('{');
        
        while (this.peek() != '}') {
            var declaration = this.parseDeclaration();
            structure[declaration.name] = declaration;
        }
        this.consume('}');
        structure.name = this.next();
        this.consume(';');

        return structure;
    }

    this.parseSequence = function() {
        var sequence = {};
        sequence.type = 'Sequence';
        sequence.attributes = {};

        this.consume('sequence');
        this.consume('{');

        while (this.peek() != '}') {
            var declaration = this.parseDeclaration();
            sequence[declaration.name] = declaration;
        }
        this.consume('}');
        sequence.name = this.next();
        this.consume(';');

        return sequence;
    }
}
ddsparser.prototype = new parser;
