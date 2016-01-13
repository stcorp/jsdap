describe('xdr functions', function() {
    describe('dap unpacker', function() {
        function buildDODSBuffer(dds, type, data) {
            //Define some sizes in bytes
            var UINT8_SIZE = 1; //Uint8 == Byte
            var INT32_SIZE = 4;
            var UINT32_SIZE = 4;
            var INT16_SIZE = 2;
            var UINT16_SIZE = 2;
            var FLOAT32_SIZE = 4;
            var FLOAT64_SIZE = 8;

            //Calculate the required buffer size
            //var dataLength = (dds.length * UINT8_SIZE) + (DATA_START_STRING.length * UINT8_SIZE);
            var dataLength =  0;

            if (data.length > 1) {
                dataLength += UINT32_SIZE; //The length is added at the beginning of the data

                if (type !== 'Url' && type !== 'String') {
                    dataLength += UINT32_SIZE; //Start marker
                }
            }

            if (type === 'Byte') {
                dataLength += (data.length * UINT8_SIZE);
            }
            else if (type === 'Int32' || type === 'Int') {
                dataLength += (data.length * INT32_SIZE);
            }
            else if (type === 'Uint32' || type === 'Uint') {
                dataLength += (data.length * UINT32_SIZE);
            }
            else if (type === 'Int16') {
                dataLength += (data.length * INT16_SIZE);
            }
            else if (type === 'Uint16') {
                dataLength += (data.length * UINT16_SIZE);
            }
            else if (type === 'Float32') {
                dataLength += (data.length * FLOAT32_SIZE);
            }
            else if (type === 'Float64') {
                dataLength += (data.length * FLOAT64_SIZE);
            }
            else if (type === 'String' || type === 'Url') {
                dataLength += (data.length * UINT8_SIZE);
            }

            //Create the buffer
            var outputBuffer = new ArrayBuffer(dataLength);
            var outputView = new DataView(outputBuffer);

            //Set up our buffer writer
            var bufferIndex = 0;

            function _writeValueToOutputBuffer(valueType, value) {
                if (valueType === 'Byte') {
                    outputView.setUint8(bufferIndex, value);
                    bufferIndex += UINT8_SIZE;
                }
                else if (valueType === 'Int32' || valueType === 'Int') {
                    outputView.setInt32(bufferIndex, value);
                    bufferIndex += INT32_SIZE;
                }
                else if (valueType === 'Uint32' || valueType === 'Uint') {
                    outputView.setUint32(bufferIndex, value);
                    bufferIndex += UINT32_SIZE;
                }
                else if (valueType === 'Int16') {
                    outputView.setInt16(bufferIndex, value);
                    bufferIndex += INT16_SIZE;
                }
                else if (valueType === 'Uint16') {
                    outputView.setUint16(bufferIndex, value);
                    bufferIndex += INT16_SIZE;
                }
                else if (valueType === 'Float32') {
                    outputView.setFloat32(bufferIndex, value);
                    bufferIndex += FLOAT32_SIZE;
                }
                else if (valueType === 'Float64') {
                    outputView.setFloat64(bufferIndex, value);
                    bufferIndex += FLOAT64_SIZE;
                }
                else if (valueType === 'String' || valueType === 'Url') {
                    for (var charIndex = 0; charIndex < value.length; charIndex++) {
                        _writeValueToOutputBuffer('Byte', value.charCodeAt(charIndex) & 0x00ff);
                    }
                }
            }

            if (data.length > 1) {
                //Write the length
                _writeValueToOutputBuffer('Uint32', data.length);

                if (type !== 'Url' && type !== 'String') {
                    _writeValueToOutputBuffer('Uint32', 0); //Start marker
                }

                //Write the data
                if (type === 'String' || type === 'Url') {
                    _writeValueToOutputBuffer(type, data);
                }
                else {
                    for (var i = 0; i < data.length; i++) {
                        _writeValueToOutputBuffer(type, data[i]);
                    }
                }
            }

            return outputBuffer;
        }

        function buildDASVar(type, dimensions, shape) {
            var testDapType = new dapType(type);

            testDapType.name = 'TEST';
            testDapType.dimensions = dimensions;
            testDapType.shape = shape;
            testDapType.id = 'TEST';

            return testDapType;
        }

        it('should unpack a byte', function() {
            var testDDS = 'Dataset {Byte TEST[TEST = 2];} test%2Enc;';
            var testDASVar = buildDASVar('Byte', ['TEST'], [2]);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'Byte', [0x00, 0xff]);

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([0x00, 0xff]);
        });

        it('should unpack an int', function() {
            var testDDS = 'Dataset {Int TEST[TEST = 2];} test%2Enc;';
            var testDASVar = buildDASVar('Int', ['TEST'], [2]);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'Int', [Math.pow(2, 31) - 1, -Math.pow(2, 31)]); //Highest most bit is sign bit

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([Math.pow(2, 31) - 1, -Math.pow(2, 31)]);
        });

        it('should unpack an uint', function() {
            var testDDS = 'Dataset {Uint TEST[TEST = 2];} test%2Enc;';
            var testDASVar = buildDASVar('Uint', ['TEST'], [2]);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'Uint', [0, Math.pow(2, 32) - 1]);

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([0, Math.pow(2, 32) - 1]);
        });

        it('should unpack an int16', function() {
            var testDDS = 'Dataset {Int16 TEST[TEST = 2];} test%2Enc;';
            var testDASVar = buildDASVar('Int16', ['TEST'], [2]);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'Int16', [Math.pow(2, 15) - 1, -Math.pow(2, 15)]); //Highest most bit is sign bit

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([Math.pow(2, 15) - 1, -Math.pow(2, 15)]);
        });

        it('should unpack an uint16', function() {
            var testDDS = 'Dataset {Uint16 TEST[TEST = 2];} test%2Enc;';
            var testDASVar = buildDASVar('Uint16', ['TEST'], [2]);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'Uint16', [0, -Math.pow(2, 16) - 1]); //Highest most bit is sign bit

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([0, Math.pow(2, 16) - 1]);
        });

        it('should unpack an int32', function() {
            var testDDS = 'Dataset {Int32 TEST[TEST = 2];} test%2Enc;';
            var testDASVar = buildDASVar('Int32', ['TEST'], [2]);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'Int32', [Math.pow(2, 31) - 1, -Math.pow(2, 31)]); //Highest most bit is sign bit

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([Math.pow(2, 31) - 1, -Math.pow(2, 31)]);
        });

        it('should unpack an uint32', function() {
            var testDDS = 'Dataset {Uint32 TEST[TEST = 2];} test%2Enc;';
            var testDASVar = buildDASVar('Uint32', ['TEST'], [2]);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'Uint32', [0, Math.pow(2, 32) - 1]);

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([0, Math.pow(2, 32) - 1]);
        });

        it('should unpack a float32', function() {
            var testDDS = 'Dataset {Float32 TEST[TEST = 3];} test%2Enc;';
            var testDASVar = buildDASVar('Float32', ['TEST'], [3]);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'Float32', [Math.pow(2, -126), Math.pow(2, -149), (2 - Math.pow(2, -23)) * Math.pow(2, 127)]); //minimum positive normal, minimum positive denormal, and max value

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([Math.pow(2, -126), Math.pow(2, -149), (2 - Math.pow(2, -23)) * Math.pow(2, 127)]);
        });

        it('should unpack a float64', function() {
            var testDDS = 'Dataset {Float64 TEST[TEST = 3];} test%2Enc;';
            var testDASVar = buildDASVar('Float64', ['TEST'], [3]);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'Float64', [Math.pow(2, -1022), Math.pow(2, -1074), (1 + (1 - Math.pow(2, -52))) * Math.pow(2, 1023)]); //minimum positive normal, minimum positive denormal, and max value

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([Math.pow(2, -1022), Math.pow(2, -1074), (1 + (1 - Math.pow(2, -52))) * Math.pow(2, 1023)]);
        });

        it('should unpack a string', function() {
            var testDDS = 'Dataset {String TEST;} test%2Enc;';
            var testDASVar = buildDASVar('String', [], []);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'String', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ;-_');

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ;-_');
        });

        it('should unpack an url', function() {
            var testDDS = 'Dataset {Url TEST;} test%2Enc;';
            var testDASVar = buildDASVar('Url', [], []);
            var testDODSBuffer = buildDODSBuffer(testDDS, 'Url', 'http://test.com');

            var result = new dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual('http://test.com');
        });
    });

    describe('buffer creation', function() {
        it('should convert a text array to an arrayBuffer, truncating UTF8 to 8 bits', function() {
            var testData = String.fromCharCode(0x0000, 0x00ff, 0xff00, 0xffff);

            var result = getBuffer(testData);
            var resultDataView = new DataView(result);

            expect(resultDataView.byteLength).toBe(4);
            expect(resultDataView.getUint8(0)).toEqual(0x00);
            expect(resultDataView.getUint8(1)).toEqual(0xff);
            expect(resultDataView.getUint8(2)).toEqual(0x00);
            expect(resultDataView.getUint8(3)).toEqual(0xff);
        });
    });
});
