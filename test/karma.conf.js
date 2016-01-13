module.exports = function (config) {
    config.set({
        basePath: '../',
        files: [
            'src/*.js',
            'test/unit/*.js',
        ],
        exclude: [],
        singleRun: true,
        frameworks: ['jasmine'],
        browsers: ['Chrome', 'Firefox'],
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
        ],
    });
};
