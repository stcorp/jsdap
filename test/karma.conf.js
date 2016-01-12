module.exports = function (config) {
    config.set({
        basePath: '../',
        files: [
            'jsdap.js',
            'test/unit/*.js',
        ],
        exclude: [],
        singleRun: true,
        frameworks: ['jasmine'],
        browsers: ['Chrome', 'Firefox'],
        plugins: [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
        ],
    });
};
