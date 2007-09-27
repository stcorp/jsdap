all: jsdap.js

jsdap.js: jsdap_tmp.js
	javar -jar pack/js.jar pack/pack.js jsdap_tmp.js jsdap.js
	rm jsdap_tmp.js

jsdap_tmp.js: parser.js xdr.js api.js
	cat {parser,xdr,api}.js > jsdap_tmp.js
