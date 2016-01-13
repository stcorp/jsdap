describe('xdr functions', function() {
    describe('dap unpacker', function() {
        function buildDODSBuffer(dds, type, data) {
            //Define some sizes in bytes
            var UINT8_SIZE = 1;
            var UINT32_SIZE = 4;

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
            else if (type === 'Uint32') {
                dataLength += (data.length * UINT32_SIZE);
            }
            else if (type === 'String') {
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
                    bufferIndex += 1;
                }
                else if (valueType === 'Uint32') {
                    outputView.setUint32(bufferIndex, value);
                    bufferIndex += 4;
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
