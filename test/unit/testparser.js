describe('parser functions', function() {
    describe('dds parser', function() {
        it('handles byte members', function() {
            var testDDS = 'Dataset {Byte TEST[TEST = 12];} test%2Enc;';

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Byte', {});

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

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Int', {});

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

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Uint', {});

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

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Int16', {});

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

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Uint16', {});

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

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Int32', {});

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

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Uint32', {});

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

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Float32', {});

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

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Float64', {});

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

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('String', {});

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

            var datasetDapType = new dapType('Dataset', {});

            datasetDapType.name = 'test%2Enc';
            datasetDapType.id = 'test%2Enc';

            var testDapType = new dapType('Url', {});

            testDapType.name = 'TEST';
            testDapType.dimensions = ['TEST'];
            testDapType.shape = [256];
            testDapType.id = 'TEST';

            datasetDapType.TEST = testDapType;

            var result = new ddsParser(testDDS).parse();

            expect(result).toEqual(datasetDapType);
        });
    });
});
