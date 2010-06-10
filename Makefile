all: jsdap.pack.js

jsdap.pack.js: jsdap.js
	java -jar compiler/compiler.jar --js=jsdap.js --js_output_file=jsdap.pack.js
	cp jsdap.pack.js examples/js

jsdap.js: header.js parser.js xdr.js api.js vbscript.js
	cat header.js parser.js xdr.js api.js vbscript.js > jsdap.js
	cp jsdap.js examples/js
