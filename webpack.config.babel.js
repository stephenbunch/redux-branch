/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import webpack from 'webpack';

module.exports = {
  entry: `${__dirname}/src/index`,
  output: {
    path: `${__dirname}/bundles`,
    filename: 'redux-branch.js',
    library: 'ReduxBranch',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel', include: `${__dirname}/src` },
    ],
  },
  externals: {
    'react': 'React',
  },
};
