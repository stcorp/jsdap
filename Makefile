all: jsdap.pack.js

jsdap.pack.js: jsdap.js
	java -jar compiler/compiler.jar --js=jsdap.js --js_output_file=jsdap.pack.js
	cp jsdap.pack.js examples/js

jsdap.js: src/header.js src/parser.js src/xdr.js src/api.js src/vbscript.js
	cat src/header.js src/hack.js src/parser.js src/xdr.js src/api.js src/vbscript.js > jsdap.js
	cp jsdap.js examples/js

clean:
	rm jsdap.pack.js examples/js/jsdap.pack.js
	rm jsdap.js examples/js/jsdap.js
