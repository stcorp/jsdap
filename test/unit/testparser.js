describe('parser functions', function() {
    describe('dds parser', function() {
        it('handles byte members', function() {
            var testDDS = 'Dataset {Byte TEST[TEST = 12];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Byte');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [12];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles int members', function() {
            var testDDS = 'Dataset {Int TEST[TEST = 14];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Int');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [14];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles uint members', function() {
            var testDDS = 'Dataset {Uint TEST[TEST = 6];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Uint');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [6];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles int16 members', function() {
            var testDDS = 'Dataset {Int16 TEST[TEST = 66];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Int16');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [66];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles uint16 members', function() {
            var testDDS = 'Dataset {Uint16 TEST[TEST = 24];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Uint16');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [24];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles int32 members', function() {
            var testDDS = 'Dataset {Int32 TEST[TEST = 32];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Int32');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [32];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles uint32 members', function() {
            var testDDS = 'Dataset {Uint32 TEST[TEST = 32];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Uint32');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [32];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles float32 members', function() {
            var testDDS = 'Dataset {Float32 TEST[TEST = 32];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Float32');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [32];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles float64 members', function() {
            var testDDS = 'Dataset {Float64 TEST[TEST = 64];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Float64');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [64];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles string members', function() {
            var testDDS = 'Dataset {String TEST[TEST = 128];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('String');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [128];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles url members', function() {
            var testDDS = 'Dataset {Url TEST[TEST = 256];} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Url');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [256];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles grid members', function() {
            var testDDS = 'Dataset {Grid {Array: Float32 TEST[dim1 = 12][dim2 = 90][dim3 = 180]; Maps: Float64 dim1[dim1 = 12]; Float64 dim2[dim2 = 90]; Float64 dim3[dim3 = 180];} TEST;} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var arrayDapType = new dapType('Float32');
            arrayDapType.name = 'TEST';
            arrayDapType.dimensions = ['dim1', 'dim2', 'dim3'];
            arrayDapType.shape = [12, 90, 180];
            arrayDapType.id = 'TEST.TEST';

            var dim1DapType = new dapType('Float64');

            dim1DapType.name = 'dim1';
            dim1DapType.dimensions = ['dim1'];
            dim1DapType.shape = [12];

            var dim2DapType = new dapType('Float64');

            dim2DapType.name = 'dim2';
            dim2DapType.dimensions = ['dim2'];
            dim2DapType.shape = [90];

            var dim3DapType = new dapType('Float64');

            dim3DapType.name = 'dim3';
            dim3DapType.dimensions = ['dim3'];
            dim3DapType.shape = [180];

            var testDapType = new dapType('Grid');

            testDapType.name = 'TEST';
            testDapType.array = arrayDapType;
            testDapType.maps = {dim1: dim1DapType, dim2: dim2DapType, dim3: dim3DapType};
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles sequence members', function() {
            var testDDS = 'Dataset {Sequence {String symbol; String date; Float64 price;} TEST;} test%2Enc;';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var symbolDapType = new dapType('String');
            symbolDapType.name = 'symbol';
            symbolDapType.dimensions = [];
            symbolDapType.shape = [];
            symbolDapType.id = 'TEST.symbol';

            var dateDapType = new dapType('String');
            dateDapType.name = 'date';
            dateDapType.dimensions = [];
            dateDapType.shape = [];
            dateDapType.id = 'TEST.date';

            var priceDapType = new dapType('Float64');
            priceDapType.name = 'price';
            priceDapType.dimensions = [];
            priceDapType.shape = [];
            priceDapType.id = 'TEST.price';

            var sequenceDapType = new dapType('Sequence');
            sequenceDapType.name = 'TEST';
            sequenceDapType.symbol = symbolDapType;
            sequenceDapType.date = dateDapType;
            sequenceDapType.price = priceDapType;
            sequenceDapType.id = 'TEST';

            datasetDapType.TEST = sequenceDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });
    });

    describe('das parser', function() {
        //Build a test, parsed DDS that we can feed the DAS parser
        var testParsedDDS = new dapType('Dataset');

        testParsedDDS.name = 'test%2Enc';
        testParsedDDS.id = 'test%2Enc';

        var childDapType = new dapType('Byte');

        childDapType.name = 'TEST';
        childDapType.dimensions = [];
        childDapType.shape = [];
        childDapType.id = 'TEST';

        testParsedDDS.TEST = childDapType;

        it('handles byte members', function() {
            var testDAS = 'Attributes {TEST { Byte test_attr 8; }}';

            var datasetDapType = new dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Byte');
            testDapType.attributes = {test_attr: 8};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });
    });
});
