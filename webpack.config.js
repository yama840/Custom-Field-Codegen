const path = require('path');

module.exports = [
  // Figma側のコード (code.ts)
  {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './code.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'code.js',
      path: path.resolve(__dirname, 'dist')
    }
  },
  // UI側のコード (React)
  {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.css']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
];