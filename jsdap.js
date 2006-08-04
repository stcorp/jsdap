// jsdap, a JavaScript DAP client.
//
// Copyright (c) 2005 Roberto De Almeida <roberto@dealmeida.net>
// License: MIT

Array.prototype.contains = function (item) {
    for (i = 0, el = this[i]; i < this.length; el = this[++i]) {
        if (item == el) return true;
    }
    return false;
}

// Tokens for parsing the DDS and DAS.
var tokens = [
              /^"([\s\S]*?[^\\])"/m,            // quoted strings
              /^([\w.]+)/,                      // ids
              /^([{};:=\[\],])/,                // symbols
              /^(-?\d*(\.\d*)?(e(\+|-)\d+)?)/,   // numbers
              /^()[\s\n\r]+/,                   // whitespace
              /^([\s\S]+)/                      // capture all if no match
             ];

var constructors = ['grid', 'structure', 'sequence'];
var baseTypes = ['float32', 'float64', 'int32', 'int16', 'uint32', 'uint16', 'byte', 'string', 'url'];

function instanceOf(object, constructorFunction) {
    while (object != null) {
        if (object == constructorFunction.prototype) return true;
        object = object.__proto__;
    }
    return false;
}

function dapType () {
}

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

/* 
 * Simple parser implementation. 
 *
 * This parser implements some methods that helps when
 * building the DDS and DAS parser.
 */
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

function dasparser(das, dataset) {
    this.stream = tokenize(das, tokens);
    this.dataset = dataset;

    this.parse = function() {
        var target = this.dataset;
        
        this.consume('Attributes');
        this.consume('{');
        while (this.peek() != '}') {
            this.parseAttributes(target);
        }
        this.consume('}');

        return this.dataset;
    }

    this.parseAttributes = function(target) {
        if (target[this.peek()]) {
            var next = this.next();
            this.consume('{');
            this.parseAttributes(target[next]);
            this.consume('}');
        } else {
            while (this.peek() != '}') {
                this.parseMetadata(target.attributes);
            }
        }
    }

    this.parseMetadata = function(attributes) {
        var next = this.next();
        if (this.peek() == '{') {
            // hmmm... this is metadata
            var key = next;
            this.consume('{');
            var value = {}
            this.parseMetadata(value);
            this.consume('}');
        } else {
            var key = this.next();
            var value = [];
            value.push(this.next());
            while (this.peek() != ';') {
                this.consume(',');
                value.push(this.next());
            }
            this.consume(';');
        }
        attributes[key] = value;
    }
}
dasparser.prototype = new parser;

function ddsparser(dds) {
    this.stream = tokenize(dds, tokens);

    this.parse = function() {
        this.consume('dataset');
        this.consume('{');
        var dataset = new dapType;
        dataset.type = 'Dataset';
        dataset.attributes = {};

        // Read variables
        while (this.check(constructors.concat(baseTypes))) {
            var declaration = this.parseDeclaration();
            dataset[declaration.name] = declaration;
        }

        this.consume('}');
        dataset.name = this.next();
        this.consume(';');

        // Set the ids on the dataset
        function walk(dapvar) {
            for (attr in dapvar) {
                child = dapvar[attr];
                if (child.type) {
                    child.id = dapvar.id + '.' + child.name;
                    if (instanceOf(child, dapType)) walk(child);
                }
            }
        }
        for (attr in dataset) {
            dapvar = dataset[attr];
            if (dapvar.type) {
                dapvar.id = dapvar.name;
                if (instanceOf(dapvar, dapType)) walk(dapvar);
            }
        }

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
        var baseType = new dapType;
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
        var grid = new dapType;
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
        var structure = new dapType;
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
        var sequence = new dapType;
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
