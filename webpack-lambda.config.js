const path = require('path');
const webpack = require('webpack');

// List of modules that are not essential for Lambda and can be ignored
// or assumed to be available in the Node.js runtime
const lazyImports = [
  '@nestjs/microservices',
  '@nestjs/websockets/socket-module',
  'cache-manager',
  'class-validator',
  'class-transformer',
  // Add other non-essential lazy imports here as needed
];

module.exports = function (options) {
  return {
    // We target 'node' for a backend application
    target: 'node',
    // Set mode to 'production' for optimal bundling
    mode: 'production',
    
    // The entry point should be your lambda handler file
    entry: ['./src/lambda.ts'], //

    // Output configuration
    output: {
      // The path to the output directory
      path: path.join(__dirname, 'dist'),
      // The name of the bundled file
      filename: 'lambda-bundle.js',
      // Specifies the module format for CommonJS (necessary for AWS Lambda)
      libraryTarget: 'commonjs2',
    },

    // Enable source maps for easier debugging
    devtool: 'source-map',

    // Configure how modules are resolved (e.g., handling TypeScript extensions)
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
            "@bansay": path.resolve("./src")
      }
    },

    // Module rules (loaders)
    module: {
       rules: [
        {
          test: /\.ts?$/,
          use: {
            loader: 'ts-loader',
            options: {
              // Explicitly point to your tsconfig.json file
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
          exclude: /node_modules|spec\.ts/,
        },
      ],
    },

    // Plugins configuration
    plugins: [
      ...(options.plugins || []),
      // Ignore specific lazy-loaded modules to reduce bundle size
      // Use a simple RegEx pattern for the IgnorePlugin
      new webpack.IgnorePlugin({
        resourceRegExp: new RegExp(lazyImports.join('|'))
      }),
    ],

    // Externals: you generally want to bundle all dependencies for Lambda, 
    // unless you use Lambda Layers. Setting to empty array ensures all node_modules are bundled.
    externals: [
       
    ],
  };
};