describe('xdr functions', function() {
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
