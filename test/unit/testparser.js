describe('parser functions', function() {
    describe('dds parser', function() {
        it('handles byte members', function() {
            var testDDS = 'Dataset {Byte TEST[TEST = 12];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [12];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles int members', function() {
            var testDDS = 'Dataset {Int TEST[TEST = 14];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Int');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [14];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles uint members', function() {
            var testDDS = 'Dataset {Uint TEST[TEST = 6];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Uint');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [6];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles int16 members', function() {
            var testDDS = 'Dataset {Int16 TEST[TEST = 66];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Int16');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [66];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles uint16 members', function() {
            var testDDS = 'Dataset {Uint16 TEST[TEST = 24];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Uint16');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [24];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles int32 members', function() {
            var testDDS = 'Dataset {Int32 TEST[TEST = 32];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Int32');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [32];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles uint32 members', function() {
            var testDDS = 'Dataset {Uint32 TEST[TEST = 32];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Uint32');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [32];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles float32 members', function() {
            var testDDS = 'Dataset {Float32 TEST[TEST = 32];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Float32');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [32];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles float64 members', function() {
            var testDDS = 'Dataset {Float64 TEST[TEST = 64];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Float64');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [64];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles string members', function() {
            var testDDS = 'Dataset {String TEST[TEST = 128];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('String');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [128];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles url members', function() {
            var testDDS = 'Dataset {Url TEST[TEST = 256];} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Url');

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [256];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles grid members', function() {
            var testDDS = 'Dataset {Grid {Array: Float32 TEST[dim1 = 12][dim2 = 90][dim3 = 180]; Maps: Float64 dim1[dim1 = 12]; Float64 dim2[dim2 = 90]; Float64 dim3[dim3 = 180];} TEST;} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var arrayDapType = new parser.dapType('Float32');
            arrayDapType.name = 'TEST';
            arrayDapType.dimensions = ['dim1', 'dim2', 'dim3'];
            arrayDapType.shape = [12, 90, 180];
            arrayDapType.id = 'TEST.TEST';

            var dim1DapType = new parser.dapType('Float64');

            dim1DapType.name = 'dim1';
            dim1DapType.dimensions = ['dim1'];
            dim1DapType.shape = [12];

            var dim2DapType = new parser.dapType('Float64');

            dim2DapType.name = 'dim2';
            dim2DapType.dimensions = ['dim2'];
            dim2DapType.shape = [90];

            var dim3DapType = new parser.dapType('Float64');

            dim3DapType.name = 'dim3';
            dim3DapType.dimensions = ['dim3'];
            dim3DapType.shape = [180];

            var testDapType = new parser.dapType('Grid');

            testDapType.name = 'TEST';
            testDapType.array = arrayDapType;
            testDapType.maps = {dim1: dim1DapType, dim2: dim2DapType, dim3: dim3DapType};
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles sequence members', function() {
            var testDDS = 'Dataset {Sequence {String symbol; String date; Float64 price;} TEST;} test%2Enc;';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var symbolDapType = new parser.dapType('String');
            symbolDapType.name = 'symbol';
            symbolDapType.dimensions = [];
            symbolDapType.shape = [];
            symbolDapType.id = 'TEST.symbol';

            var dateDapType = new parser.dapType('String');
            dateDapType.name = 'date';
            dateDapType.dimensions = [];
            dateDapType.shape = [];
            dateDapType.id = 'TEST.date';

            var priceDapType = new parser.dapType('Float64');
            priceDapType.name = 'price';
            priceDapType.dimensions = [];
            priceDapType.shape = [];
            priceDapType.id = 'TEST.price';

            var sequenceDapType = new parser.dapType('Sequence');
            sequenceDapType.name = 'TEST';
            sequenceDapType.symbol = symbolDapType;
            sequenceDapType.date = dateDapType;
            sequenceDapType.price = priceDapType;
            sequenceDapType.id = 'TEST';

            datasetDapType.TEST = sequenceDapType;

            var result = new parser.ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });
    });

    describe('das parser', function() {
        //Build a test, parsed DDS that we can feed the DAS parser
        var testParsedDDS = new parser.dapType('Dataset');

        testParsedDDS.name = 'test%2Enc';
        testParsedDDS.id = 'test%2Enc';

        var childDapType = new parser.dapType('Byte');

        childDapType.name = 'TEST';
        childDapType.dimensions = [];
        childDapType.shape = [];
        childDapType.id = 'TEST';

        testParsedDDS.TEST = childDapType;

        it('handles byte members', function() {
            var testDAS = 'Attributes {TEST { Byte test_attr 8; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: 8};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles int members', function() {
            var testDAS = 'Attributes {TEST { Int test_attr 959; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: 959};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles uint members', function() {
            var testDAS = 'Attributes {TEST { Uint test_attr 911; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: 911};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles int16 members', function() {
            var testDAS = 'Attributes {TEST { Int16 test_attr -10289; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: -10289};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles uint16 members', function() {
            var testDAS = 'Attributes {TEST { Uint16 test_attr 10289; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: 10289};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles int32 members', function() {
            var testDAS = 'Attributes {TEST { Int32 test_attr -124765; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: -124765};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles uint32 members', function() {
            var testDAS = 'Attributes {TEST { Byte test_attr 124765; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: 124765};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles float32 members', function() {
            var testDAS = 'Attributes {TEST { Float32 test_attr -1.2e34; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: -1.2e34};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles float64 members', function() {
            var testDAS = 'Attributes {TEST { Float64 test_attr 1e32; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: 1e32};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles string members', function() {
            var testDAS = 'Attributes {TEST { String test_attr "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ;-_"; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: '"ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ;-_"'};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });

        it('handles url members', function() {
            var testDAS = 'Attributes {TEST { Url test_attr "http://test.com"; }}';

            var datasetDapType = new parser.dapType('Dataset');

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new parser.dapType('Byte');
            testDapType.attributes = {test_attr: '"http://test.com"'};

            testDapType.name = 'TEST';
            testDapType.dimensions = [];
            testDapType.shape = [];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new parser.dasParser(testDAS, testParsedDDS).parse();

            expect(result).toEqual(datasetDapType);
        });
    });
});
