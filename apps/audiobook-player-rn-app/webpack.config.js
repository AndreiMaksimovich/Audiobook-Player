const path = require('path');

module.exports = {
    mode: 'development', // production
    entry: './src/web-service-worker.ts',
    output: {
        filename: 'service-worker.js',
        path: path.resolve(__dirname, 'public'),
    },
    resolve: {
        extensions: ['.web.ts', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, ''),
            "react-native$": "react-native-web",
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                noEmit: false, // Override tsconfig.json here
                                module: "preserve",
                                moduleDetection: "force",
                                moduleResolution: "bundler",
                            },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    target: 'node',
};
