describe('xdr functions', function() {
    //The necessary require statements for testing against node
    if (typeof require !== 'undefined' && module.exports) {
        parser = require('../../src/parser');
        xdr = require('../../src/xdr');
    }

    describe('dap unpacker', function() {
        //Define some sizes in bytes
        var UINT8_SIZE = 1; //Uint8 == Byte
        var INT32_SIZE = 4;
        var UINT32_SIZE = 4;
        var INT16_SIZE = 2;
        var UINT16_SIZE = 2;
        var FLOAT32_SIZE = 4;
        var FLOAT64_SIZE = 8;

        function buildDODSBuffer(type, data) {
            //Calculate the required buffer size
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

        function buildDASVar(type, shape) {
            var testDapType = new parser.dapType(type);

            testDapType.name = 'TEST';
            testDapType.shape = shape;
            testDapType.id = 'TEST';

            return testDapType;
        }

        it('should unpack a byte', function() {
            var testDASVar = buildDASVar('Byte', [2]);
            var testDODSBuffer = buildDODSBuffer('Byte', [0x00, 0xff]);

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([0x00, 0xff]);
        });

        it('should unpack an int', function() {
            var testDASVar = buildDASVar('Int', [2]);
            var testDODSBuffer = buildDODSBuffer('Int', [Math.pow(2, 31) - 1, -Math.pow(2, 31)]); //Highest most bit is sign bit

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([Math.pow(2, 31) - 1, -Math.pow(2, 31)]);
        });

        it('should unpack an uint', function() {
            var testDASVar = buildDASVar('Uint', [2]);
            var testDODSBuffer = buildDODSBuffer('Uint', [0, Math.pow(2, 32) - 1]);

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([0, Math.pow(2, 32) - 1]);
        });

        it('should unpack an int16', function() {
            var testDASVar = buildDASVar('Int16', [2]);
            var testDODSBuffer = buildDODSBuffer('Int16', [Math.pow(2, 15) - 1, -Math.pow(2, 15)]); //Highest most bit is sign bit

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([Math.pow(2, 15) - 1, -Math.pow(2, 15)]);
        });

        it('should unpack an uint16', function() {
            var testDASVar = buildDASVar('Uint16', [2]);
            var testDODSBuffer = buildDODSBuffer('Uint16', [0, -Math.pow(2, 16) - 1]); //Highest most bit is sign bit

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([0, Math.pow(2, 16) - 1]);
        });

        it('should unpack an int32', function() {
            var testDASVar = buildDASVar('Int32', [2]);
            var testDODSBuffer = buildDODSBuffer('Int32', [Math.pow(2, 31) - 1, -Math.pow(2, 31)]); //Highest most bit is sign bit

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([Math.pow(2, 31) - 1, -Math.pow(2, 31)]);
        });

        it('should unpack an uint32', function() {
            var testDASVar = buildDASVar('Uint32', [2]);
            var testDODSBuffer = buildDODSBuffer('Uint32', [0, Math.pow(2, 32) - 1]);

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([0, Math.pow(2, 32) - 1]);
        });

        it('should unpack a float32', function() {
            var testDASVar = buildDASVar('Float32', [3]);
            var testDODSBuffer = buildDODSBuffer('Float32', [Math.pow(2, -126), Math.pow(2, -149), (2 - Math.pow(2, -23)) * Math.pow(2, 127)]); //minimum positive normal, minimum positive denormal, and max value

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([Math.pow(2, -126), Math.pow(2, -149), (2 - Math.pow(2, -23)) * Math.pow(2, 127)]);
        });

        it('should unpack a float64', function() {
            var testDASVar = buildDASVar('Float64', [3]);
            var testDODSBuffer = buildDODSBuffer('Float64', [Math.pow(2, -1022), Math.pow(2, -1074), (1 + (1 - Math.pow(2, -52))) * Math.pow(2, 1023)]); //minimum positive normal, minimum positive denormal, and max value

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual([Math.pow(2, -1022), Math.pow(2, -1074), (1 + (1 - Math.pow(2, -52))) * Math.pow(2, 1023)]);
        });

        it('should unpack a string', function() {
            var testString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ;-_\\\\"/\\\'[](){}';

            var testDASVar = buildDASVar('String', []);
            var testDODSBuffer = buildDODSBuffer('String', testString);

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual(testString);
        });

        it('should unpack an url', function() {
            var testDASVar = buildDASVar('Url', []);
            var testDODSBuffer = buildDODSBuffer('Url', 'http://test.com');

            var result = new xdr.dapUnpacker(testDODSBuffer, testDASVar).getValue();

            expect(result).toEqual('http://test.com');
        });

        it('should unpack a grid', function() {
            var gridDASVar = buildDASVar('Grid', []);
            var DASarray = buildDASVar('Float64', [2, 3]);
            var DASchild1 = buildDASVar('Int32', [2]);
            var DASchild2 = buildDASVar('Int32', [3]);

            gridDASVar.array = DASarray;
            gridDASVar.maps = [DASchild1, DASchild2];

            //Calculate the combined buffer length
            //Array member count, array start,  6 Float 64 array members, map1 member count, map1 start, 2 int32 map1 members, map2 member count, map2 start, 3 map2 members
            var gridBufferLength = 1 * UINT32_SIZE + 1 * UINT32_SIZE + 6 * FLOAT64_SIZE + 1 * UINT32_SIZE + 1 * UINT32_SIZE + 2 * UINT32_SIZE + 1 * UINT32_SIZE + 1 * UINT32_SIZE + 3 * UINT32_SIZE;

            //Build the sequence buffer
            var gridBuffer = new ArrayBuffer(gridBufferLength);
            var gridView = new DataView(gridBuffer);

            //Set up our buffer writer
            var bufferIndex = 0;

            function _writeValueToOutputBuffer(valueType, value) {
                if (valueType === 'Byte') {
                    gridView.setUint8(bufferIndex, value);
                    bufferIndex += UINT8_SIZE;
                }
                else if (valueType === 'Int32' || valueType === 'Int') {
                    gridView.setInt32(bufferIndex, value);
                    bufferIndex += INT32_SIZE;
                }
                else if (valueType === 'Uint32' || valueType === 'Uint') {
                    gridView.setUint32(bufferIndex, value);
                    bufferIndex += UINT32_SIZE;
                }
                else if (valueType === 'Int16') {
                    gridView.setInt16(bufferIndex, value);
                    bufferIndex += INT16_SIZE;
                }
                else if (valueType === 'Uint16') {
                    gridView.setUint16(bufferIndex, value);
                    bufferIndex += INT16_SIZE;
                }
                else if (valueType === 'Float32') {
                    gridView.setFloat32(bufferIndex, value);
                    bufferIndex += FLOAT32_SIZE;
                }
                else if (valueType === 'Float64') {
                    gridView.setFloat64(bufferIndex, value);
                    bufferIndex += FLOAT64_SIZE;
                }
                else if (valueType === 'String' || valueType === 'Url') {
                    //Write the length
                    _writeValueToOutputBuffer('Uint32', value.length);

                    for (var charIndex = 0; charIndex < value.length; charIndex++) {
                        _writeValueToOutputBuffer('Byte', value.charCodeAt(charIndex) & 0x00ff);
                    }
                }
            }

            //Write gridded data
            _writeValueToOutputBuffer('Uint32', 6); //Number of float64 to follow
            _writeValueToOutputBuffer('Uint32', 0); //Data start
            _writeValueToOutputBuffer('Float64', 1.1);
            _writeValueToOutputBuffer('Float64', 1.2);
            _writeValueToOutputBuffer('Float64', 1.3);
            _writeValueToOutputBuffer('Float64', 2.1);
            _writeValueToOutputBuffer('Float64', 2.2);
            _writeValueToOutputBuffer('Float64', 2.3);

            //Map 1 data
            _writeValueToOutputBuffer('Uint32', 2); //Number of int32 to follow
            _writeValueToOutputBuffer('Uint32', 0); //Data start
            _writeValueToOutputBuffer('Int32', 1);
            _writeValueToOutputBuffer('Int32', 2);

            //Map 2 data
            _writeValueToOutputBuffer('Uint32', 3); //Number of int32 to follow
            _writeValueToOutputBuffer('Uint32', 0); //Data start
            _writeValueToOutputBuffer('Int32', 11);
            _writeValueToOutputBuffer('Int32', 22);
            _writeValueToOutputBuffer('Int32', 33);

            var result = new xdr.dapUnpacker(gridBuffer, gridDASVar).getValue();

            expect(result).toEqual([[[1.1, 1.2, 1.3], [2.1, 2.2, 2.3]], [1, 2], [11, 22, 33]]);
        });

        it('should unpack a sequence', function() {
            var END_OF_SEQUENCE_MARK = 2768240640;

            var sequenceDASVar = buildDASVar('Sequence', []);
            var DASchild1 = buildDASVar('Int32', [3]);
            var DASchild2 = buildDASVar('Float64', [3]);

            sequenceDASVar.CHILD1 = DASchild1;
            sequenceDASVar.CHILD2 = DASchild2;

            //A sequence starts and ends with a mark, marks are Uint32
            //[MARK][CHILD1 DATA][CHILD2 DATA]...[END OF SEQUENCE MARK]

            //Calculate the combined buffer length
            //2 marks, 3 int 32, child 1 member count, child 1 start, 3 float 64, child 2 member count, child 2 start
            var sequenceBufferLength = 2 * UINT32_SIZE + 3 * UINT32_SIZE + 1 * UINT32_SIZE + 1 * UINT32_SIZE + 3 * FLOAT64_SIZE + 1 * UINT32_SIZE + 1 * UINT32_SIZE;

            //Build the sequence buffer
            var sequenceBuffer = new ArrayBuffer(sequenceBufferLength);
            var sequenceView = new DataView(sequenceBuffer);

            //Set up our buffer writer
            var bufferIndex = 0;

            function _writeValueToOutputBuffer(valueType, value) {
                if (valueType === 'Byte') {
                    sequenceView.setUint8(bufferIndex, value);
                    bufferIndex += UINT8_SIZE;
                }
                else if (valueType === 'Int32' || valueType === 'Int') {
                    sequenceView.setInt32(bufferIndex, value);
                    bufferIndex += INT32_SIZE;
                }
                else if (valueType === 'Uint32' || valueType === 'Uint') {
                    sequenceView.setUint32(bufferIndex, value);
                    bufferIndex += UINT32_SIZE;
                }
                else if (valueType === 'Int16') {
                    sequenceView.setInt16(bufferIndex, value);
                    bufferIndex += INT16_SIZE;
                }
                else if (valueType === 'Uint16') {
                    sequenceView.setUint16(bufferIndex, value);
                    bufferIndex += INT16_SIZE;
                }
                else if (valueType === 'Float32') {
                    sequenceView.setFloat32(bufferIndex, value);
                    bufferIndex += FLOAT32_SIZE;
                }
                else if (valueType === 'Float64') {
                    sequenceView.setFloat64(bufferIndex, value);
                    bufferIndex += FLOAT64_SIZE;
                }
                else if (valueType === 'String' || valueType === 'Url') {
                    //Write the length
                    _writeValueToOutputBuffer('Uint32', value.length);

                    for (var charIndex = 0; charIndex < value.length; charIndex++) {
                        _writeValueToOutputBuffer('Byte', value.charCodeAt(charIndex) & 0x00ff);
                    }
                }
            }

            //Write the start marker
            _writeValueToOutputBuffer('Uint32', 0);

            //Write child 1 data
            _writeValueToOutputBuffer('Uint32', 3); //Number of int32 to follow
            _writeValueToOutputBuffer('Uint32', 0); //Data start
            _writeValueToOutputBuffer('Int32', 11);
            _writeValueToOutputBuffer('Int32', 12);
            _writeValueToOutputBuffer('Int32', 13);

            //Child 2 data
            _writeValueToOutputBuffer('Uint32', 3); //Number of floats to follow
            _writeValueToOutputBuffer('Uint32', 0); //Data start
            _writeValueToOutputBuffer('Float64', 1);
            _writeValueToOutputBuffer('Float64', 2);
            _writeValueToOutputBuffer('Float64', 3);

            //End of sequence marker
            _writeValueToOutputBuffer('Uint32', END_OF_SEQUENCE_MARK);

            var result = new xdr.dapUnpacker(sequenceBuffer, sequenceDASVar).getValue();

            expect(result).toEqual([[[11, 12, 13], [1, 2, 3]]]);
        });
    });

    describe('buffer creation', function() {
        it('should convert a text array to an arrayBuffer, truncating UTF8 to 8 bits', function() {
            var testData = String.fromCharCode(0x0000, 0x00ff, 0xff00, 0xffff);

            var result = xdr.getBuffer(testData);
            var resultDataView = new DataView(result);

            expect(resultDataView.byteLength).toBe(4);
            expect(resultDataView.getUint8(0)).toEqual(0x00);
            expect(resultDataView.getUint8(1)).toEqual(0xff);
            expect(resultDataView.getUint8(2)).toEqual(0x00);
            expect(resultDataView.getUint8(3)).toEqual(0xff);
        });
    });
});
