all: jsdap.js

jsdap.js: jsdap_tmp.js
	java -jar pack/js.jar pack/pack.js jsdap_tmp.js jsdap.js
	rm jsdap_tmp.js
	cp jsdap.js examples/js

jsdap_tmp.js: header.js parser.js xdr.js api.js vbscript.js
	cat header.js parser.js xdr.js api.js vbscript.js > jsdap_tmp.js
