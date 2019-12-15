const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const cwd = process.cwd();



const DIST_FOLDER = 'dist';
const SRC_PATH = path.join(cwd, 'src');
const YAML_PATHS = [
  SRC_PATH,
  path.join(cwd, 'resources'),
];

console.log('CWWWWWWDDDD',cwd, SRC_PATH);  // /Users/krasutski.dmitri/Desktop/Leasing/src

var browserConfig = {
    entry: './src/browser/index.js',
    output: {
        path: path.join(cwd, DIST_FOLDER),
        publicPath: '/',
        filename: 'bundle.js',
        filename: '[name].[chunkhash].bundle.js',
        chunkFilename: 'static/[id].[chunkhash].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
              test: /\.s?css$/,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    minimize: true,
                  },
                },
                'postcss-loader',
                'sass-loader',
                {
                  loader: 'sass-resources-loader',
                  options: {
                  //  resources: path.resolve(cwd, 'resources/theme/resources.scss'),
                  },
                },
              ],
            },
            {
              test: /\.yaml$/,
              include: YAML_PATHS,
              loader: 'yml-loader',
            },

        ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.css', '.scss'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: cwd,
          postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
        },
      }),
      new WebpackMd5Hash(),
    ],

};

var serverConfig = {
    entry: path.join(SRC_PATH, 'server/server'),
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.js', '.jsx', '.css', '.scss'],
    },
    output: {
        path: path.join(cwd, DIST_FOLDER),
        filename: 'server.js',
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          query: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  node: 8,
                },
              }],
            ],
          },
        },

      ],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: cwd,
          postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
        },
      }),
      new WebpackMd5Hash(),
    ],

};

module.exports = [browserConfig, serverConfig];
