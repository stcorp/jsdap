//Define ArrayBuffer slice for IE10
if (!ArrayBuffer.prototype.slice) {
    ArrayBuffer.prototype.slice = function (begin, end) {
        if (begin === void 0) {
            begin = 0;
        }
        if (end === void 0) {
            end = this.byteLength;
        }
        begin = Math.floor(begin);
        end = Math.floor(end);
        if (begin < 0) {
            begin += this.byteLength;
        }
        if (end < 0) {
            end += this.byteLength;
        }
        begin = Math.min(Math.max(0, begin), this.byteLength);
        end = Math.min(Math.max(0, end), this.byteLength);
        if (end - begin <= 0) {
            return new ArrayBuffer(0);
        }
        var result = new ArrayBuffer(end - begin);
        var resultBytes = new Uint8Array(result);
        var sourceBytes = new Uint8Array(this, begin, end - begin);
        resultBytes.set(sourceBytes);
        return result;
    };
}
