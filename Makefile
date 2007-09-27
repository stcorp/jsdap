all: jsdap.js

jsdap.js: jsdap_tmp.js
	java -jar pack/js.jar pack/pack.js jsdap_tmp.js jsdap.js
	rm jsdap_tmp.js

jsdap_tmp.js: header.js parser.js xdr.js api.js
	cat {header,parser,xdr,api}.js > jsdap_tmp.js
