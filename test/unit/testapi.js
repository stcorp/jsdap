describe('api functions', function() {
    //The necessary require statements for testing against node
    if (typeof require !== 'undefined' && module.exports) {
        jsdap = require('../../src/api');
        parser = require('../../src/parser');
        xdr = require('../../src/xdr');
    }

    var globalReference = null; //'window' for the browser, global for Node.js

    if (typeof window !== 'undefined') {
        globalReference = window;
    }
    else {
        globalReference = global; //Node.js
    }

    var XML_READY_STATE_DONE = 4;

    describe('jsdap loadDataset', function() {
        it('should make a correct XMLHttpRequest request', function() {
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDASParser = Object();

            var dummyUrl = 'http://test.com/test.nc';

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

        it('should make a correct XMLHttpRequest request when a proxy is defined', function() {
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDASParser = Object();

            var dummyUrl = 'http://test.com/test.nc';
            var dummyProxy = 'http://testProxy.com';

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

    describe('jsdap loadData', function() {
        var dummyDODSResponse = 'dummyDDSPart' + '\nData:\n' + 'dummyDODSPart';

        //Helper method to convert a string to an array buffer
        //https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String?hl=en
        function stringToArrayBuffer(str) {
            var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
            var bufView = new Uint16Array(buf);

            for (var i=0, strLen=str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }

            return buf;
        }

        it('should make a correct XMLHttpRequest request using XHR2', function() {
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDAPUnpacker = Object();

            var dummyUrl = 'http://test.com/test.nc';

            var dodsDataView = new DataView(stringToArrayBuffer(dummyDODSResponse));

            spyOn(globalReference, 'XMLHttpRequest').and.callFake(function() {
                return dummyXMLHttpRequest;
            });

            spyOn(globalReference, 'DataView').and.callFake(function() {
                return dodsDataView;
            });

            dummyXMLHttpRequest.open = function(method, url, async) {
                expect(method).toEqual('GET');
                expect(url).toEqual(dummyUrl);
                expect(async).toEqual(true);

                dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                    expect(header).toEqual('Accept-Charset');
                    expect(value).toEqual('x-user-defined');
                };

                dummyXMLHttpRequest.send = function(data) {
                    expect(data).toEqual('');
                };

                dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                dummyXMLHttpRequest.responseBody = dummyDODSResponse;
            };

            spyOn(parser, 'ddsParser').and.callFake(function() {
                return dummyDDSParser;
            });

            dummyDDSParser.parse = function(dds) {
                //TODO: Check DDS
                return 'dummyDDSParsedDataset';
            };

            spyOn(xdr, 'dapUnpacker').and.callFake(function() {
                return dummyDAPUnpacker;
            });

            dummyDAPUnpacker.getValue = function(das, dataset) {
                //TODO: Check DAS, dataset
                return 'dummyDAPUnpackedValue';
            };

            function dummyCallback(data) {
                expect(data).toEqual('dummyDAPUnpackedValue');
            }

            jsdap.loadData(dummyUrl, dummyCallback, null);

            //Trigger the state changes
            dummyXMLHttpRequest.onreadystatechange();
        });

        it('should make a correct XMLHttpRequest request using response property', function() {
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDAPUnpacker = Object();

            var dummyUrl = 'http://test.com/test.nc';

            var dodsDataView = new DataView(stringToArrayBuffer(dummyDODSResponse));

            spyOn(globalReference, 'XMLHttpRequest').and.callFake(function() {
                return dummyXMLHttpRequest;
            });

            spyOn(globalReference, 'DataView').and.callFake(function() {
                return dodsDataView;
            });

            dummyXMLHttpRequest.open = function(method, url, async) {
                expect(method).toEqual('GET');
                expect(url).toEqual(dummyUrl);
                expect(async).toEqual(true);

                dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                    expect(header).toEqual('Accept-Charset');
                    expect(value).toEqual('x-user-defined');
                };

                dummyXMLHttpRequest.send = function(data) {
                    expect(data).toEqual('');
                };

                dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                dummyXMLHttpRequest.response = dummyDODSResponse;
            };

            spyOn(parser, 'ddsParser').and.callFake(function() {
                return dummyDDSParser;
            });

            dummyDDSParser.parse = function(dds) {
                //TODO: Check DDS
                return 'dummyDDSParsedDataset';
            };

            spyOn(xdr, 'dapUnpacker').and.callFake(function() {
                return dummyDAPUnpacker;
            });

            dummyDAPUnpacker.getValue = function(das, dataset) {
                //TODO: Check DAS, dataset
                return 'dummyDAPUnpackedValue';
            };

            function dummyCallback(data) {
                expect(data).toEqual('dummyDAPUnpackedValue');
            }

            jsdap.loadData(dummyUrl, dummyCallback, null);

            //Trigger the state changes
            dummyXMLHttpRequest.onreadystatechange();
        });

        it('should make a correct XMLHttpRequest request using mozResponseArrayBuffer property', function() {
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDAPUnpacker = Object();

            var dummyUrl = 'http://test.com/test.nc';

            var dodsDataView = new DataView(stringToArrayBuffer(dummyDODSResponse));

            spyOn(globalReference, 'XMLHttpRequest').and.callFake(function() {
                return dummyXMLHttpRequest;
            });

            spyOn(globalReference, 'DataView').and.callFake(function() {
                return dodsDataView;
            });

            dummyXMLHttpRequest.open = function(method, url, async) {
                expect(method).toEqual('GET');
                expect(url).toEqual(dummyUrl);
                expect(async).toEqual(true);

                dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                    expect(header).toEqual('Accept-Charset');
                    expect(value).toEqual('x-user-defined');
                };

                dummyXMLHttpRequest.send = function(data) {
                    expect(data).toEqual('');
                };

                dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                dummyXMLHttpRequest.mozResponseArrayBuffer = dummyDODSResponse;
            };

            spyOn(parser, 'ddsParser').and.callFake(function() {
                return dummyDDSParser;
            });

            dummyDDSParser.parse = function(dds) {
                //TODO: Check DDS
                return 'dummyDDSParsedDataset';
            };

            spyOn(xdr, 'dapUnpacker').and.callFake(function() {
                return dummyDAPUnpacker;
            });

            dummyDAPUnpacker.getValue = function(das, dataset) {
                //TODO: Check DAS, dataset
                return 'dummyDAPUnpackedValue';
            };

            function dummyCallback(data) {
                expect(data).toEqual('dummyDAPUnpackedValue');
            }

            jsdap.loadData(dummyUrl, dummyCallback, null);

            //Trigger the state changes
            dummyXMLHttpRequest.onreadystatechange();
        });

        it('should make a correct XMLHttpRequest request using a proxy', function() {
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDAPUnpacker = Object();

            var dummyUrl = 'http://test.com/test.nc';
            var dummyProxy = 'http://testProxy.com';

            var dodsDataView = new DataView(stringToArrayBuffer(dummyDODSResponse));

            spyOn(globalReference, 'XMLHttpRequest').and.callFake(function() {
                return dummyXMLHttpRequest;
            });

            spyOn(globalReference, 'DataView').and.callFake(function() {
                return dodsDataView;
            });

            dummyXMLHttpRequest.open = function(method, url, async) {
                expect(method).toEqual('GET');
                expect(url).toEqual(dummyProxy + '?url=' + encodeURIComponent(dummyUrl));
                expect(async).toEqual(true);

                dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                    expect(header).toEqual('Accept-Charset');
                    expect(value).toEqual('x-user-defined');
                };

                dummyXMLHttpRequest.send = function(data) {
                    expect(data).toEqual('');
                };

                dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                dummyXMLHttpRequest.responseBody = dummyDODSResponse;
            };

            spyOn(parser, 'ddsParser').and.callFake(function() {
                return dummyDDSParser;
            });

            dummyDDSParser.parse = function(dds) {
                //TODO: Check DDS
                return 'dummyDDSParsedDataset';
            };

            spyOn(xdr, 'dapUnpacker').and.callFake(function() {
                return dummyDAPUnpacker;
            });

            dummyDAPUnpacker.getValue = function(das, dataset) {
                //TODO: Check DAS, dataset
                return 'dummyDAPUnpackedValue';
            };

            function dummyCallback(data) {
                expect(data).toEqual('dummyDAPUnpackedValue');
            }

            jsdap.loadData(dummyUrl, dummyCallback, dummyProxy);

            //Trigger the state changes
            dummyXMLHttpRequest.onreadystatechange();
        });
    });

    describe('jsdap loadDataAndDDS', function() {
        var dummyDODSResponse = 'dummyDDSPart' + '\nData:\n' + 'dummyDODSPart';

        //Helper method to convert a string to an array buffer
        //https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String?hl=en
        function stringToArrayBuffer(str) {
            var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
            var bufView = new Uint16Array(buf);

            for (var i=0, strLen=str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }

            return buf;
        }

        it('should make a correct XMLHttpRequest request using XHR2', function() {
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDAPUnpacker = Object();

            var dummyUrl = 'http://test.com/test.nc';

            var dodsDataView = new DataView(stringToArrayBuffer(dummyDODSResponse));

            spyOn(globalReference, 'XMLHttpRequest').and.callFake(function() {
                return dummyXMLHttpRequest;
            });

            spyOn(globalReference, 'DataView').and.callFake(function() {
                return dodsDataView;
            });

            dummyXMLHttpRequest.open = function(method, url, async) {
                expect(method).toEqual('GET');
                expect(url).toEqual(dummyUrl);
                expect(async).toEqual(true);

                dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                    expect(header).toEqual('Accept-Charset');
                    expect(value).toEqual('x-user-defined');
                };

                dummyXMLHttpRequest.send = function(data) {
                    expect(data).toEqual('');
                };

                dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                dummyXMLHttpRequest.responseBody = dummyDODSResponse;
            };

            spyOn(parser, 'ddsParser').and.callFake(function() {
                return dummyDDSParser;
            });

            dummyDDSParser.parse = function(dds) {
                //TODO: Check DDS
                return 'dummyDDSParsedDataset';
            };

            spyOn(xdr, 'dapUnpacker').and.callFake(function() {
                return dummyDAPUnpacker;
            });

            dummyDAPUnpacker.getValue = function(das, dataset) {
                //TODO: Check DAS, dataset
                return 'dummyDAPUnpackedValue';
            };

            function dummyCallback(data) {
                expect(data).toEqual({dds: 'dummyDDSParsedDataset', data: 'dummyDAPUnpackedValue'});
            }

            jsdap.loadDataAndDDS(dummyUrl, dummyCallback, null);

            //Trigger the state changes
            dummyXMLHttpRequest.onreadystatechange();
        });

        it('should make a correct XMLHttpRequest request using response property', function() {
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDAPUnpacker = Object();

            var dummyUrl = 'http://test.com/test.nc';

            var dodsDataView = new DataView(stringToArrayBuffer(dummyDODSResponse));

            spyOn(globalReference, 'XMLHttpRequest').and.callFake(function() {
                return dummyXMLHttpRequest;
            });

            spyOn(globalReference, 'DataView').and.callFake(function() {
                return dodsDataView;
            });

            dummyXMLHttpRequest.open = function(method, url, async) {
                expect(method).toEqual('GET');
                expect(url).toEqual(dummyUrl);
                expect(async).toEqual(true);

                dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                    expect(header).toEqual('Accept-Charset');
                    expect(value).toEqual('x-user-defined');
                };

                dummyXMLHttpRequest.send = function(data) {
                    expect(data).toEqual('');
                };

                dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                dummyXMLHttpRequest.response = dummyDODSResponse;
            };

            spyOn(parser, 'ddsParser').and.callFake(function() {
                return dummyDDSParser;
            });

            dummyDDSParser.parse = function(dds) {
                //TODO: Check DDS
                return 'dummyDDSParsedDataset';
            };

            spyOn(xdr, 'dapUnpacker').and.callFake(function() {
                return dummyDAPUnpacker;
            });

            dummyDAPUnpacker.getValue = function(das, dataset) {
                //TODO: Check DAS, dataset
                return 'dummyDAPUnpackedValue';
            };

            function dummyCallback(data) {
                expect(data).toEqual({dds: 'dummyDDSParsedDataset', data: 'dummyDAPUnpackedValue'});
            }

            jsdap.loadDataAndDDS(dummyUrl, dummyCallback, null);

            //Trigger the state changes
            dummyXMLHttpRequest.onreadystatechange();
        });

        it('should make a correct XMLHttpRequest request using mozResponseArrayBuffer property', function() {
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDAPUnpacker = Object();

            var dummyUrl = 'http://test.com/test.nc';

            var dodsDataView = new DataView(stringToArrayBuffer(dummyDODSResponse));

            spyOn(globalReference, 'XMLHttpRequest').and.callFake(function() {
                return dummyXMLHttpRequest;
            });

            spyOn(globalReference, 'DataView').and.callFake(function() {
                return dodsDataView;
            });

            dummyXMLHttpRequest.open = function(method, url, async) {
                expect(method).toEqual('GET');
                expect(url).toEqual(dummyUrl);
                expect(async).toEqual(true);

                dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                    expect(header).toEqual('Accept-Charset');
                    expect(value).toEqual('x-user-defined');
                };

                dummyXMLHttpRequest.send = function(data) {
                    expect(data).toEqual('');
                };

                dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                dummyXMLHttpRequest.mozResponseArrayBuffer = dummyDODSResponse;
            };

            spyOn(parser, 'ddsParser').and.callFake(function() {
                return dummyDDSParser;
            });

            dummyDDSParser.parse = function(dds) {
                //TODO: Check DDS
                return 'dummyDDSParsedDataset';
            };

            spyOn(xdr, 'dapUnpacker').and.callFake(function() {
                return dummyDAPUnpacker;
            });

            dummyDAPUnpacker.getValue = function(das, dataset) {
                //TODO: Check DAS, dataset
                return 'dummyDAPUnpackedValue';
            };

            function dummyCallback(data) {
                expect(data).toEqual({dds: 'dummyDDSParsedDataset', data: 'dummyDAPUnpackedValue'});
            }

            jsdap.loadDataAndDDS(dummyUrl, dummyCallback, null);

            //Trigger the state changes
            dummyXMLHttpRequest.onreadystatechange();
        });

        it('should make a correct XMLHttpRequest request using a proxy', function() {
            var dummyXMLHttpRequest = Object();
            var dummyDDSParser = Object();
            var dummyDAPUnpacker = Object();

            var dummyUrl = 'http://test.com/test.nc';
            var dummyProxy = 'http://testProxy.com';

            var dodsDataView = new DataView(stringToArrayBuffer(dummyDODSResponse));

            spyOn(globalReference, 'XMLHttpRequest').and.callFake(function() {
                return dummyXMLHttpRequest;
            });

            spyOn(globalReference, 'DataView').and.callFake(function() {
                return dodsDataView;
            });

            dummyXMLHttpRequest.open = function(method, url, async) {
                expect(method).toEqual('GET');
                expect(url).toEqual(dummyProxy + '?url=' + encodeURIComponent(dummyUrl));
                expect(async).toEqual(true);

                dummyXMLHttpRequest.setRequestHeader = function(header, value) {
                    expect(header).toEqual('Accept-Charset');
                    expect(value).toEqual('x-user-defined');
                };

                dummyXMLHttpRequest.send = function(data) {
                    expect(data).toEqual('');
                };

                dummyXMLHttpRequest.readyState = XML_READY_STATE_DONE;

                dummyXMLHttpRequest.responseBody = dummyDODSResponse;
            };

            spyOn(parser, 'ddsParser').and.callFake(function() {
                return dummyDDSParser;
            });

            dummyDDSParser.parse = function(dds) {
                //TODO: Check DDS
                return 'dummyDDSParsedDataset';
            };

            spyOn(xdr, 'dapUnpacker').and.callFake(function() {
                return dummyDAPUnpacker;
            });

            dummyDAPUnpacker.getValue = function(das, dataset) {
                //TODO: Check DAS, dataset
                return 'dummyDAPUnpackedValue';
            };

            function dummyCallback(data) {
                expect(data).toEqual({dds: 'dummyDDSParsedDataset', data: 'dummyDAPUnpackedValue'});
            }

            jsdap.loadDataAndDDS(dummyUrl, dummyCallback, dummyProxy);

            //Trigger the state changes
            dummyXMLHttpRequest.onreadystatechange();
        });
    });
});
