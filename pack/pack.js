load("js/writeFile.js");
load("js/base2.js");
load("js/Packer.js");
load("js/Words.js");

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
