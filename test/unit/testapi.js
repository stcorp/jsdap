describe('api functions', function() {
    //The necessary require statements for testing against node
    if (typeof require !== 'undefined' && module.exports) {
        jsdap = require('../../src/api');
    }

    describe('jsdap loadDataset', function() {
        it('should make a request to the specified url', function() {
            spyOn(XMLHttpRequest.prototype, 'send').and.callFake(function(data) {
                expect(data).toEqual('');
            });

            function dummyCallback() {

            }

            jsdap.loadDataset('http://test.com', dummyCallback, null);
        });
    });
});
