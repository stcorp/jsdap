describe('api functions', function() {
    //The necessary require statements for testing against node
    if (typeof require !== 'undefined' && module.exports) {
        jsdap = require('../../src/api');
        parser = require('../../src/parser');
    }

    var XML_READY_STATE_DONE = 4;

    describe('jsdap loadDataset', function() {
        it('should make a correct proxyUrl request', function() {
            var globalReference = null; //'window' for the browser, global for Node.js
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDASParser = Object();

            var dummyUrl = 'http://test.com/test.nc';

            if (typeof window !== 'undefined') {
                globalReference = window;
            }
            else {
                globalReference = global; //Node.js
            }

            spyOn(globalReference, 'XMLHttpRequest').and.callFake(function() {
                return dummyXMLHttpRequest;
            });

            dummyXMLHttpRequest.open = function(method, url, async) {
                expect(method).toEqual('GET');
                expect(async).toEqual(true);

                if (url === dummyUrl + '.dds') {
                    dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                        expect(header).toEqual('Accept-Charset');
                        expect(value).toEqual('x-user-defined');
                    };

                    dummyXMLHttpRequest.send = function(data) {
                        expect(data).toEqual('');
                    };

                    dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                    dummyXMLHttpRequest.responseText = 'dummyDDSResponseBody';
                }
                else if (url === dummyUrl + '.das') {
                    dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                        expect(header).toEqual('Accept-Charset');
                        expect(value).toEqual('x-user-defined');
                    };

                    dummyXMLHttpRequest.send = function(data) {
                        expect(data).toEqual('');
                    };

                    dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                    dummyXMLHttpRequest.responseText = 'dummyDASResponseBody';
                }
                else {
                    throw new Error('Unrecognized url ' + url);
                }
            };

            spyOn(parser, 'ddsParser').and.callFake(function() {
                return dummyDDSParser;
            });

            dummyDDSParser.parse = function(dds) {
                //TODO: Check DDS
                return 'dummyDDSParsedDataset';
            };

            spyOn(parser, 'dasParser').and.callFake(function() {
                return dummyDASParser;
            });

            dummyDASParser.parse = function(das, dataset) {
                //TODO: Check DAS, dataset
                return 'dummyDASParsedDataset';
            };

            function dummyCallback(data) {
                expect(data).toEqual('dummyDASParsedDataset');
            }

            jsdap.loadDataset(dummyUrl, dummyCallback, null);

            //Trigger the state changes
            dummyXMLHttpRequest.onreadystatechange();
            dummyXMLHttpRequest.onreadystatechange();
        });

        it('should make a correct proxyUrl request when a proxy is defined', function() {
            var globalReference = null; //'window' for the browser, global for Node.js
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDASParser = Object();

            var dummyUrl = 'http://test.com/test.nc';
            var dummyProxy = 'http://testProxy.com';

            if (typeof window !== 'undefined') {
                globalReference = window;
            }
            else {
                globalReference = global; //Node.js
            }

            spyOn(globalReference, 'XMLHttpRequest').and.callFake(function() {
                return dummyXMLHttpRequest;
            });

            dummyXMLHttpRequest.open = function(method, url, async) {
                expect(method).toEqual('GET');
                expect(async).toEqual(true);

                if (url === dummyProxy + '?url=' + encodeURIComponent(dummyUrl + '.dds')) {
                    dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                        expect(header).toEqual('Accept-Charset');
                        expect(value).toEqual('x-user-defined');
                    };

                    dummyXMLHttpRequest.send = function(data) {
                        expect(data).toEqual('');
                    };

                    dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                    dummyXMLHttpRequest.responseText = 'dummyDDSResponseBody';
                }
                else if (url === dummyProxy + '?url=' + encodeURIComponent(dummyUrl + '.das')) {
                    dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                        expect(header).toEqual('Accept-Charset');
                        expect(value).toEqual('x-user-defined');
                    };

                    dummyXMLHttpRequest.send = function(data) {
                        expect(data).toEqual('');
                    };

                    dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                    dummyXMLHttpRequest.responseText = 'dummyDASResponseBody';
                }
                else {
                    throw new Error('Unrecognized url ' + url);
                }
            };

            spyOn(parser, 'ddsParser').and.callFake(function() {
                return dummyDDSParser;
            });

            dummyDDSParser.parse = function(dds) {
                //TODO: Check DDS
                return 'dummyDDSParsedDataset';
            };

            spyOn(parser, 'dasParser').and.callFake(function() {
                return dummyDASParser;
            });

            dummyDASParser.parse = function(das, dataset) {
                //TODO: Check DAS, dataset
                return 'dummyDASParsedDataset';
            };

            function dummyCallback(data) {
                expect(data).toEqual('dummyDASParsedDataset');
            }

            jsdap.loadDataset(dummyUrl, dummyCallback, dummyProxy);

            //Trigger the state changes
            dummyXMLHttpRequest.onreadystatechange();
            dummyXMLHttpRequest.onreadystatechange();
        });
    });
});
