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
    });
});
