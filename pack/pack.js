load("pack/js/writeFile.js");
load("pack/js/base2.js");
load("pack/js/Packer.js");
load("pack/js/Words.js");

// arguments
var inFile = arguments[0];
var outFile = arguments[1] || inFile.replace(/\.js$/, ".pack.js");

// options
var base62 = true;
var shrink = true;

var script = readFile(inFile);
var header = script.match(/\/\*(.|\n)*?\*\//)[0];
var packer = new Packer;
var packedScript = packer.pack(script, base62, shrink);

writeFile(outFile, header + "\n" + packedScript);
